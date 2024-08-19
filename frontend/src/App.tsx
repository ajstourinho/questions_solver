import React, { useState } from "react";
import fullLogo from "./assets/full_logo.png";
import pixIcon from "./assets/pix_icon.webp";
import exampleImg from "./assets/exampleInitialPage_reduced.jpg";
import { Grid, Button, Typography, Box } from "@mui/material";
import { UploadFile, ShoppingCart } from "@mui/icons-material";

function App() {
  const [value, setValue] = useState(20.3);

  function formatToCurrency(value: number): string {
    // Ensure the value is a number and fix it to two decimal places
    let formattedValue = value.toFixed(2);
    formattedValue = formattedValue.replace(".", ",");

    // Add currency symbol (optional, default to $)
    return `${formattedValue}`;
  }

  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      alignItems="center"
      style={{ textAlign: "center" }}
    >
      <Grid item xs={12} sx={{ marginTop: "50px" }}>
        <img
          src={fullLogo}
          alt="logo"
          style={{ maxWidth: "200px", height: "auto" }}
        />
      </Grid>

      <Grid item xs={12} sx={{ marginTop: "10px" }}>
        <Typography variant="h5">
          Faça o upload de{" "}
          <Typography
            component="span"
            variant="h5"
            style={{ color: "dodgerblue" }}
          >
            1 arquivo PDF
          </Typography>{" "}
          de uma prova antiga
        </Typography>
        <Typography variant="h5">
          e deixe a IA <strong>resolvê-la automaticamente!</strong>
        </Typography>

        <Typography
          variant="subtitle1"
          color="textSecondary"
          sx={{ marginTop: "5px" }}
        >
          Certifique-se que há <strong>somente uma 1 questão por página</strong>
          .
        </Typography>
      </Grid>

      <Grid item xs={12} style={{ marginTop: 20 }}>
        <Box display="flex" flexDirection="column" alignItems="center">
          <Button
            variant="contained"
            component="label"
            startIcon={<UploadFile />}
            style={{
              marginBottom: 15,
              backgroundColor: "#E0E0E0",
              color: "#000",
            }}
          >
            SELECIONE ARQUIVO PDF
            <input type="file" hidden />
          </Button>
          <Button
            variant="contained"
            color="primary"
            style={{ marginBottom: 10, width: "200px" }}
          >
            RESOLVER!
          </Button>

          <Box display="flex" alignItems="center" style={{ marginTop: 5 }}>
            <Box display="flex">
              <img src={pixIcon} alt="pixIcon" style={{ maxWidth: "20px" }} />
              <ShoppingCart style={{ marginRight: 5 }} />
              <Typography variant="subtitle1" color="textSecondary">
                R$ {formatToCurrency(value)}
              </Typography>
            </Box>
          </Box>
          <Box>
            <Typography variant="caption" style={{ marginLeft: 5 }}>
              (R$ 3,00 por questão)
            </Typography>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={12} sx={{ marginTop: 15 }}>
        <Typography variant="h4">Confira um exemplo!</Typography>
      </Grid>

      <Grid
        item
        xs={12}
        sx={{ backgroundColor: "rgb(175, 210, 237)", marginTop: 1, width: "100%" }}
      >
        <img src={exampleImg} alt="exampleImg" style={{ maxWidth: "80%", marginBottom: 20 }} />
      </Grid>

      {/* Footer Section */}
      <Grid
        item
        xs={12}
        style={{
          backgroundColor: "#f5f5f5",
          padding: "10px 0",
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item xs={4} style={{ textAlign: "left", paddingLeft: "20px" }}>
            <Typography variant="body2" color="textSecondary">
              © I Love Prova Antiga 2024. Todos os direitos reservados.
            </Typography>
          </Grid>
          <Grid item xs={4} style={{ textAlign: "center" }}>
            <img src={fullLogo} alt="logo" style={{ maxHeight: "35px" }} />
          </Grid>
          <Grid
            item
            xs={4}
            style={{ textAlign: "right", paddingRight: "20px" }}
          >
            <Typography variant="body2" color="textSecondary">
              Esse site usa Inteligência Artificial, que pode cometer erros.
              <br />
              Considere verificar informações importantes.
            </Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}

export default App;
