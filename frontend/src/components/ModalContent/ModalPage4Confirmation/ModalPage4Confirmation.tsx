import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../store/store";
import axiosInstance from "../../../axios/axiosInstance";
import { Box, Typography, Divider } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import PaymentData from "../../PaymentData/PaymentData";

function ModalPage4Confirmation() {

  return (
    <>
      <Typography variant="h6" component="h2" sx={{ mt: 1, mb: 1 }}>
        Pagamento confirmado!
      </Typography>

      {/* Ícone de confirmação verde centralizado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          mt: 2,
        }}
      >
        <CheckCircleIcon sx={{ color: "green", fontSize: 50 }} />
      </Box>

      <Typography variant="body1" color="grey" sx={{mt: 2}}>
        Sua prova resolvida será <br/> enviada para o seu e-mail!
      </Typography>
    </>
  );
}

export default ModalPage4Confirmation;
