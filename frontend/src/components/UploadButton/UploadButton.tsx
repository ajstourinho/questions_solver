import { Clear, UploadFile } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { ChangeEvent } from "react";
import { PDFDocument } from "pdf-lib";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { reset, add } from "../../store/slices/FilesSlice";
import { setPageNumber } from "../../store/slices/CheckoutSlice";

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

  const pageCount = useSelector(
    (state: RootState) => state.checkoutSlice.pageCount
  );
  
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

      dispatch(
        add({
          files: Array.from(event.target.files),
          filenames: [filename],
        })
      );

      dispatch(setPageNumber(pdfDoc.getPageCount()));
    }
  };

  const handleCancelUpload = () => {
    dispatch(reset());
    dispatch(setPageNumber(0));
  };

  return (
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
                    width: "150px", // Set the width to control when truncation occurs
                    ml: "10px"
                  }}
                >
                  {files[0].name}
                </Typography>
              </Grid>
              <Grid item sx={{ mb: 3 }}>
                <Typography variant="caption" color="textSecondary">
                  (número de questões: {pageCount.valueOf()})
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Grid>
    </Grid>
  );
}
