import React, { useState, ChangeEvent, useEffect } from "react";
import fullLogo from "./assets/full_logo.png";
import pixIcon from "./assets/pix_icon.webp";
import exampleImg from "./assets/exampleInitialPage_reduced.jpg";
import { Grid, Button, Typography, Box } from "@mui/material";
import { UploadFile, ShoppingCart, Clear } from "@mui/icons-material";
import { PDFDocument } from "pdf-lib";

import Footer from "./components/Footer/Footer";

function App() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [price, setPrice] = useState(0);

  const reaisPerPage = 3;

  useEffect(() => {
    setPrice(reaisPerPage * pageCount);
  }, [pageCount])

  function formatToCurrency(value: number): string {
    // Ensure the value is a number and fix it to two decimal places
    let formattedValue = value.toFixed(2);
    formattedValue = formattedValue.replace(".", ",");

    // Add currency symbol (optional, default to $)
    return `${formattedValue}`;
  }

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.type !== "application/pdf") {
        alert("Please upload a PDF file.");
        return;
      }
      setSelectedFile(file);
      const pdfDoc = await PDFDocument.load(await file.arrayBuffer());
      setPageCount(pdfDoc.getPageCount());
    }
  };

  const handleCancelUpload = () => {
    setSelectedFile(null);
    setPageCount(0);
  };

  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      alignItems="center"
      style={{ textAlign: "center" }}
    >
      {/* Logo */}
      <Grid item xs={12} sx={{ marginTop: "50px" }}>
        <img
          src={fullLogo}
          alt="logo"
          style={{ maxWidth: "200px", height: "auto" }}
        />
      </Grid>

      {/* Texto inicial */}
      <Grid item xs={12} sx={{ marginTop: "10px" }}>
        <Typography variant="h5">
          Faça o upload de{" "}
          <Typography
            component="span"
            variant="h5"
            style={{ color: "dodgerblue" }}
          >
            1 arquivo PDF
          </Typography>{" "}
          de uma prova antiga
        </Typography>
        <Typography variant="h5">
          e deixe a IA <strong>resolvê-la automaticamente!</strong>
        </Typography>

        <Typography
          variant="subtitle1"
          color="textSecondary"
          sx={{ marginTop: "5px" }}
        >
          Certifique-se que há <strong>somente uma 1 questão por página</strong>
          .
        </Typography>
      </Grid>

      {/* Botões */}
      <Grid
        item
        container
        justifyContent="center"
        style={{ textAlign: "center" }}
        xs={12}
        sx={{mt: 3}}
      >
        {/* Botão de upload */}
        <Grid item direction="column" sx={{ mx: 1 }}>
          <Grid item>
            <input
              type="file"
              accept="application/pdf"
              style={{ display: "none" }}
              id="upload-button-file"
              onChange={handleFileChange}
              onClick={(event) => {
                event.currentTarget.value = "";
              }}
            />
            <label htmlFor="upload-button-file">
              <Button
                variant="contained"
                component="span"
                startIcon={<UploadFile />}
                sx={{ backgroundColor: "#888" }}
              >
                Selecione 1 arquivo PDF
              </Button>
            </label>
          </Grid>
          <Grid item>
            {selectedFile && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: "10px",
                }}
              >
                <Grid container direction="column">
                  <Grid
                    item
                    container
                    direction="row"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography variant="body1">{selectedFile.name}</Typography>
                    <Button onClick={handleCancelUpload} size="small">
                      <Clear />
                    </Button>
                  </Grid>
                  <Grid item>
                    <Typography variant="body2" color="textSecondary">
                      (número de questões: {pageCount})
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Grid>
        </Grid>

        {/* Botão de resolver */}
        <Grid item sx={{ mx: 1 }}>
          <Button variant="contained" color="primary">
            RESOLVER!
          </Button>
        </Grid>

        {/* Carrinho */}
        <Grid item direction="column" sx={{ mx: 1 }}>
            <Grid item>
              <Box display="flex" alignItems="center" style={{ marginTop: 5 }}>
                <Box display="flex">
                  <img src={pixIcon} alt="pixIcon" style={{ maxWidth: "20px" }} />
                  <ShoppingCart style={{ marginRight: 5 }} />
                  <Typography variant="subtitle1" color="textSecondary">
                    R$ {formatToCurrency(price)}
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid item>
              <Box>
                <Typography variant="caption" style={{ marginLeft: 5 }}>
                  (R$ {formatToCurrency(reaisPerPage)} por questão)
                </Typography>
              </Box>
            </Grid>
        </Grid>
      </Grid>


      {/* Seção de exemplo */}
      <Grid item xs={12} sx={{ marginTop: 15 }}>
        <Typography variant="h4">Confira um exemplo!</Typography>
      </Grid>

      <Grid
        item
        xs={12}
        sx={{
          backgroundColor: "rgb(175, 210, 237)",
          marginTop: 1,
          width: "100%",
        }}
      >
        <img
          src={exampleImg}
          alt="exampleImg"
          style={{ maxWidth: "80%", marginBottom: 20 }}
        />
      </Grid>

      {/* Footer */}
      <Footer />
    </Grid>
  );
}

export default App;
