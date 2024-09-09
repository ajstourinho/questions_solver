from dotenv import load_dotenv
import base64
import os
import requests
import json
from pdf2image import convert_from_path

from .assistant_instructions import assistant_instructions

load_dotenv()
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

    def gpt_get_response(self, image_name):
        print(f"Making request for OpenAI API...")

        # Getting the base64 string for image
        image_path = os.path.join(current_dir, 'output_0_areas', f'{image_name}.png')
        base64_image = encode_image(image_path)

        # Define headers
        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {self.API_KEY}"
        }
        #

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
    
    def process_pdf_into_imgs_and_make_requests(self, file_basename):
        # Define paths of PDF input, and images output
        pdf_path = os.path.join(current_dir, 'uploaded_files', f'{file_basename}.pdf')

        # Generate iterable of PDF pages
        images = convert_from_path(pdf_path)

        # Save each page as a separate PNG file
        for i, image in enumerate(images):
            image_basename = f"{file_basename}_page_{i+1}" # Without extension
            image_path = os.path.join(current_dir, 'output_0_areas', image_basename + ".png")
            image.save(image_path, 'PNG')

            # Make GPT API call for respective image
            gpt_response = self.gpt_get_response(image_basename)
            gpt_data = self.get_data_from_response(gpt_response)
            self.save_response_data_as_json(image_basename, gpt_data)

    def get_data_from_response(self, response):
        return response.json()
    
    def save_response_data_as_json(self, image_name, response_data) -> None:
        print(f"Saving data as JSON: {image_name}")

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
        filepath = os.path.join(current_dir, 'output_1_jsons', f'{image_name}.json')
        
        # Write the 'choices' data to a file
        with open(filepath, 'w', encoding='utf-8') as file:
            json.dump(parsed_json, file, indent=2, ensure_ascii=False)
