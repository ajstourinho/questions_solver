import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Grid, Modal } from "@mui/material";
import fullLogo from "../../assets/full_logo_medicina.png";
import {
  closeModal,
  resetModalPage,
} from "../../store/slices/ModalControlSlice";
import { resetCheckout } from "../../store/slices/CheckoutSlice";
import { useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import axiosInstance from "../../axios/axiosInstance";
import { resetFiles } from "../../store/slices/FilesSlice";
import { resetPaymentModal } from "../../store/slices/PaymentModalSlice";
import { resetUser } from "../../store/slices/UserSlice";
import ModalPageEmail from "../ModalContent/ModalPageEmail/ModalPageEmail";
import ModalPageMode from "../ModalContent/ModalPageMode/ModalPageMode";
import ModalPagePayment from "../ModalContent/ModalPagePayment/ModalPagePayment";
import ModalPageConfirmation from "../ModalContent/ModalPageConfirmation/ModalPageConfirmation";
import ModalPageProcessImage from "../ModalContent/ModalPageProcessImage/ModalPageProcessImage";
import ModalPageEditor from "../ModalContent/ModalPageEditor/ModalPageEditor";

const style = {
  position: "fixed" as const,
  top: "20px",
  left: "50%",
  transform: "translateX(-50%)",
  minWidth: 360,
  maxHeight: "calc(100% - 80px)", // Leaves 20px margin at the top and bottom
  overflowY: "auto", // Enables vertical scrolling when content is too long
  bgcolor: "background.paper",
  border: "2px solid #777",
  boxShadow: 24,
  p: 2,
  borderRadius: "25px",
};

function ModalFrame() {
  const modalPage = useSelector(
    (state: RootState) => state.modalControlSlice.modalPage
  );
  const open = useSelector((state: RootState) => state.modalControlSlice.open);
  const paymentStatus = useSelector(
    (state: RootState) => state.paymentModalSlice.paymentStatus
  );
  const files = useSelector((state: RootState) => state.filesSlice.files);
  const filenames = useSelector(
    (state: RootState) => state.filesSlice.filenames
  );
  const pageCount = useSelector(
    (state: RootState) => state.checkoutSlice.pageCount
  );
  const dispatch = useDispatch();

  const handleClose = () => {
    dispatch(closeModal());
    dispatch(resetModalPage());
    dispatch(resetCheckout());
    dispatch(resetFiles());
    dispatch(resetPaymentModal());
    dispatch(resetUser());
  };

  const renderContent = (modalPage: number) => {
    switch (modalPage) {
      case 1:
        return <ModalPageProcessImage />;
      case 2:
        return <ModalPageEditor />;
      case 3:
        return <ModalPageEmail />;
      case 4:
        return <ModalPageMode />;
      case 5:
        return <ModalPagePayment />;
      case 6:
        return <ModalPageConfirmation />;
      default:
        return <p>Error rendering modal.</p>;
    }
  };

  useEffect(() => {
    if (paymentStatus === "CONCLUIDA") {
      console.log("Pagamento realizado.");

      return;
    }
  }, [paymentStatus]);

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
            minWidth: 400,
            p: 2,
            backgroundColor: "white",
            borderRadius: 2,
            textAlign: "center",
            margin: "auto",
          }}
        >
          {/* Logo */}
          <Grid container spacing={1} justifyContent="center">
            <Grid item>
              <img
                src={fullLogo}
                alt="logo"
                style={{ maxWidth: "100px", height: "auto" }}
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
