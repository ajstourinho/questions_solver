import React, { ReactNode } from "react";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import {
  Box,
  Button,
  Grid,
  Typography,
  TextField,
  Divider,
} from "@mui/material";
import fullLogo from "../../assets/full_logo.png";
import DownloadIcon from "@mui/icons-material/Download";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children?: ReactNode; // Adicionando children como propriedade opcional
}

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #777",
  boxShadow: 24,
  p: 4,
  borderRadius: "25px",
};

function formatToCurrency(value: number): string {
  // Ensure the value is a number and fix it to two decimal places
  let formattedValue = value.toFixed(2);
  formattedValue = formattedValue.replace(".", ",");
  // Add currency symbol (optional, default to $)
  return `${formattedValue}`;
}

const CustomModal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  const files = useSelector((state: RootState) => state.filesSlice.files);
  const price = useSelector((state: RootState) => state.checkoutSlice.price);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>

        {/* Modal Content */}
        <Box
          sx={{
            maxWidth: 400,
            p: 2,
            backgroundColor: "white",
            borderRadius: 2,
            textAlign: "center",
            margin: "auto",
          }}
        >
          {/* Logo */}
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <img
                src={fullLogo}
                alt="logo"
                style={{ maxWidth: "100px", height: "auto" }}
              />{" "}
            </Grid>
          </Grid>

          <Typography variant="h6" component="h2" sx={{ mt: 1, mb: 1 }}>
            Fazer pagamento Pix
          </Typography>

          {/* QR Code */}
          <Typography variant="subtitle2">
            Escaneie o QR Code abaixo para pagar:
          </Typography>
          <Grid container justifyContent="center" sx={{ mt: 2 }}>
            <img
              src="your-qr-code-url.png"
              alt="QR Code"
              style={{ width: 200, height: 200 }}
            />
          </Grid>
          <Box sx={{ mt: 2, textAlign: "left" }}>
            <Typography variant="subtitle2">
              Se preferir, pague copiando e colando o código abaixo:
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              value="1234kuyfgasfjkhg81778976t3412lhgdfasy"
              InputProps={{
                readOnly: true,
                sx: { fontSize: 14 },
              }}
              sx={{ mt: 1 }}
            />
          </Box>

          {/* Divisor */}
          <Divider sx={{ mt: 3 }} />

          {/* Dados */}
          <Grid container spacing={2} sx={{ mt: 1, textAlign: "left" }}>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Arquivo PDF:</strong> {files[0].name}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Valor:</strong> R$ {formatToCurrency(price.valueOf())}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2">
                <strong>Status:</strong> Aguardando pagamento...
              </Typography>
            </Grid>
          </Grid>

          {/* Botão */}
          <Grid container spacing={2} justifyContent="center">
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 4, padding: 1.5 }}
              endIcon={<DownloadIcon />}
              disabled={true}
            >
              PROVA RESOLVIDA!
            </Button>
            <Typography variant="caption" color="grey" sx={{mt: 1}}>
              A prova começará a ser resolvida após o pagamento.
            </Typography>
          </Grid>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomModal;
