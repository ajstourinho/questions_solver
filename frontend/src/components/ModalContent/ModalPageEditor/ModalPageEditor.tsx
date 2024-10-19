import React from "react";
import {
  Typography,
  Button,
  Box,
  Divider,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { nextModalPage } from "../../../store/slices/ModalControlSlice";
import { useDispatch } from "react-redux";
import ImageProcessor from "../../../img_pre_processing/ImageProcessor";

function ModalPageEditor() {
  const dispatch = useDispatch();

  // const handleClick = () => {
  //   dispatch(nextModalPage());
  // };

  return (
    <>
      <Typography variant="h6" component="h2" sx={{ mt: 0 }}>
        Seletor de questões
      </Typography>
      <Typography variant="body1" component="h2" sx={{ mt: 1 }} color="grey">
        Arraste e solte para selecionar <u>um retângulo por questão</u>.
      </Typography>

      <Box
        sx={{
          width: "80vw",
          display: "flex",
        }}
      >
        <ImageProcessor />
      </Box>

      {/* Divisor */}
      {/* <Divider sx={{ mt: 1 }} />

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, mb: 2, width: "80%" }}
        onClick={handleClick}
      >
        SEGUIR
      </Button> */}
    </>
  );
}

export default ModalPageEditor;
