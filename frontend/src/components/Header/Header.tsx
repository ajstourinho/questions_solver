import fullLogo from "../../assets/full_logo.png";
import fullLogoMedicina from "../../assets/full_logo_medicina.png";
import logoMedicinaText from "../../assets/logo_medicina_text.png";
import { Box, Grid, useMediaQuery, useTheme } from "@mui/material";

export default function Header() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  return (
    <>
      {isMobile ? (
        <Grid item xs={12} sx={{ mt: 2, mb: 2 }}>
          <img
            src={fullLogoMedicina}
            alt="logo"
            style={{ maxWidth: "150px", height: "auto" }}
          />
        </Grid>
      ) : (
        <>
          {/* Logotipo Esquerdo */}
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <Box
              component="img"
              src={fullLogo}
              alt="Logotipo Esquerdo"
              style={{ height: "80px" }}
              sx={{ pl: 12, pt: 2 }}
            />
          </Grid>

          {/* Logotipo Direito */}
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              padding: "20px",
            }}
          >
            <Box
              component="img"
              src={logoMedicinaText}
              alt="Logotipo Direito"
              style={{ height: "40px" }}
              sx={{ pr: 12, pt: 2 }}
            />
          </Grid>
        </>
      )}
    </>
  );
}
