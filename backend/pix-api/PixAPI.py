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
            "certificate": os.path.abspath(os.getenv("KEY_PEM_PATH"))
        })
        
    def createCharge(self, value: str, expiration: int = 3600) -> dict:
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
        params = {
           'id': locId
        }
        response =  efi.api.pix_generate_qrcode(params=params)
        return {"b64Img": response['imagemQrcode'].replace('data:image/png;base64,', ''), "fullResponse": response}

if __name__=="__main__":
    efi = PixAPI(True)
    id = efi.createCharge('5.00')["locId"]
    print(id)
    print(efi.getB64QRCode(id))