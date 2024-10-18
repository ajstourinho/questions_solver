import React from "react";
import { Typography, Button, Box, Divider } from "@mui/material";
import TextField from "@mui/material/TextField";
import { nextModalPage } from "../../../store/slices/ModalControlSlice";
import { useDispatch } from "react-redux";
import { setUserEmail } from "../../../store/slices/UserSlice";
import pixIcon from "../../../assets/pix_icon.webp";
import { useSelector } from "react-redux";
import { RootState } from "../../../store/store";
import { ShoppingCart } from "@mui/icons-material";

const reaisPerQuestion = Number(process.env.REACT_APP_REAIS_PER_QUESTION);

function formatToCurrency(value: number): string {
  let formattedValue = value.toFixed(2);
  formattedValue = formattedValue.replace(".", ",");
  return `${formattedValue}`;
}
function ModalPageEmail() {
  const [email, setEmail] = React.useState("");
  const questionsCount = useSelector(
    (state: RootState) => state.checkoutSlice.questionsCount
  );
  const price = useSelector((state: RootState) => state.checkoutSlice.price);

  const dispatch = useDispatch();
  
  const handleClick = () => {
    dispatch(setUserEmail(email));
    dispatch(nextModalPage());
  }

  return (
    <>
      <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
        Receba sua <br />
        prova resolvida por e-mail!
      </Typography>

      <TextField
        value={email}
        type="email"
        sx={{ width: "80%", mb: 3, mt: 1 }}
        label="Digite seu e-mail..."
        variant="filled"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setEmail(event.target.value);
        }}
      />

      {/* Divisor */}
      <Divider sx={{ mt: 1, mb: 1 }} />

      {/* Quantidade de questões */}
      <Box display="flex" alignItems="center">
        <Typography
          variant="body2"
          sx={{ fontWeight: "bold", textDecoration: "none" }}
        >
          Quantidade de questões:
        </Typography>
        <Typography variant="body1" sx={{ ml: 2 }} color="grey">
          {questionsCount}
        </Typography>
      </Box>

      {/* Divisor */}
      <Divider sx={{ mt: 1, mb: 1 }} />

      {/* Seção Valor total */}
      <Box>
        <Typography variant="overline">Valor total:</Typography>

        {/* Carrinho */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          style={{ marginTop: 4 }}
        >
          <Box display="flex" alignItems="center">
            <img src={pixIcon} alt="pixIcon" style={{ maxHeight: "25px" }} />
            <ShoppingCart style={{ marginRight: 10 }} />
            <Typography variant="subtitle1" color="grey">
              R$ {formatToCurrency(price.valueOf())}
            </Typography>
          </Box>
        </Box>
        <Typography variant="caption" color="grey" sx={{ mt: 2 }}>
          {`(R$ ${formatToCurrency(reaisPerQuestion)} por questão)`}
        </Typography>
      </Box>

      {/* Divisor */}
      <Divider sx={{ mt: 1, mb: 1 }} />

      <Button
        variant="contained"
        color="primary"
        disabled={email === ""}
        sx={{ mt: 2, mb: 2, width: "80%" }}
        onClick={handleClick}
      >
        SEGUIR
      </Button>
    </>
  );
}

export default ModalPageEmail;