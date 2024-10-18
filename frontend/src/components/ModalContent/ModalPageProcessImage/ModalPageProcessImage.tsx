import React from "react";
import { Typography, Button, Box, Divider, useMediaQuery, useTheme } from "@mui/material";
import { nextModalPage } from "../../../store/slices/ModalControlSlice";
import { useDispatch } from "react-redux";
import { setUserEmail } from "../../../store/slices/UserSlice";
import Alert from "@mui/material/Alert";
import gif from "../../../assets/gif_video_editor.gif";

function ModalPageProcessImage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(nextModalPage());
  };

  return (
    <>
      <Typography variant="h6" component="h2" sx={{ mt: 1, mb: 1 }}>
        Seletor de questões
      </Typography>
      {isMobile ? (
        <Alert severity="warning">
          Seleção de questões disponível apenas na versão para computador.
          <br />
          Acesse pelo seu desktop para utilizar essa funcionalidade.{" "}
        </Alert>
      ) : (
        <>
          <Box
            component="img"
            src={gif}
            sx={{ width: "100%", maxWidth: 150, height: "auto", mt: 2 }}
          />
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            A seguir, arraste o mouse para selecionar as questões em seu PDF.
          </Typography>

        </>
      )}

      {/* Divisor */}
      <Divider sx={{ mt: 1 }} />

      <Button
        variant="contained"
        color="primary"
        disabled={isMobile}
        sx={{ mt: 2, mb: 2, width: "80%" }}
        onClick={handleClick}
      >
        SEGUIR
      </Button>
      {/* Divisor */}
      <Divider sx={{ mt: 1 }} />

      {/* Texto de ressalva */}
      <Typography variant="caption" color="grey" sx={{ mt: 2, px: 4 }}>
        Este site funciona melhor com textos simples e não é otimizado para
        imagens complexas ou questões que envolvam cálculos matemáticos.
      </Typography>
    </>
  );
}

export default ModalPageProcessImage;
