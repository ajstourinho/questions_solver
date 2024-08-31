import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { openPaymentModal } from "../../store/slices/PaymentModalSlice"

import axiosInstance from "../../axios/axiosInstance";

export default function SolveButton() {
  const files = useSelector((state: RootState) => state.filesSlice.files);
  const dispatch = useDispatch()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (files.length === 0) {
      alert("Por favor, selecione 1 arquivo PDF primeiro.");
      return;
    }
    const formData = new FormData();
    formData.append("file", files[0]);
    try {
      const response = await axiosInstance.post(
        "/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("File uploaded successfully", response.data);
      dispatch(openPaymentModal())
    } catch (error) {
      console.error("There was an error uploading the file!", error);
    }
  };

  return (
    <Button variant="contained" color="primary" onClick={handleSubmit}>
      RESOLVER!
    </Button>
  );
}
