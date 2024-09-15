import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import { setPixCopiaECola } from "../../../store/slices/PaymentModalSlice";
import axiosInstance from "../../../axios/axiosInstance";
import { Box, Grid, Typography, Divider } from "@mui/material";
import QRCodeImage from "../../QRCodeImage/QRCodeImage";
import { PDFDocument } from "pdf-lib";
import Skeleton from "@mui/material/Skeleton";
import { closeModal } from "../../../store/slices/ModalControlSlice";
import CopyTextField from "../../CopyTextField/CopyTextField";

function formatToCurrency(value: number): string {
  let formattedValue = value.toFixed(2);
  formattedValue = formattedValue.replace(".", ",");
  return `${formattedValue}`;
}

function ModalPage3Payment() {
  const dispatch = useDispatch();

    const files = useSelector((state: RootState) => state.filesSlice.files);
    const filenames = useSelector(
      (state: RootState) => state.filesSlice.filenames
    );
    const price = useSelector((state: RootState) => state.checkoutSlice.price);
    const pageCount = useSelector(
      (state: RootState) => state.checkoutSlice.pageCount
    );
    const open = useSelector(
      (state: RootState) => state.modalControlSlice.open
    );

    const handleClose = () => {
      dispatch(closeModal());
    };

    const [b64qrCode, setb64qrCode] = useState<string | null>(null);

    useEffect(() => {
      const getQrCodeAsync = async function () {
        try {
          const cobResponse = await axiosInstance.post(
            "/cob",
            { val: price.toFixed(2) },
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

    // test of gpt api
    async function handleClick() {
      const filename = filenames[0];

      try {
        // Step 1: Fetch the PDF as a binary blob
        const response = await axiosInstance.post(
          "/gpt_solver",
          { filename, pageCount },
          {
            headers: { "Content-Type": "application/json" },
            responseType: "arraybuffer", // PDF data as binary
          }
        );

        // Step 2: Load the PDF into pdf-lib (optional if manipulation is needed)
        const pdfDoc = await PDFDocument.load(response.data);

        // Step 3: Save the modified or unmodified PDF back into bytes
        const pdfBytes = await pdfDoc.save();

        // Step 4: Create a Blob and trigger a download
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const url = window.URL.createObjectURL(blob);

        // Automatically trigger download
        const link = document.createElement("a");
        link.href = url;
        const customFilename = `prova_resolvida_${files[0].name}`;
        link.setAttribute("download", customFilename);
        document.body.appendChild(link);
        link.click();

        // Clean up
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error("Error downloading PDF:", error);
      }
    }
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
        <CopyTextField value="" />
      </Box>

      {/* Divisor */}
      <Divider sx={{ mt: 1 }} />

      {/* Dados */}
      <Grid container spacing={2} sx={{ mt: 0, textAlign: "left" }}>
        {/* Arquivo PDF */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body2"
              component="span"
              sx={{ fontWeight: "bold", textDecoration: "underline" }}
            >
              Arquivo PDF:
            </Typography>

            <Typography
              variant="body2"
              color="grey"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "180px", // Set width for truncation
                ml: 1,
              }}
            >
              {files[0] && files[0].name}
            </Typography>
          </Box>
        </Grid>

        {/* Valor */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", textDecoration: "underline" }}
            >
              Valor:
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }} color="grey">
              R$ {formatToCurrency(price.valueOf())}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body2"
              component="span"
              sx={{ fontWeight: "bold", textDecoration: "underline" }}
            >
              Status:
            </Typography>
            <Typography
              variant="body2"
              component="span"
              color="#BF6900"
              sx={{ ml: 1 }}
            >
              Aguardando pagamento...
            </Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Divisor */}
      <Divider sx={{ mt: 2, mb: 1 }} />

      <Typography variant="caption" color="grey">
        A prova começará a ser resolvida após o pagamento.
      </Typography>
    </>
  );
}

export default ModalPage3Payment;
