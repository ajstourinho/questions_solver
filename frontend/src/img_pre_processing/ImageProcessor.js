// ImageProcessor.js
import React, { useState, useRef, useEffect } from "react";
import { Container, Typography, Divider, Button, Box } from "@mui/material";
import ImageCanvas from "./ImageCanvas";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/web/pdf_viewer.css";
import { jsPDF } from "jspdf";
import { nextModalPage } from "../store/slices/ModalControlSlice";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../axios/axiosInstance";
import { setQuestionsCount } from "../store/slices/CheckoutSlice";

// Configure the PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

function ImageProcessor() {
  const files = useSelector((state) => state.filesSlice.files);
  const filenames = useSelector((state) => state.filesSlice.filenames);
  const pdfFile = files[0]; // Use the PDF from Redux state
  const [combinedImage, setCombinedImage] = useState(null);
  const [transformedImages, setTransformedImages] = useState([]);
  const imageCanvasRef = useRef(null);

  const dispatch = useDispatch();

  const handleClick = () => {
    const images = handleProcessSelections(); // Get images directly
    dispatch(setQuestionsCount(images.length));
    handleUploadPDF(images); // Pass images to handleUploadPDF
    dispatch(nextModalPage());
  };


  useEffect(() => {
    const loadPDF = async () => {
      if (pdfFile) {
        const typedarray = new Uint8Array(await pdfFile.arrayBuffer());

        const loadingTask = pdfjsLib.getDocument(typedarray);
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        const pagesArray = [];

        // Set the scale based on the number of pages
        let scale;

        if (numPages >= 1 && numPages <= 10) {
          scale = 1.5;
        } else if (numPages > 10 && numPages <= 20) {
          scale = 1;
        } else if (numPages > 20 && numPages <= 30) {
          scale = 0.9;
        } else {
          scale = 0.68;
        }

        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;
          const imgData = canvas.toDataURL("image/jpeg");
          pagesArray.push({
            imgData,
            width: canvas.width,
            height: canvas.height,
          });
        }

        // Combine all images into one continuous image
        const totalHeight = pagesArray.reduce(
          (sum, page) => sum + page.height,
          0
        );
        const maxWidth = Math.max(...pagesArray.map((page) => page.width));

        const combinedCanvas = document.createElement("canvas");
        combinedCanvas.width = maxWidth;
        combinedCanvas.height = totalHeight;
        const ctx = combinedCanvas.getContext("2d");

        let currentY = 0;
        for (let page of pagesArray) {
          const img = new Image();
          img.src = page.imgData;
          await new Promise((resolve) => {
            img.onload = () => {
              ctx.drawImage(img, 0, currentY, page.width, page.height);
              currentY += page.height;
              resolve();
            };
          });
        }

        const combinedImgData = combinedCanvas.toDataURL("image/jpeg");
        setCombinedImage(combinedImgData);
      }
    };

    loadPDF();
  }, [pdfFile]);

  const handleProcessSelections = () => {
    if (imageCanvasRef.current) {
      const images = imageCanvasRef.current.getTransformedImages();
      setTransformedImages(images);
      return images; // Return the images directly
    }
    return []; // Return an empty array if no images
  };

  // const handleProcessSelections = () => {
  //   if (imageCanvasRef.current) {
  //     const images = imageCanvasRef.current.getTransformedImages();
  //     setTransformedImages(images);
  //   }
  // };


const handleUploadPDF = async (images) => {
  if (images.length === 0) {
    alert("Nenhuma imagem transformada para baixar.");
    return;
  }

  const doc = new jsPDF();

  images.forEach((imgSrc, index) => {
    const img = new Image();
    img.src = imgSrc;

    doc.addImage(img, "PNG", 10, 10, 190, 0);

    if (index < images.length - 1) {
      doc.addPage();
    }
  });

  // Get the PDF as a Blob
  const pdfBlob = doc.output("blob");

  // Create FormData and append the PDF Blob
  const formData = new FormData();
  formData.append("file", pdfBlob);
  formData.append("filename", filenames[0]);

  // Upload via Axios
  try {
    const response = await axiosInstance.post("/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("File uploaded successfully", response.data);
  } catch (error) {
    console.error("There was an error uploading the file!", error);
  }
};


  // const handleDownloadPDF = () => {
  //   if (transformedImages.length === 0) {
  //     alert("Nenhuma imagem transformada para baixar.");
  //     return;
  //   }

  //   const doc = new jsPDF();

  //   transformedImages.forEach((imgSrc, index) => {
  //     const img = new Image();
  //     img.src = imgSrc;

  //     doc.addImage(img, "PNG", 10, 10, 190, 0);

  //     if (index < transformedImages.length - 1) {
  //       doc.addPage();
  //     }
  //   });

  //   doc.save("imagens_transformadas.pdf");
  // };

  return (
    <Container>
      {!combinedImage ? (
        <Typography variant="h6" color="grey" sx={{ mt: 2, px: 4 }}>
          Carregando...
        </Typography>
      ) : (
        false
      )}

      <div>
        {combinedImage && (
          <Box mt={1} sx={{ border: "1px solid grey", width: "90%" }}>
            <ImageCanvas ref={imageCanvasRef} src={combinedImage} />
          </Box>
        )}
      </div>

      <Divider sx={{ mt: 1 }} />

      <Button
        variant="contained"
        color="primary"
        sx={{ mt: 2, mb: 2, width: "80%" }}
        onClick={handleClick}
      >
        SEGUIR
      </Button>

      {/* {combinedImage && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleProcessSelections}
          style={{ marginTop: "20px" }}
        >
          Processar Seleções
        </Button>
      )}
      {transformedImages.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5">Imagens Transformadas</Typography>
          <Typography variant="h6" color="grey">
            Quantidade de imagens: {transformedImages.length}
          </Typography>

          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadPDF}
            style={{ marginTop: "20px" }}
          >
            Baixar Todas as Imagens em PDF
          </Button>
        </Box>
      )} */}
    </Container>
  );
}

export default ImageProcessor;
