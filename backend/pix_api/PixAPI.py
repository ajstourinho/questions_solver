from efipay import EfiPay
from dotenv import load_dotenv
import os
import random
import string

load_dotenv()

def getRandomString(size=28):
    caracteres = string.ascii_letters + string.digits
    resultado = ''.join(random.choice(caracteres) for _ in range(size))
    return resultado

class PixAPI:
    def __init__(self, sandBox : bool):
        self.api = EfiPay({
            "client_id": os.getenv("CLIENT_ID"),
            "client_secret": os.getenv("CLIENT_SECRET"),
            "sandbox": sandBox, # True: Hom |  False: Prod
            "certificate": os.getenv("KEY_PEM_PATH")
        })
        
    def createCharge(self, value: str, expiration: int = 3600) -> dict:
        """
        Creates a PIX charge with the specified value and expiration time.

        This function generates a new charge request using the PIX API. It creates a charge with the given value and expiration time, and returns a dictionary containing the location ID of the charge and the full response from the API.

        Args:
            value (str): The amount to be charged, represented as a string. It should be formatted as a decimal number (e.g., "100.00" for one hundred units of currency).
            expiration (int, optional): The time in seconds until the charge expires. Defaults to 3600 seconds (1 hour).

        Returns:
            dict: A dictionary with the following keys:
                - "locId": The location ID of the created charge, extracted from the API response.
                - "fullResponse": The complete response from the PIX API, containing details about the charge.
        """
        params = {
            'txid': getRandomString()
        }
        body = {
            'calendario': {
                'expiracao': expiration
            },
            'valor': {
                'original': value
            },
            'chave': os.getenv("PIX_RECEIVER_KEY")
        }
        response =  self.api.pix_create_charge(params=params,body=body)
        return {"locId": response['loc']['id'], "fullResponse": response}
    
    def getB64QRCode(self, locId: str):
        """
        Retrieves a Base64-encoded QR code image for a given location ID.

        This function calls the PIX API to generate a QR code based on the specified location ID. It returns a dictionary containing the Base64 representation of the QR code image and the full response from the API.

        Args:
            locId (str): The location ID associated with the PIX charge for which the QR code should be generated.

        Returns:
            dict: A dictionary with the following keys:
                - "b64Img": A string containing the Base64-encoded image of the QR code, with the prefix `data:image/png;base64,` removed.
                - "fullResponse": The complete response from the PIX API, containing details about the QR code generation.
        """
        params = {
           'id': locId
        }
        response =  self.api.pix_generate_qrcode(params=params)
        return {"b64Img": response['imagemQrcode'].replace('data:image/png;base64,', ''), "fullResponse": response}

if __name__=="__main__":
    efi = PixAPI(True)
    id = efi.createCharge('5.00')["locId"]
    print(id)
    print(efi.getB64QRCode(id))