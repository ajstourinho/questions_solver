import React, { useEffect, useState } from "react";
import { TextField, IconButton, InputAdornment, Tooltip } from "@mui/material";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface CopyTextFieldProps {
  value: string;
  [key: string]: any; // To support additional props for TextField
}

const CopyTextField: React.FC<CopyTextFieldProps> = ({ value, ...props }) => {
  const [copied, setCopied] = useState(false);
  const pixCopiaECola = useSelector(
    (state: RootState) => state.paymentModalSlice.pixCopiaECola
  );


  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copy state after 2 seconds
    });
  };

  useEffect(() => {console.log(pixCopiaECola);}, [pixCopiaECola]);

  return (
    <TextField
      {...props}
      value={pixCopiaECola}
      fullWidth
      variant="outlined"
      InputProps={{
        readOnly: true,
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title={copied ? "Copiado!" : "Copiar"}>
              <IconButton
                onClick={handleCopy}
                size="small"
                sx={{ color: "grey" }}
              >
                <CopyAllIcon />
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
        sx: {
          "& .MuiInputBase-input": {
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          },
          mt: 1,
          fontSize: 14,
        },
      }}
    />
  );
};

export default CopyTextField;
