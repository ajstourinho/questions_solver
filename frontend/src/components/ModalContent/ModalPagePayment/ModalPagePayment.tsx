import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import {
  setPixCopiaECola,
  setTxid,
} from "../../../store/slices/PaymentModalSlice";
import axiosInstance from "../../../axios/axiosInstance";
import { Box, Typography, Divider } from "@mui/material";
import QRCodeImage from "../../QRCodeImage/QRCodeImage";
import Skeleton from "@mui/material/Skeleton";
import CopyTextField from "../../CopyTextField/CopyTextField";
import PaymentData from "../../PaymentData/PaymentData"


function getRandomString(size = 28) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
  for (let i = 0; i < size; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function ModalPagePayment() {
  const price = useSelector((state: RootState) => state.checkoutSlice.price);
  const open = useSelector((state: RootState) => state.modalControlSlice.open);

  const [b64qrCode, setb64qrCode] = useState<string | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const txid = getRandomString();
    dispatch(setTxid(txid));

    const getQrCodeAsync = async function () {
      try {
        const cobResponse = await axiosInstance.post(
          "/cob",
          { val: price.toFixed(2), txid: txid },
          { headers: { "Content-Type": "application/json" } }
        );
        if (cobResponse.status !== 200) {
          throw Error(`/cob response failed: ${cobResponse.data}`);
        }
        const locID = cobResponse.data["locId"];
        console.log(cobResponse);
        dispatch(setPixCopiaECola(cobResponse.data["pixCopiaECola"]));
        const qrCodeResponse = await axiosInstance.post(
          "/qrcode",
          { locId: locID },
          { headers: { "Content-Type": "application/json" } }
        );
        if (qrCodeResponse.status !== 200) {
          throw Error(`/qrcode response failed: ${qrCodeResponse.data}`);
        }
        setb64qrCode(qrCodeResponse.data["qrcode"]);
      } catch (error) {
        console.log("Error:", error);
      }
    };

    if (open && price.valueOf() !== 0) {
      getQrCodeAsync();
    }
  }, [open, price, dispatch]);

  return (
    <>
      <Typography variant="h6" component="h2" sx={{ mt: 1, mb: 1 }}>
        Fazer pagamento Pix
      </Typography>

      {/* QR Code */}
      <Typography variant="subtitle2">
        Escaneie o QR Code abaixo para pagar:
      </Typography>
      {b64qrCode ? (
        <QRCodeImage base64String={b64qrCode} />
      ) : (
        <Skeleton
          variant="rectangular"
          width={200}
          height={200}
          sx={{ margin: "auto" }}
        />
      )}

      {/* Codigo Pix Copia-e-Cola */}
      <Box sx={{ mt: 2, textAlign: "left" }}>
        <Typography variant="subtitle2">
          Se preferir, copie e cole o código abaixo para pagar:
        </Typography>
        <CopyTextField value=""/>
      </Box>

      {/* Divisor */}
      <Divider sx={{ mt: 1 }} />

      {/* Dados */}
      <PaymentData />

      {/* Divisor */}
      <Divider sx={{ mt: 2, mb: 1 }} />

      <Typography variant="caption" color="grey">
        A prova começará a ser resolvida após o pagamento.
      </Typography>
    </>
  );
}

export default ModalPagePayment;
