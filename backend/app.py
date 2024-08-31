from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_pymongo import PyMongo
import gridfs
import os
from pix_api.PixAPI  import PixAPI
import re

app = Flask(__name__)
CORS(app)
pix_service = PixAPI(True)
# Configure MongoDB URI (replace with your MongoDB URI)
app.config['MONGO_URI'] = 'mongodb://my-database:27017/my_database'

# Initialize PyMongo
mongo = PyMongo(app)

UPLOAD_FOLDER = './uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file:
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], file.filename)
        file.save(file_path)
        return jsonify({'message': 'File uploaded successfully', 'file_path': file_path}), 200
    
@app.route('/')
def index():
    return jsonify({"message": "Hello, world! This is the Flask backend."})

@app.route('/login', methods=['POST'])
def login():
    user_data = request.json
    email = user_data.get('email')  # Obtém o email do usuário a partir dos dados enviados

    users = mongo.db.users  # 'users' é o nome da coleção MongoDB

    # Verifica se já existe um usuário com esse email
    existing_user = users.find_one({'email': email})

    if existing_user:
        # Se o usuário já existe, retorna uma mensagem indicando sucesso sem criar um novo
        return jsonify({'message': 'User already exists. No new record created.'}), 200
    else:
        # Se o usuário não existe, insere um novo usuário
        user_id = users.insert_one(user_data).inserted_id
        print(f'User added with ID: {user_id}')
        return jsonify({'message': 'New user created successfully'}), 201


@app.route('/data', methods=['GET', 'POST'])
def post_data():
    # Handle POST request
    data = request.json
    print(data)  # Do something with the data

    # Pymongo test
    user_data = {
        'username': 'john_doe',
        'email': 'john@example.com',
    }
    users = mongo.db.users  # 'users' is the name of the MongoDB collection
    user_id = users.insert_one(user_data).inserted_id
    print(f'User added with ID: {user_id}')
    
    return jsonify({'message': 'POST request successful'})

@app.route('/image', methods=['GET'])
def get_image():
    filename="image.png"
    fs = gridfs.GridFS(mongo.db, collection='images')  # Using the custom prefix 'images'

    try:
        # Use GridFS to get the file with the specified prefix
        grid_out = fs.find_one({'filename': filename})
        if not grid_out:
            return 'File not found', 404

        # Create a response with the image data
        response = Response(grid_out.read(), mimetype='image/png')  # Adjust the mimetype accordingly
        return response
    except Exception as e:
        return str(e), 500

@app.route('/cob', methods=['POST'])
def pix_new_cob():
    """
    Endpoint to create a new PIX charge.

    This endpoint receives a JSON payload with a 'val' field that represents the amount to be charged.
    It validates the value format and calls the pix_service to create a new charge.

    Expected Input:
        - JSON object containing:
            - "val" (str): A string representing the amount to be charged.
              It must match the format '^\d{1,10}\.\d{2}$', which means:
                - 1 to 10 digits before the dot (e.g., "123.45", "1000000.00").
                - Exactly two digits after the dot (e.g., "12.34").

    Expected Output:
        - On success (HTTP 200):
            - JSON object containing:
                - "locId" (str): The location ID of the created PIX charge.
        
        - On failure (HTTP 500):
            - A string with the error message.
    """
    try:
        data = request.json
        if not data['val']:
            pass #throw custom exception
        if not bool(re.match(r'^\d{1,10}\.\d{2}$', data['val'])):
            pass #throw custom exception
        pix_response = pix_service.createCharge(value = data['val'])
        return jsonify({'locId': pix_response['locId']}), 200
    except Exception as e:
        return str(e), 500

@app.route('/qrcode', methods=['POST'])
def pix_qrcode():
    """
    Endpoint to generate a Base64-encoded QR code for a given PIX charge.

    This endpoint receives a JSON payload with a 'locId' field that represents the location ID of an existing PIX charge.
    It uses the pix_service to generate a QR code for that charge.

    Expected Input:
        - JSON object containing:
            - "locId" (str): A string representing the location ID of the PIX charge.
              This ID is used to generate the corresponding QR code.

    Expected Output:
        - On success (HTTP 200):
            - JSON object containing:
                - "qrcode" (str): A Base64-encoded string of the QR code image, without the prefix 'data:image/png;base64,'.
        
        - On failure (HTTP 500):
            - A string with the error message.

    """
    try:
        data = request.json
        if not data['locId']:
            pass #throw custom exception
        pix_response = pix_service.getB64QRCode(locId = data['locId'])
        print(pix_response)
        return jsonify({'qrcode': pix_response['b64Img']}), 200
    except Exception as e:
        return str(e), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
