import { Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import UploadButton from "../components/UploadButton/UploadButton";
import SolveButton from "../components/SolveButton/SolveButton";
import exampleImg from "../assets/exampleInitialPage_transp-min.png";
import exampleImgMobile from "../assets/exampleInitialPage_vertical_transp-min.png";
import ModalFrame from "../components/ModalFrame/ModalFrame";
// import dotenv from 'dotenv'

// dotenv.config({ path: '../../../.env' })
// const reaisPerPage = Number(process.env.REAIS_PER_PAGE);

export default function InitialPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <>
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
          textAlign: "center", // Ensures the text inside is centered
        }}
      >
        {" "}
        <Typography
          variant="h4"
          sx={{ fontFamily: "Roboto Mono, monospace", fontWeight: "bold" }}
        >
          Resolva provas antigas com IA 🤖
        </Typography>
        <Typography variant="h5" sx={{ mt: 3, maxWidth: "400px" }}>
          Faça upload de{" "}
          <Typography
            component="span"
            variant="h5"
            style={{ color: "#0098BA" }}
            sx={{ fontFamily: "Roboto Mono, monospace", fontWeight: "bold" }}
          >
            1 arquivo PDF
          </Typography>{" "}
          de uma <u>prova antiga </u> e deixe a IA{" "}
          <strong>resolvê-la automaticamente!</strong>
        </Typography>
        <Typography
          variant="overline"
          color="textSecondary"
          sx={{ marginTop: "15px",}}
        >
          Certifique-se que há{" "}
          <strong>
            somente <br />
            uma 1 questão por página.
          </strong>
        </Typography>
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
