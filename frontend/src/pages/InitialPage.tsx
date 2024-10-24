import React, { useEffect } from "react";
import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { hideSnackbar, showSnackbar } from "../store/slices/SnackbarSlice";
import UploadButton from "../components/UploadButton/UploadButton";
import SolveButton from "../components/SolveButton/SolveButton";
import ModalFrame from "../components/ModalFrame/ModalFrame";
import bannerImage from "../assets/medical_computer_banner-min.png";
import exampleImg from "../assets/exampleInitialPage_transp-min.png";
import exampleImgMobile from "../assets/exampleInitialPage_vertical_transp-min.png";

export default function InitialPage() {
  const deviceType = useSelector(
    (state: RootState) => state.deviceSlice.deviceType
  ) as "mobile" | "tablet" | "desktop";
  const dispatch = useDispatch();
  const paymentStatus = useSelector(
    (state: RootState) => state.paymentModalSlice.paymentStatus
  );
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  console.log(deviceType);
  React.useEffect(() => {
    if (paymentStatus === "CONCLUIDA") {
      dispatch(
        showSnackbar({
          status: "success",
          message:
            "Pagamento confirmado! Sua prova será resolvida e enviada por e-mail.",
        })
      );
    }
  }, [paymentStatus, dispatch]);

  return (
    <>
      {/* Snackbar with Alert */}
      <Snackbar
        open={useSelector((state: RootState) => state.snackbarSlice.open)}
        autoHideDuration={15000}
        onClose={() => dispatch(hideSnackbar())}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          severity={useSelector(
            (state: RootState) => state.snackbarSlice.status
          )}
          variant="filled"
          sx={{
            width: "100%",
            fontSize: deviceType === "mobile" ? "0.8rem" : "1rem",
          }}
        >
          {useSelector((state: RootState) => state.snackbarSlice.message)}
        </Alert>
      </Snackbar>

      {/* Modal */}
      <ModalFrame />

      {/* Bloco Principal: Metade da tela para o texto e botões */}
      <Grid
        item
        xs={12}
        md={isSmallScreen ? 12 : 6}
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
            pl: deviceType === "mobile" ? 1 : 12,
            pt: deviceType === "mobile" ? 1 : 8,
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
            px: deviceType === "mobile" ? 1 : 12,
            maxWidth: "420px",
            textAlign: "left",
            color: "#555",
            fontSize: deviceType === "mobile" ? 18 : 23,
          }}
        >
          Selecione{" "}
          <Typography
            component="span"
            variant="h5"
            style={{ color: "#0098BA" }}
            sx={{
              fontWeight: "bold",
              fontSize: deviceType === "mobile" ? 18 : 23,
            }}
          >
            1 arquivo PDF
          </Typography>{" "}
          de uma <u>prova antiga</u> e deixe a nossa ferramenta{" "}
          <strong>resolvê-la automaticamente!</strong>
        </Typography>

        {/* Alerta para Mobile ou Tablet*/}
        {deviceType === "desktop" ? (
          <>
            {/* Botões */}
            <Grid
              container
              style={{ textAlign: "center" }}
              sx={{ mt: 4, pl: 12 }}
            >
              <>
                {/* Botão de upload */}
                <Grid item sx={{ mx: 1 }}>
                  <UploadButton />
                </Grid>

                {/* Botão de resolver */}
                <Grid item sx={{ mx: 1 }}>
                  <SolveButton />
                </Grid>
              </>
            </Grid>
          </>
        ) : (
          <Alert severity="warning" sx={{ mt: 2, textAlign: "left" }}>
            <b>Atenção: Use no Desktop 💻</b>
            <br />
            <br />
            Para melhor desempenho, acesse via computador. <br />
            <br />
            Versão mobile chegando em breve!
          </Alert>
        )}
      </Grid>

      {/* Bloco para a Imagem: Metade da tela para a imagem */}
      {deviceType !== "mobile" && !isSmallScreen && (
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
            sx={{
              width: "80%",
              height: "auto",
              pr: 7,
            }}
            style={{ objectFit: "contain" }}
          />
        </Grid>
      )}

      {/* Seção de exemplo */}
      <Grid item xs={12} sx={{ mt: deviceType === "mobile" ? 5 : 0 }}>
        <Typography
          variant="h2"
          sx={{
            fontFamily: "Poppins, Arial, sans-serif",
            fontWeight: 900,
            fontSize: deviceType === "mobile" ? 25 : 35,
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
          src={deviceType === "mobile" ? exampleImgMobile : exampleImg}
          alt="exampleImg"
          style={{ width: "80vw", marginBottom: 20 }}
        />
      </Grid>
    </>
  );
}
