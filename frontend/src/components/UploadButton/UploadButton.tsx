import { Clear, UploadFile } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { ChangeEvent, useEffect } from "react";
import { PDFDocument } from "pdf-lib";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  resetFiles,
  addFiles
} from "../../store/slices/FilesSlice";
import { setPageCount } from "../../store/slices/CheckoutSlice";

function getCurrentDateTimeForFilename() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Months are 0-based, so add 1
  const day = String(now.getDate()).padStart(2, "0");

  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

export default function UploadButton() {
  const files = useSelector((state: RootState) => state.filesSlice.files);

  const dispatch = useDispatch();

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      Array.from(event.target.files).forEach((file) => {
        if (file.type !== "application/pdf") {
          alert("Please upload only PDF files.");
          return;
        }
      });
      
      const pdfDoc = await PDFDocument.load(
        await event.target.files[0].arrayBuffer()
      );
      
      // implement filename with datetime to save to store
      const filename = `myfile_${getCurrentDateTimeForFilename()}.pdf`;
      
      // reset, considering upload of only 1 file
      handleCancelUpload();
      
      const originalFilename = event.target.files[0].name;

      dispatch(
        addFiles({
          files: Array.from(event.target.files),
          filenames: [filename],
          originalFilename: originalFilename,
        })
      );

      dispatch(setPageCount(pdfDoc.getPageCount()));
    }
  };

  const handleCancelUpload = () => {
    dispatch(resetFiles());
    dispatch(setPageCount(0));
  };

  return (
    <Grid item sx={{ mx: 1 }}>
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
            style={{
              marginBottom: 15,
              backgroundColor: "#E0E0E0",
              color: "#000",
            }}
          >
            SELECIONE ARQUIVO PDF
          </Button>
        </label>
      </Grid>
      <Grid item>
        {files[0] && (
          <Box
            sx={{
              display: "flex",
              mb: 2,
            }}
          >
            <Grid container direction="column">
              <Grid
                item
                container
                direction="row"
                sx={{
                  display: "flex",
                }}
              >
                <Button
                  onClick={handleCancelUpload}
                  variant="outlined"
                  size="small"
                  sx={{ px: 2, minWidth: "24px", width: "24px" }}
                >
                  <Clear sx={{ px: 2, width: "20px", height: "20px" }} />
                </Button>
                <Typography
                  variant="body2"
                  sx={{
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    width: "150px", // Set width for truncation
                    ml: 3,
                    textAlign: "left",
                  }}
                >
                  {files[0].name}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
