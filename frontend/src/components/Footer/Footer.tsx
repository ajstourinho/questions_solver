import React from "react";
import fullLogo from "../../assets/full_logo.png";
import { Grid, Typography } from "@mui/material";

export default function Footer() {

  return (
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
        <Grid item xs={4} style={{ textAlign: "right", paddingRight: "20px" }}>
          <Typography variant="body2" color="textSecondary">
            Esse site usa Inteligência Artificial, que pode cometer erros.
            <br />
            Considere verificar informações importantes.
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
}