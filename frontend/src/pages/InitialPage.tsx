import { useEffect, useState } from "react";
import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import UploadButton from "../components/UploadButton/UploadButton";
import SolveButton from "../components/SolveButton/SolveButton";
import exampleImg from "../assets/exampleInitialPage_transp-min.png";
import exampleImgMobile from "../assets/exampleInitialPage_vertical_transp-min.png";
import ModalFrame from "../components/ModalFrame/ModalFrame";
import Snackbar, { SnackbarCloseReason } from "@mui/material/Snackbar";
import { RootState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import Alert from "@mui/material/Alert";

export default function InitialPage() {
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

      <Grid
        item
        xs={12}
        sx={{
          marginTop: "25px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* Título */}
        <Typography
          variant="h4"
          sx={{
            fontFamily: "Roboto Mono, monospace",
            fontWeight: "bold",
            textAlign: "center", // Ensures the text inside is centered
          }}
        >
          Resolva sua Prova Antiga <br /> de Medicina! 🧑‍🏫
        </Typography>

        {/* Subtítulo */}
        <Typography
          variant="h5"
          sx={{
            mt: 3,
            maxWidth: "420px",
            textAlign: "center",
          }}
        >
          Selecione{" "}
          <Typography
            component="span"
            variant="h5"
            style={{ color: "#0098BA" }}
            sx={{ fontFamily: "Roboto Mono, monospace", fontWeight: "bold" }}
          >
            1 arquivo PDF
          </Typography>{" "}
          de uma{" "}
          <u>
            <i>prova antiga</i>{" "}
          </u>
          e deixe nossa ferramenta <strong>resolvê-la em instantes!</strong>{" "}
        </Typography>

        {/* Texto adicional */}
        {/* <Typography
          variant="overline"
          color="textSecondary"
          sx={{ marginTop: "15px",}}
        >
          Certifique-se que há{" "}
          <strong>
            somente <br />
            uma 1 questão por página.
          </strong>
        </Typography> */}
      </Grid>

      {/* Botões */}
      <Grid
        item
        container
        justifyContent="center"
        style={{ textAlign: "center" }}
        xs={12}
        sx={{ mt: 2 }}
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

      {/* Seção de exemplo */}
      <Grid item xs={12} sx={{ marginTop: 8 }}>
        <Typography variant="h5" sx={{ fontFamily: "Roboto Mono, monospace" }}>
          <strong>Confira um exemplo!</strong>
        </Typography>
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          backgroundColor: "#C5E3E9",
          marginTop: 1,
          width: "100%",
        }}
      >
        <img
          src={isMobile ? exampleImgMobile : exampleImg}
          alt="exampleImg"
          style={{ maxWidth: "90%", marginBottom: 20 }}
        />
      </Grid>
    </>
  );
}
