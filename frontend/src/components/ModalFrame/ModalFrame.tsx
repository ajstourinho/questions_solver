import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Grid, Modal } from "@mui/material";
import fullLogo from "../../assets/full_logo_medicina.png";
import ModalPage1Email from "../ModalContent/ModalPage1Email/ModalPage1Email";
import ModalPage2Mode from "../ModalContent/ModalPage2Mode/ModalPage2Mode";
import { closeModal, resetPage } from "../../store/slices/ModalControlSlice";
import ModalPage3Payment from "../ModalContent/ModalPage3Payment/ModalPage3Payment";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 360,
  bgcolor: "background.paper",
  border: "2px solid #777",
  boxShadow: 24,
  p: 2,
  borderRadius: "25px",
};

function ModalFrame() {
  const modalPage = useSelector((state: RootState) => state.modalControlSlice.page);
  const open = useSelector((state: RootState) => state.modalControlSlice.open);

  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeModal());
    dispatch(resetPage());
  };

  const renderContent = (modalPage: number) => {
    switch (modalPage) {
      case 1:
        return <ModalPage1Email />;
      case 2:
        return <ModalPage2Mode />;
      case 3:
        return <ModalPage3Payment />;
      default:
        return <p>Error rendering modal.</p>;
    }
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>

        <Box
          sx={{
            maxWidth: 400,
            p: 2,
            backgroundColor: "white",
            borderRadius: 2,
            textAlign: "center",
            margin: "auto",
          }}
        >
          {/* Logo */}
          <Grid container spacing={2} justifyContent="center">
            <Grid item>
              <img
                src={fullLogo}
                alt="logo"
                style={{ maxWidth: "120px", height: "auto" }}
              />{" "}
            </Grid>
          </Grid>

          {renderContent(modalPage)}
        </Box>
      </Box>
    </Modal>
  );
}

export default ModalFrame;
