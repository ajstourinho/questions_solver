import { useEffect, useState } from "react";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import UploadButton from "../components/UploadButton/UploadButton";
import SolveButton from "../components/SolveButton/SolveButton";
import exampleImg from "../assets/exampleInitialPage_transp-min.png";
import exampleImgMobile from "../assets/exampleInitialPage_vertical_transp-min.png";
import ModalFrame from "../components/ModalFrame/ModalFrame";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";
import bannerImage from "../assets/medical_computer_banner-min.png";

export default function NewInitialPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const paymentStatus = useSelector(
    (state: RootState) => state.paymentModalSlice.paymentStatus
  );

  useEffect(() => {
    if (paymentStatus === "CONCLUIDA") {
      setOpenSnackbar(true);
    }
  }, [paymentStatus]);

  const handleCloseSnackbar = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };
  return (
    <>
      {/* Payment confirmation snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={15000}
        onClose={handleCloseSnackbar}
        message="Note archived"
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" variant="filled" sx={{ width: "100%" }}>
          Pagamento confirmado! Sua prova será resolvida e enviada por e-mail.
        </Alert>
      </Snackbar>

      {/* Modal */}
      <ModalFrame />

      {/* Bloco Principal: Metade da tela para o texto e botões */}
      <Grid
        item
        xs={isMobile ? 12 : 6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "left",
        }}
      >
        {/* Título */}
        <Typography
          variant="h1"
          sx={{
            fontFamily: "Poppins, Arial, sans-serif",
            fontWeight: 900,
            fontSize: 40,
            pl: isMobile ? 1 : 12,
            pt: isMobile ? 1 : 8,
            textAlign: "left",
          }}
        >
          Resolva sua Prova Antiga <br /> de Medicina! 🧑‍🏫
        </Typography>

        {/* Subtítulo */}
        <Typography
          variant="h5"
          sx={{
            mt: 3,
            px: isMobile ? 1 : 12,
            maxWidth: "420px",
            textAlign: "left",
            color: "#555",
            fontSize: isMobile ? 18 : 23,
          }}
        >
          Selecione{" "}
          <Typography
            component="span"
            variant="h5"
            style={{ color: "#0098BA" }}
            sx={{
              fontWeight: "bold",
              fontSize: isMobile ? 18 : 23,
            }}
          >
            1 arquivo PDF
          </Typography>{" "}
          de uma <u>prova antiga</u> e deixe a nossa ferramenta{" "}
          <strong>resolvê-la automaticamente!</strong>
        </Typography>

        {/* Alerta para Mobile */}
        {isMobile ? (
          <Alert severity="warning" sx={{ mt: 2, textAlign: "left" }}>
            <b>Atenção: Use no Desktop 💻</b>
            <br />
            <br />
            Para melhor desempenho, acesse via computador. <br />
            <br />
            Versão mobile chegando em breve!
          </Alert>
        ) : (
          <>
            {/* Botões */}
            <Grid
              container
              style={{ textAlign: "center" }}
              sx={{ mt: 4, pl: isMobile ? 0 : 12 }}
            >
              {/* Botão de upload */}
              <Grid item sx={{ mx: 1 }}>
                <UploadButton />
              </Grid>

              {/* Botão de resolver */}
              <Grid item sx={{ mx: 1 }}>
                <SolveButton />
              </Grid>
            </Grid>
          </>
        )}
      </Grid>

      {/* Bloco para a Imagem: Metade da tela para a imagem */}
      {isMobile ? (
        false
      ) : (
        <Grid
          item
          xs={6}
          sx={{
            display: "flex",
            justifyContent: "center",
            pt: 10,
          }}
        >
          <Box
            component="img"
            src={bannerImage}
            alt="Imagem Descritiva"
            style={{ maxWidth: "80%", height: "auto" }}
            sx={{ pr: 7 }}
          />
        </Grid>
      )}

      {/* Seção de exemplo */}
      <Grid item xs={12} sx={{ mt: isMobile ? 5 : 0 }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: "Poppins, Arial, sans-serif",
            fontWeight: 900,
            fontSize: isMobile ? 25 : 35,
            textAlign: "center",
          }}
        >
          <strong>Confira um exemplo!</strong>
        </Typography>
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          backgroundColor: "#C5E3E9",
          marginTop: 1,
          width: "80vw",
        }}
      >
        <Box
          component="img"
          src={isMobile ? exampleImgMobile : exampleImg}
          alt="exampleImg"
          style={{ width: "80vw", marginBottom: 20 }}
        />
      </Grid>
    </>
  );
}
