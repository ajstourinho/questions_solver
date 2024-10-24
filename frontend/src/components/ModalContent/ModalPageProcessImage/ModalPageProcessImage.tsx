import React from "react";
import { Typography, Button, Box, Divider } from "@mui/material";
import { nextModalPage } from "../../../store/slices/ModalControlSlice";
import { useDispatch } from "react-redux";
import gif from "../../../assets/gif_video_editor.gif";

function ModalPageProcessImage() {
  const dispatch = useDispatch();

  const handleClick = () => {
    dispatch(nextModalPage());
  };

  return (
    <>
      <Typography variant="h6" component="h2" sx={{ mt: 1, mb: 1 }}>
        Seletor de questões
      </Typography>
      <Box
        component="img"
        src={gif}
        sx={{ width: "100%", maxWidth: 150, height: "auto", mt: 2 }}
      />
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        A seguir, arraste o mouse para selecionar as questões em seu PDF.
      </Typography>

      <Divider sx={{ mt: 1 }} />

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, mb: 2, width: "80%" }}
        onClick={handleClick}
      >
        SEGUIR
      </Button>
    </>
  );
}

export default ModalPageProcessImage;
