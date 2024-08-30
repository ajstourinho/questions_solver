from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_pymongo import PyMongo
import gridfs
import os

app = Flask(__name__)
CORS(app)

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

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
