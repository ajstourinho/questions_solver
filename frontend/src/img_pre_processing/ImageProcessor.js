// App.js
import React, { useState, useRef } from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import ImageCanvas from "./ImageCanvas";
import * as pdfjsLib from "pdfjs-dist/build/pdf";
import "pdfjs-dist/web/pdf_viewer.css";
import { jsPDF } from 'jspdf'; // Importação do jsPDF

// Configura o worker do PDF.js
// pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.6.82/pdf.worker.min.mjs";
pdfjsLib.GlobalWorkerOptions.workerSrc = `${process.env.PUBLIC_URL}/pdf.worker.min.mjs`;

function ImageProcessor() {
  const [pdfFile, setPdfFile] = useState(null);
  const [combinedImage, setCombinedImage] = useState(null);
  const [transformedImages, setTransformedImages] = useState([]);
  const imageCanvasRef = useRef(null);

  const handleFileChange = (event) => {
    setPdfFile(event.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (pdfFile) {
      const fileReader = new FileReader();

      fileReader.onload = async function () {
        const typedarray = new Uint8Array(this.result);

        const loadingTask = pdfjsLib.getDocument(typedarray);
        const pdf = await loadingTask.promise;
        const numPages = pdf.numPages;
        const pagesArray = [];

        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');

          canvas.width = viewport.width;
          canvas.height = viewport.height;

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          await page.render(renderContext).promise;
          const imgData = canvas.toDataURL('image/png');
          pagesArray.push({
            imgData,
            width: canvas.width,
            height: canvas.height,
          });
        }

        // Combinar todas as imagens em uma única imagem contínua
        const totalHeight = pagesArray.reduce((sum, page) => sum + page.height, 0);
        const maxWidth = Math.max(...pagesArray.map((page) => page.width));

        const combinedCanvas = document.createElement('canvas');
        combinedCanvas.width = maxWidth;
        combinedCanvas.height = totalHeight;
        const ctx = combinedCanvas.getContext('2d');

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

        const combinedImgData = combinedCanvas.toDataURL('image/png');
        setCombinedImage(combinedImgData);
      };

      fileReader.readAsArrayBuffer(pdfFile);
    }
  };

  const handleProcessSelections = () => {
    if (imageCanvasRef.current) {
      const images = imageCanvasRef.current.getTransformedImages();
      setTransformedImages(images);
    }
  };

  // Função para gerar e baixar o PDF
  const handleDownloadPDF = () => {
    if (transformedImages.length === 0) {
      alert('Nenhuma imagem transformada para baixar.');
      return;
    }

    const doc = new jsPDF();

    transformedImages.forEach((imgSrc, index) => {
      const img = new Image();
      img.src = imgSrc;

      // Adiciona a imagem ao PDF
      doc.addImage(img, 'PNG', 10, 10, 190, 0); // Ajuste as dimensões conforme necessário

      if (index < transformedImages.length - 1) {
        doc.addPage();
      }
    });

    doc.save('imagens_transformadas.pdf');
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Visualizador de PDF com Seleção de Áreas
      </Typography>
      <input
        accept="application/pdf"
        style={{ display: "none" }}
        id="pdf-input"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="pdf-input">
        <Button variant="contained" component="span">
          Carregar PDF
        </Button>
      </label>
      <Button
        variant="contained"
        onClick={handleFileUpload}
        style={{ marginLeft: "10px" }}
        disabled={!pdfFile}
      >
        Visualizar PDF
      </Button>
      <div>
        {combinedImage && (
          <Box mt={4} sx={{ border: "1px solid grey", width: "90%" }}>
            <ImageCanvas ref={imageCanvasRef} src={combinedImage} />
          </Box>
        )}
      </div>
      {combinedImage && (
        <Button
          variant="contained"
          color="primary"
          onClick={handleProcessSelections}
          style={{ marginTop: "20px",  }}
        >
          Processar Seleções
        </Button>
      )}
      {transformedImages.length > 0 && (
        <Box mt={4} mb={4}>
          <Typography variant="h5">Imagens Transformadas</Typography>
          <Typography variant="h6" color="grey">
            Quantidade de imagens: {transformedImages.length}
          </Typography>

          {/* Mostrar imagens */}
          {/* {transformedImages.map((imgSrc, index) => (
            <Box key={index} mt={2}>
              <img
                src={imgSrc}
                alt={`Transformada ${index}`}
                style={{ maxWidth: "100%" }}
              />
              <Button
                variant="contained"
                onClick={() => {
                  const link = document.createElement("a");
                  link.href = imgSrc;
                  link.download = `transformada_${index}.png`;
                  link.click();
                }}
                style={{ marginTop: "10px" }}
              >
                Baixar
              </Button>
            </Box>
          ))} */}

          {/* Botão para baixar todas as imagens em um único PDF */}
          <Button
            variant="contained"
            color="primary"
            onClick={handleDownloadPDF}
            style={{ marginTop: "20px" }}
          >
            Baixar Todas as Imagens em PDF
          </Button>
        </Box>
      )}
    </Container>
  );
}

export default ImageProcessor;
