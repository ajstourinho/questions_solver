import React from "react";
import { Typography, Button, Divider } from "@mui/material";
import TextField from "@mui/material/TextField";
import { nextModalPage } from "../../../store/slices/ModalControlSlice";
import { useDispatch } from "react-redux";
import { setUserEmail } from "../../../store/slices/UserSlice";

function ModalPageEmail() {
  const [email, setEmail] = React.useState("");

  const dispatch = useDispatch();
  
  const handleClick = () => {
    dispatch(setUserEmail(email));
    dispatch(nextModalPage());
  }

  return (
    <>
      <Typography variant="h6" component="h2" sx={{ mt: 1, mb: 1 }}>
        Receba sua prova resolvida <br /> por e-mail!
      </Typography>

      <TextField
        value={email}
        type="email"
        sx={{ width: "80%", mb: 3, mt: 2 }}
        label="Digite seu e-mail..."
        variant="filled"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setEmail(event.target.value);
        }}
      />

      {/* Divisor */}
      <Divider sx={{ mb: 1 }} />

      {/* Texto de ressalva */}
      <Typography variant="caption" color="grey" sx={{ mt: 2 }}>
        Este site funciona melhor com textos simples e não é otimizado para
        imagens complexas ou questões que envolvam cálculos matemáticos.
      </Typography>

      {/* Divisor */}
      <Divider sx={{ mt: 1 }} />

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