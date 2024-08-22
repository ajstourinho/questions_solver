import { Clear, UploadFile } from "@mui/icons-material";
import { Box, Button, Grid, Typography } from "@mui/material";
import { ChangeEvent } from "react";
import { PDFDocument } from "pdf-lib";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { reset } from "../store/slices/FilesSlice";
import { setPageNumber } from "../store/slices/CheckoutSlice";

export function UploadButton() {
    const files = useSelector((state: RootState) => state.filesSlice.files)
    const pageCount = useSelector((state: RootState) => state.checkoutSlice.pageCount)
    const dispatch = useDispatch()
    // const [filesDummy, setFilesDummy] = useState<File[]>([])

    // useEffect(() => setFilesDummy(files), [files])

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files[0]) {
            Array.from(event.target.files).forEach(file => {
                if (file.type !== "application/pdf") {
                    alert("Please upload only PDF files.");
                    return;
                }
            })
            const pdfDoc = await PDFDocument.load(await event.target.files[0].arrayBuffer());
            dispatch(reset(Array.from(event.target.files)));
            dispatch(setPageNumber(pdfDoc.getPageCount()));
        }
    };

    const handleCancelUpload = () => {
        dispatch(reset([]))
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
                                <Typography variant="body1">{files[0].name}</Typography>
                                <Button onClick={handleCancelUpload} size="small">
                                    <Clear />
                                </Button>
                            </Grid>
                            <Grid item>
                                <Typography variant="body2" color="textSecondary">
                                    (número de questões: {pageCount.valueOf()})
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                )}
            </Grid>
        </Grid>
    )
}