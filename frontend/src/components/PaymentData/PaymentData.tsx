import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import axiosInstance from "../../axios/axiosInstance";
import { Box, Grid, Typography } from "@mui/material";
import { setPaymentStatus } from "../../store/slices/PaymentModalSlice";
import { nextModalPage } from "../../store/slices/ModalControlSlice";

function formatToCurrency(value: number): string {
  let formattedValue = value.toFixed(2);
  formattedValue = formattedValue.replace(".", ",");
  return `${formattedValue}`;
}

function PaymentData() {
  const txid = useSelector((state: RootState) => state.paymentModalSlice.txid);
  const files = useSelector((state: RootState) => state.filesSlice.files);
  const filenames = useSelector((state: RootState) => state.filesSlice.filenames);
  const pageCount = useSelector((state: RootState) => state.checkoutSlice.pageCount);
  const price = useSelector((state: RootState) => state.checkoutSlice.price);
  const paymentStatus = useSelector(
    (state: RootState) => state.paymentModalSlice.paymentStatus
  );
  const userEmail = useSelector((state: RootState) => state.userSlice.email);

  const dispatch = useDispatch();

  useEffect(() => {
    if (paymentStatus === "CONCLUIDA") {
      // Confirm to backend that payment was sucessful, to then process order
      axiosInstance
        .post("/confirm_payment", { userEmail, filenames })
        .then((response) => {
          console.log(response);
        })
        .catch((error) => console.error(error));
      
      return;
    } else {
      if (txid !== "") {
        const intervalId = setInterval(consultarStatusPix, 5000);
        return () => clearInterval(intervalId);
      }
    }
  }, [txid, paymentStatus]);


  const consultarStatusPix = () => {
    axiosInstance
      .get(`/status_pix/${txid}`, {
        headers: { "Content-Type": "application/json" },
      })
      .then((response) => {
        console.log(response.data);
        if (response.data.status) {
          dispatch(setPaymentStatus(response.data.status));

          if (response.data.status === "CONCLUIDA") dispatch(nextModalPage());
        }
      })
      .catch((error) => console.error("Erro ao consultar o status:", error));
  };

  return (
    <>
      <Grid container spacing={2} sx={{ mt: 0, textAlign: "left" }}>
        {/* Arquivo PDF */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body2"
              component="span"
              sx={{ fontWeight: "bold", textDecoration: "underline" }}
            >
              Arquivo PDF:
            </Typography>

            <Typography
              variant="body2"
              color="grey"
              sx={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                width: "180px", // Set width for truncation
                ml: 1,
              }}
            >
              {files[0] && files[0].name}
            </Typography>
          </Box>
        </Grid>

        {/* Valor */}
        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body2"
              sx={{ fontWeight: "bold", textDecoration: "underline" }}
            >
              Valor:
            </Typography>
            <Typography variant="body2" sx={{ ml: 1 }} color="grey">
              R$ {formatToCurrency(price.valueOf())}
            </Typography>
          </Box>
        </Grid>

        <Grid item xs={12}>
          <Box display="flex" alignItems="center">
            <Typography
              variant="body2"
              component="span"
              sx={{ fontWeight: "bold", textDecoration: "underline" }}
            >
              Status:
            </Typography>
            <Typography
              variant="body2"
              component="span"
              color="#BF6900"
              sx={{ ml: 1 }}
            >
              Aguardando pagamento...
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </>
  );
}

export default PaymentData;
