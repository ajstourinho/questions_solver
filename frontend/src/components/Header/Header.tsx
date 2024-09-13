import fullLogo from "../../assets/full_logo_medicina.png";
import { Grid } from "@mui/material";

export default function Header() {
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
