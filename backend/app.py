from flask import Flask, request, jsonify, Response, send_file
from flask_cors import CORS
import gridfs
import os
from pix_api.PixAPI import PixAPI
from gpt_api.GPTAPI import GPTAPI
from mail_service.MailService import MailService
import re
from pdf2image import convert_from_path
from flask_mail import Mail, Message
import threading

# Initialize app with CORS
app = Flask(__name__)
CORS(app)

# Initialize API for payment (Pix)
pix_service = PixAPI(False) # True: Homolog |  False: Prod

# Initialize API for GPT
gpt_api = GPTAPI()

# Configuring the Flask-Mail extension
app.config['MAIL_SERVER'] = os.getenv("MAIL_SERVER")
app.config['MAIL_PORT'] = int(os.getenv('MAIL_PORT'))
app.config['MAIL_USE_TLS'] = True if (os.getenv('MAIL_USE_TLS')) == "True" else False 
app.config['MAIL_USERNAME'] = os.getenv("MAIL_USERNAME")
app.config['MAIL_PASSWORD'] = os.getenv("MAIL_PASSWORD")
app.config['MAIL_DEFAULT_SENDER'] = os.getenv("MAIL_DEFAULT_SENDER")
mail = Mail(app)

# Initialize Class Instance of Mail Services
mail_service = MailService(mail)

# Define current directory, for relative paths
current_dir = os.path.dirname(os.path.abspath(__file__))

# Define necessary folders
FOLDER_UPLOADED_FILES = os.path.join(current_dir, "gpt_api", "uploaded_files")
FOLDER_OUTPUT_0_AREAS = os.path.join(current_dir, "gpt_api", "output_0_areas")
FOLDER_OUTPUT_1_JSONS = os.path.join(current_dir, "gpt_api", "output_1_jsons")
FOLDER_OUTPUT_2_PDFS = os.path.join(current_dir, "gpt_api", "output_2_pdfs")

# Define list of necessary folders
folders_list = [
    FOLDER_UPLOADED_FILES,
    FOLDER_OUTPUT_0_AREAS,
    FOLDER_OUTPUT_1_JSONS,
    FOLDER_OUTPUT_2_PDFS
]

# Create folders if they do not yet exist
for folder in folders_list:
    if not os.path.exists(folder):
        os.makedirs(folder)

@app.route('/')
def index():
    """
    Basic index endpoint
    """
    return jsonify({"message": "Hello, world! This is the Flask backend."})


@app.route('/upload', methods=['POST'])
def upload_file():
    """
    Endpoint to receive and save files (with custom filenames) uploaded from user.
    """
    if 'file' not in request.files or 'filename' not in request.form:
        return jsonify({'error': 'No file or filename provided'}), 400

    file = request.files['file']
    custom_filename = request.form['filename']

    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    
    if file:
        file_path = os.path.join(FOLDER_UPLOADED_FILES, custom_filename)
        file.save(file_path)
        return jsonify({'message': 'File uploaded successfully', 'file_path': file_path}), 200
    

# @app.route('/gpt_solver', methods=['POST'])
def gpt_solver():
    """
    Endpoint to activate GPT API on previously uploaded file, after having confirmed the payment.
    """

    # Consider the filename and pageCount are being sent in the request body
    data = request.get_json()
    pdf_filename = data.get('filename')
    pdf_pageCount = int(data.get('pageCount'))

    # Define the path of uploaded PDF file, based on the filename
    pdf_directory = FOLDER_UPLOADED_FILES
    pdf_path = os.path.join(pdf_directory, pdf_filename)

    # Define file basename (without extension)
    file_basename, _ = os.path.splitext(pdf_filename)

    # Generate iterable of PDF pages as images
    pdf_pages_as_imgs = convert_from_path(pdf_path)

    # Iterate images
    for i, image in enumerate(pdf_pages_as_imgs):
        # Define image basename (without extension)
        image_basename = f"{file_basename}_page_{i+1}" # Without extension

        # Save image as .png
        gpt_api.save_img(image_basename, image)

        # Call GPT API to generate JSON from processed image
        gpt_api.generate_json(image_basename)

    # Generate PDF from JSONs
    gpt_api.generate_pdf_from_jsons(file_basename)

    # Send the PDF file as a downloadable response
    pdf_path_temp = os.path.join(FOLDER_OUTPUT_2_PDFS, file_basename + "_resolvida.pdf") 
    return send_file(
        pdf_path_temp,
        mimetype='application/pdf',  # Specify the MIME type as PDF
        as_attachment=True,  # Force the download
        download_name="prova_resolvida.pdf"  # Set the filename for the download
    )


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
        pix_response = pix_service.createCharge(value = data['val'], txid = data['txid'])
        return jsonify({'locId': pix_response['locId'], "pixCopiaECola": pix_response["pixCopiaECola"]}), 200
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
        return jsonify({'qrcode': pix_response['b64Img']}), 200
    except Exception as e:
        return str(e), 500


@app.route('/status_pix/<txid>', methods=['GET'])
def status_pix(txid):
    status_cobranca = pix_service.consultar_status_pix(txid)
    
    if 'status' in status_cobranca and status_cobranca['status'] == 'CONCLUIDA':
        return jsonify({'status': 'CONCLUIDA', 'mensagem': 'Pagamento realizado com sucesso!'})
    else:
        return jsonify({'status': status_cobranca.get('status', 'N/A'), 'mensagem': 'Pagamento não concluído.'})


@app.route('/confirm_payment', methods=['POST'])
def confirm_payment():
    data = request.json

    userEmail = data["userEmail"].strip()
    pdf_filename = data["filenames"][0]

    # Função para rodar o processamento do pedido no contexto correto
    def process_order(userEmail):
        with app.app_context():
            mail_service.notify_admin_and_user_payment_confirmation(userEmail)
            gpt_api.gpt_solver(pdf_filename)
            mail_service.send_admin_and_user_output_file(userEmail, pdf_filename)

    # Iniciar uma thread para continuar o processamento em segundo plano
    threading.Thread(target=process_order, args=(userEmail,)).start()

    # Retorna a resposta para o frontend imediatamente
    return jsonify({'message': "Pagamento confirmado. Processamento iniciado"}), 200

# @app.route('/send_email', methods=['GET'])
# def send_email():
#     user_email = "ajstourinho@gmail.com"  # You can replace this with dynamic email from a form or session
#     subject = "Hello from Flask with Attachment."
#     body = "This email contains an attachment sent from a Flask route!"

#     try:
#         msg = Message(subject, recipients=[user_email])
#         msg.body = body

#         # Attach a file to the email
#         with app.open_resource(os.path.join(current_dir, "gpt_api", "uploaded_files", "myfile_2024-09-15_03-01-55.pdf")) as fp:
#             msg.attach("file.pdf", "application/pdf", fp.read())

#         mail.send(msg)
#         return f"Email with attachment successfully sent to {user_email}!"
#     except Exception as e:
#         return f"Failed to send email with attachment. Error: {str(e)}"
    
if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')
