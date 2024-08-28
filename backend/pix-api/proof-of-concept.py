#Desenvolvido pela Consultoria Técnica da Efí
import requests
import base64
from dotenv import load_dotenv
import os

load_dotenv()

credentials = {
  "client_id": os.getenv("CLIENT_ID"),
  "client_secret": os.getenv("CLIENT_SECRET"),
}

certificado = os.path.abspath(os.getenv("KEY_PEM_PATH"))  # A variável certificado é o diretório em que seu certificado em formato .pem deve ser inserido

auth = base64.b64encode(
  (f"{credentials['client_id']}:{credentials['client_secret']}"
   ).encode()).decode()

url = "https://pix-h.api.efipay.com.br/oauth/token"  #Para ambiente de Homologacao

payload="{\r\n    \"grant_type\": \"client_credentials\"\r\n}"
headers = {
  'Authorization': f"Basic {auth}",
  'Content-Type': 'application/json'
}

response = requests.request("POST",
                          url,
                          headers=headers,
                          data=payload,
                          cert=certificado)

print(response.text)