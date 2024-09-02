import { Box, Grid, Typography } from "@mui/material";
import UploadButton from "../components/UploadButton/UploadButton";
import SolveButton from "../components/SolveButton/SolveButton";
import { ShoppingCart } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import pixIcon from "../assets/pix_icon.webp";
import exampleImg from "../assets/exampleInitialPage_transparent.png";
import PaymentModal from "../components/PaymentModal/PaymentModal";
// import dotenv from 'dotenv'

// dotenv.config({ path: '../../../.env' })
// const reaisPerPage = Number(process.env.REAIS_PER_PAGE);
const reaisPerPage = 8;

export default function InitialPage() {
  const price = useSelector((state: RootState) => state.checkoutSlice.price);

  function formatToCurrency(value: number): string {
    // Ensure the value is a number and fix it to two decimal places
    let formattedValue = value.toFixed(2);
    formattedValue = formattedValue.replace(".", ",");
    // Add currency symbol (optional, default to $)
    return `${formattedValue}`;
  }

  return (
    <>
      {/* Modal de pagamento */}
      <PaymentModal/>

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
          Certifique-se que há <strong>somente uma 1 questão por página</strong>.
        </Typography>
      </Grid>

      {/* Botões */}
      <Grid
        item
        container
        justifyContent="center"
        style={{ textAlign: "center" }}
        xs={12}
        sx={{ mt: 3 }}
      >
        {/* Botão de upload */}
        <UploadButton />
        {/* Botão de resolver */}
        <Grid item sx={{ mx: 1 }}>
          <SolveButton />
        </Grid>

        {/* Carrinho */}
        <Grid item direction="column" sx={{ mx: 1 }}>
          <Grid item>
            <Box display="flex" alignItems="center" style={{ marginTop: 5 }}>
              <Box display="flex">
                <img src={pixIcon} alt="pixIcon" style={{ maxWidth: "20px" }} />
                <ShoppingCart style={{ marginRight: 10 }} />
                <Typography variant="subtitle1">
                  R$ {formatToCurrency(price.valueOf())}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item>
            <Box>
              <Typography
                variant="caption"
                style={{ marginLeft: 5 }}
                color="textSecondary"
              >
                (R$ {formatToCurrency(reaisPerPage)} por questão)
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Grid>

      {/* Seção de exemplo */}
      <Grid item xs={12} sx={{ marginTop: 15 }}>
        <Typography variant="h4">Confira um exemplo!</Typography>
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          backgroundColor: "rgb(175, 210, 237)",
          marginTop: 1,
          width: "100%",
        }}
      >
        <img
          src={exampleImg}
          alt="exampleImg"
          style={{ maxWidth: "90%", marginBottom: 20 }}
        />
      </Grid>
    </>
  );
}
