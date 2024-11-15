import React, { useEffect, useState } from "react";
import { Typography, Button, Box, Divider } from "@mui/material";
import { nextModalPage } from "../../../store/slices/ModalControlSlice";
import { useDispatch } from "react-redux";
import gif from "../../../assets/gif_video_example_with_questions_speed.gif";

function ModalPageProcessImage() {
  const dispatch = useDispatch();
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsButtonDisabled(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleClick = () => {
    dispatch(nextModalPage());
  };

  return (
    <>
      <Typography variant="h6" component="h2" sx={{ mt: 1, mb: 1 }}>
        Seletor de questões
      </Typography>
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        A seguir, arraste o mouse para selecionar as questões em seu PDF.
      </Typography>
      <Box
        component="img"
        src={gif}
        sx={{ width: "100%", maxWidth: 150, height: "auto", mt: 2 }}
      />

      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Ajuste os cantos para incluir apenas uma questão por área selecionada.
      </Typography>

      <Divider sx={{ mt: 1 }} />

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, mb: 2, width: "80%" }}
        onClick={handleClick}
        disabled={isButtonDisabled}
      >
        SEGUIR
      </Button>
    </>
  );
}

export default ModalPageProcessImage;
