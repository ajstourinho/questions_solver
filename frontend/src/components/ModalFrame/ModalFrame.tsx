import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Grid, Modal } from "@mui/material";
import fullLogo from "../../assets/full_logo_medicina.png";
import ModalPage1Email from "../ModalContent/ModalPage1Email/ModalPage1Email";
import ModalPage2Mode from "../ModalContent/ModalPage2Mode/ModalPage2Mode";
import { closeModal } from "../../store/slices/ModalControlSlice";
import ModalPage3Payment from "../ModalContent/ModalPage3Payment/ModalPage3Payment";
import { resetCheckout } from "../../store/slices/CheckoutSlice";
import { useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import axiosInstance from "../../axios/axiosInstance";

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
    dispatch(resetCheckout());
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

  // test of gpt api
  async function callGptApi() {
    const filename = filenames[0];

    try {
      // Step 1: Fetch the PDF as a binary blob
      const response = await axiosInstance.post(
        "/gpt_solver",
        { filename, pageCount },
        {
          headers: { "Content-Type": "application/json" },
          responseType: "arraybuffer", // PDF data as binary
        }
      );

      // Step 2: Load the PDF into pdf-lib (optional if manipulation is needed)
      const pdfDoc = await PDFDocument.load(response.data);

      // Step 3: Save the modified or unmodified PDF back into bytes
      const pdfBytes = await pdfDoc.save();

      // Step 4: Create a Blob and trigger a download
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      // Automatically trigger download
      const link = document.createElement("a");
      link.href = url;
      const customFilename = `prova_resolvida_${files[0].name}`;
      link.setAttribute("download", customFilename);
      document.body.appendChild(link);
      link.click();

      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading PDF:", error);
    }
  }

  useEffect(() => {
    if (paymentStatus === "CONCLUIDA") {
      console.log("Pagamento realizado.");
      // callGptApi();
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
