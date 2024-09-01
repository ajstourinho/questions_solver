import { useState } from "react";
import { Button } from "@mui/material";
import {  useSelector } from "react-redux";
import { RootState } from "../../store/store";
import CustomModal from "../Modal/Modal";
import axiosInstance from "../../axios/axiosInstance";

export default function SolveButton() {
  const files = useSelector((state: RootState) => state.filesSlice.files);

  const [openModal, setOpenModal] = useState(false);

  const handleCloseModal = () => setOpenModal(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (files.length === 0) {
      alert("Por favor, selecione 1 arquivo PDF primeiro.");
      return;
    }

    setOpenModal(true);

    // const formData = new FormData();
    // formData.append("file", files[0]);

    // try {
    //   const response = await axiosInstance.post(
    //     "/upload",
    //     formData,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );

    //   console.log("File uploaded successfully", response.data);
    // } catch (error) {
    //   console.error("There was an error uploading the file!", error);
    // }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={handleSubmit} disabled={files.length > 0 ? false : true}>
        RESOLVER!
      </Button>
      <CustomModal open={openModal} onClose={handleCloseModal} />
    </>
  );
}
