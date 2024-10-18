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
      <Typography variant="h6" component="h2" sx={{ mt: 1 }}>
        Seletor de questões
      </Typography>

      <Box sx={{ height: "80%", width: "80vw"}}>
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
