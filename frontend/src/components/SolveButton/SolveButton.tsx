import { Button } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../store/store";

import axiosInstance from "../../axios/axiosInstance";
import { nextModalPage, openModal } from "../../store/slices/ModalControlSlice";

export default function SolveButton() {
  const files = useSelector((state: RootState) => state.filesSlice.files);
  const filenames = useSelector((state: RootState) => state.filesSlice.filenames);
  const dispatch = useDispatch();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    dispatch(nextModalPage());
    dispatch(openModal());

    uploadFiles(event);
  };

  const uploadFiles = async (event: React.FormEvent) => {
    if (files.length === 0) {
      alert("Por favor, selecione 1 arquivo PDF primeiro.");
      return;
    }

    const formData = new FormData();
    formData.append("file", files[0]);
    formData.append("filename", filenames[0]);

    // Comment out, as file upload will now happen after Editor

    // try {
    //   const response = await axiosInstance.post("/upload", formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   });
    //   console.log("File uploaded successfully", response.data);
    // } catch (error) {
    //   console.error("There was an error uploading the file!", error);
    // }
  };

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={handleSubmit}
        disabled={files.length > 0 ? false : true}
      >
        RESOLVER!
      </Button>
    </>
  );
}
