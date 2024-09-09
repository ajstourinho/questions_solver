from dotenv import load_dotenv
import base64
import os
import requests
import json
from pdf2image import convert_from_path
from docx import Document
from docx2pdf import convert
from fpdf import FPDF

from .assistant_instructions import assistant_instructions

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

    def generate_pdf_from_jsons(self, file_basename):

        data = {"nome": "alexandre", "idade": "25", "email": "meuemail"}

        # Criar instância de PDF
        pdf = FPDF()
        pdf.add_page()

        # Adicionar um título
        pdf.set_font("Arial", size=12)
        pdf.cell(200, 10, txt="Relatório de Dados", ln=True, align='C')

        # Adicionar os dados
        pdf.set_font("Arial", size=10)

        pdf.cell(200, 10, txt=f"Nome: {data['nome']}", ln=True)
        pdf.cell(200, 10, txt=f"Idade: {data['idade']}", ln=True)
        pdf.cell(200, 10, txt=f"Email: {data['email']}", ln=True)
        pdf.cell(200, 10, txt="", ln=True)  # Espaço entre entradas

        # Salvar o PDF
        output_path_name = os.path.join(current_dir, 'output_2_pdf', file_basename + "_resolvida.pdf")
        pdf.output(output_path_name)
