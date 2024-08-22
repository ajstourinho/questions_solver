import fullLogo from "../../assets/full_logo.png";
import { Grid } from "@mui/material";

export function Header() {

  return (
    <Grid item xs={12} sx={{ marginTop: "50px" }}>
    <img
      src={fullLogo}
      alt="logo"
      style={{ maxWidth: "200px", height: "auto" }}
    />
  </Grid>
  );
}


