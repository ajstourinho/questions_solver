from dotenv import load_dotenv
import base64
import os
import requests
import json

from .assistant_instructions import assistant_instructions

load_dotenv()

# Function to encode the image
def encode_image(image_path):
  with open(image_path, "rb") as image_file:
    return base64.b64encode(image_file.read()).decode('utf-8')

# Class for GPT API instance
class GPTAPI:
    def __init__(self):
        self.API_KEY = os.getenv("API_KEY")
        self.MAX_TOKENS_PER_API_CALL = os.getenv("MAX_TOKENS_PER_API_CALL")
        self.uploaded_images_folder = "./uploaded_files"
        self.gpt_model = "gpt-4-turbo-2024-04-09"
        self.assistant_instructions = assistant_instructions
        self.json_outputs_folder = "./json_outputs_folder"

    def gpt_request(self, image_name : str):
        print(f"Making request for OpenAI API...")

        # Getting the base64 string for image
        image_path = os.path.join(os.getcwd(), self.uploaded_images_folder, image_name)
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

        # If it does not exist, create folder for outputs
        if not os.path.exists(self.json_outputs_folder):
            os.makedirs(self.json_outputs_folder)

        # Specify the filename you want to write to
        filepath = os.path.join(self.json_outputs_folder, image_name)

        # Add JSON extension
        filepath += ".json"
        
        # Write the 'choices' data to a file
        with open(filepath, 'w', encoding='utf-8') as file:
            json.dump(parsed_json, file, indent=2, ensure_ascii=False)

