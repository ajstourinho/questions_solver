from dotenv import load_dotenv
from flask import Flask, request, jsonify, Response
from flask_cors import CORS
from flask_pymongo import PyMongo
import gridfs
import os
from pix_api.PixAPI import PixAPI
import re
import ssl


# Loading Environment
load_dotenv()
base_dir = os.path.abspath(os.path.dirname(__file__))

# Initialize app with CORS
app = Flask(__name__)
CORS(app)

# Initialize API for payment (Pix)
pix_service = PixAPI(False)

# Configure backend folder for users uploads
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
        # TO DO: RETURN THE TXID TO USE IN WEBHOOK
        return jsonify({'locId': pix_response['locId'], 'txid': pix_response['txid']}), 200
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

@app.route('/createhook', methods=['POST'])
def register():
    data = request.json
    if not data['status']:
        pass #throw custom exception
    if not data['msg']:
        pass #throw custom exception
    pix_service.createHook(os.getenv("EFI_PUBLIC_TLS_CRT_PATH"), webHookUrl='?')

@app.route('/listenhook', methods=["POST"])
def listenHook():
  print(request.json)
  response = {"status": 200}
  return jsonify(response)
    
@app.route("/listenhook/pix", methods=["POST"])
def listenHook():
  print(request.json)
  response = {"status": 200}
  return jsonify(response)

if __name__ == '__main__':
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.verify_mode = ssl.CERT_REQUIRED
    context.load_verify_locations(os.path.join(base_dir, os.getenv("EFI_PUBLIC_TLS_CRT_PATH")))
    context.load_cert_chain(os.path.join(base_dir, os.getenv("SRV_PUBLIC_TLS_CRT_PATH")),
                            os.path.join(base_dir, os.getenv("SRV_PUBLIC_TLS_KEY_PATH")))
    app.run(ssl_context=context, debug=True, host='0.0.0.0')
