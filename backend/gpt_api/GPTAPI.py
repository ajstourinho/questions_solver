from dotenv import load_dotenv
import base64
import os
import requests
import json
from pdf2image import convert_from_path
from fpdf import FPDF
import re
from .assistant_instructions import assistant_instructions
from docx import Document

load_dotenv()

# Define current directory, for relative paths
current_dir = os.path.dirname(os.path.abspath(__file__))

# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

# Class for GPT API instance
class GPTAPI:
    def __init__(self):
        self.API_KEY = os.getenv("API_KEY")
        self.MAX_TOKENS_PER_API_CALL = os.getenv("MAX_TOKENS_PER_API_CALL")
        self.gpt_model = "gpt-4-turbo-2024-04-09"
        self.assistant_instructions = assistant_instructions

    def gpt_get_response(self, image_basename):
        print(f"Making request for OpenAI API...")

        # Getting the base64 string for image
        image_path = os.path.join(current_dir, 'output_0_areas', f'{image_basename}.png')
        base64_image = encode_image(image_path)

        # Define headers
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.API_KEY}"
        }

        # Define parameters for API call
        payload = {
            "model": self.gpt_model,
            "messages": [
                {
                "role": "user",
                "content": [
                    {
                    "type": "text",
                    "text": self.assistant_instructions
                    },
                    {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{base64_image}"
                    }
                    }
                ]
                }
            ],
            "max_tokens": int(self.MAX_TOKENS_PER_API_CALL)
        }

        # Make API call
        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)

        return response
    
    def generate_json(self, image_basename):
        # Make GPT API call for respective image
        response = self.gpt_get_response(image_basename)
        response_data = response.json()
        self.save_response_data_as_json(image_basename, response_data)

    def save_img(self, image_basename, image):
        image_path = os.path.join(current_dir, 'output_0_areas', image_basename + ".png")
        image.save(image_path, 'PNG')

    def save_response_data_as_json(self, image_basename, response_data) -> None:
        print(f"Saving data as JSON: {image_basename}")

        # Extract the 'choices' field from the response
        choices_data = response_data['choices']

        # Define the content string
        content = choices_data[0]['message']['content']

        # Clean content string
        content = content.replace("```", "")
        content = content.replace("json", "")
        content = content.replace("\n", "")

        # Transform content string to JSON
        try:
            # Attempt to load the string as JSON
            parsed_json = json.loads(content, strict=False)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON: {e}")

        # Specify the filename you want to write to
        filepath = os.path.join(current_dir, 'output_1_jsons', f'{image_basename}.json')
        
        # Write the 'choices' data to a file
        with open(filepath, 'w', encoding='utf-8') as file:
            json.dump(parsed_json, file, indent=2, ensure_ascii=False)

    def find_matching_files(self, file_basename, directory):
        """
        This function has O(N) time complexity, where N is the total number of files in the given directory.
        """
        # This regex pattern will match any file that contains the file_basename anywhere in the filename.
        pattern = re.compile(rf"{re.escape(file_basename)}")

        # List all files in the given directory
        files = os.listdir(directory)

        # Filter files that match the pattern
        matching_files = [os.path.join(directory, file) for file in files if pattern.match(file)]

        return matching_files

    def insert_json_data_into_pdf_instance(self, json_data, pdf_instance, question_num):
        # Add page to PDF
        pdf_instance.add_page()

        # Display Question Number
        pdf_instance.set_font("DejaVu", style='B', size=12)
        pdf_instance.cell(200, 7, txt=f"Questão {question_num})", ln=True)
        pdf_instance.cell(200, 7, txt="", ln=True)

        # Display Question 'enunciado'
        question_enunciado = json_data["enunciado"]
        pdf_instance.set_font("DejaVu", style='', size=11)
        pdf_instance.multi_cell(190, 7, txt=question_enunciado)

        if json_data['tipo'] == "Objetiva":
            pdf_instance.cell(200, 5, txt="", ln=True)
            for key, value in json_data['resposta'].items():
                if key != "alternativaCorreta":
                    text_alternativa = key.upper() + ')  ' + value['alternativa']
                    pdf_instance.multi_cell(190, 7, txt=text_alternativa)
                    pdf_instance.cell(200, 4, txt="", ln=True)

        # Display Question 'resposta';
        pdf_instance.cell(190, 10, txt="", ln=True)
        pdf_instance.set_font("DejaVu", style='B', size=12)
        pdf_instance.cell(200, 7, txt="Solução:", ln=True)
        pdf_instance.cell(200, 7, txt="", ln=True)

        pdf_instance.set_font("DejaVu", style='', size=11)
        if json_data['tipo'] == "Discursiva":
            pdf_instance.multi_cell(190, 7, txt=json_data['resposta'])
        elif json_data['tipo'] == "Objetiva":
            for key, value in json_data['resposta'].items():
                if key != "alternativaCorreta":
                    textoExplicativo = key.upper() + ')  ' + value['textoExplicativo']
                    pdf_instance.multi_cell(180, 7, txt=textoExplicativo)
                    pdf_instance.cell(200, 4, txt="", ln=True)

            pdf_instance.cell(190, 10, txt="", ln=True)
            pdf_instance.set_font("DejaVu", style='B', size=12)
            pdf_instance.cell(200, 7, txt='Alternativa correta: ', ln=True)

            pdf_instance.set_font("DejaVu", style='', size=11)
            pdf_instance.cell(200, 7, txt=json_data['resposta']['alternativaCorreta'].upper(), ln=True)

    def generate_pdf_from_jsons(self, file_basename):

        # Define JSON files
        json_directory = os.path.join(current_dir, 'output_1_jsons')
        files_paths = self.find_matching_files(file_basename, json_directory)

        # Create PDF instance
        pdf_instance = FPDF()
        font_dejavu_path = os.path.join(current_dir, 'dejavu_font', 'ttf', 'DejaVuSans.ttf')
        pdf_instance.add_font('DejaVu', '', font_dejavu_path, uni=True)
        font_dejavu_bold_path = os.path.join(current_dir, 'dejavu_font', 'ttf', 'DejaVuSans-Bold.ttf')
        pdf_instance.add_font('DejaVu', 'B', font_dejavu_bold_path, uni=True)  

        # Iterate over JSON files, and add content do PDF
        for i, file_path in enumerate(files_paths):
            with open(file_path, 'r') as file:
                json_data = json.load(file)

            question_num = i+1
            self.insert_json_data_into_pdf_instance(json_data, pdf_instance, question_num)

        # Save PDF
        output_path_name = os.path.join(current_dir, 'output_2_pdfs', file_basename + "_resolvida.pdf")
        pdf_instance.output(output_path_name)

    def insert_json_data_into_doc_instance(self, json_data, doc_instance, question_num):
        # Display Question Number
        doc_instance.add_paragraph().add_run(f"Questão {question_num})").bold = True

        # Display Question 'enunciado'
        doc_instance.add_paragraph().add_run(json_data['enunciado'])

        if json_data['tipo'] == "Objetiva":
            for key, value in json_data['resposta'].items():
                if key != "alternativaCorreta":
                    p1 = doc_instance.add_paragraph()
                    p1.add_run(key.upper() + ')  ' + value['alternativa'])
                    
            doc_instance.add_paragraph('\n')

        # Display Question 'resposta';
        p2 = doc_instance.add_paragraph()
        p2.add_run('Solução:').bold = True

        if json_data['tipo'] == "Discursiva":
            doc_instance.add_paragraph().add_run(json_data['resposta'])
        elif json_data['tipo'] == "Objetiva":
            for key, value in json_data['resposta'].items():
                if key != "alternativaCorreta":
                    p3 = doc_instance.add_paragraph(key.upper() + ')  ')
                    p3.add_run(value['textoExplicativo'])

            doc_instance.add_paragraph('\n')

            p4 = doc_instance.add_paragraph()
            p4.add_run('Alternativa correta: ').bold = True

            doc_instance.add_paragraph(json_data['resposta']['alternativaCorreta'].upper())

    def generate_doc_from_jsons(self, file_basename):
        # Define JSON files
        json_directory = os.path.join(current_dir, 'output_1_jsons')
        files_paths = self.find_matching_files(file_basename, json_directory)

        # Create Doc instance
        doc_instance = Document()

        # Iterate over JSON files, and add content do PDF
        for i, file_path in enumerate(files_paths):
            with open(file_path, 'r') as file:
                json_data = json.load(file)

            question_num = i+1
            self.insert_json_data_into_doc_instance(json_data, doc_instance, question_num)

            # Add page break only if it is not the last one
            if i != len(files_paths) - 1:
                doc_instance.add_page_break()

        # Save Doc
        output_path_name = os.path.join(current_dir, 'output_2_pdfs', file_basename + "_resolvida.docx")
        doc_instance.save(output_path_name)

    def gpt_solver(self, pdf_filename):
        """
        Endpoint to activate GPT API on previously uploaded file, after having confirmed the payment.
        """

        # Define the path of uploaded PDF file, based on the filename
        pdf_path = os.path.join(current_dir, "uploaded_files", pdf_filename)

        # Define file basename (without extension)
        file_basename, _ = os.path.splitext(pdf_filename)

        # Generate iterable of PDF pages as images
        pdf_pages_as_imgs = convert_from_path(pdf_path)

        # Iterate images
        for i, image in enumerate(pdf_pages_as_imgs):
            # Define image basename (without extension)
            image_basename = f"{file_basename}_page_{str(i+1).zfill(4)}" # Without extension

            # Save image as .png
            self.save_img(image_basename, image)

            # Call GPT API to generate JSON from processed image
            self.generate_json(image_basename)

        # Generate PDF from JSONs
        self.generate_pdf_from_jsons(file_basename)
        self.generate_doc_from_jsons(file_basename)

        return
