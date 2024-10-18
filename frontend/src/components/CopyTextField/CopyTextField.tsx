import React, { useState } from "react";
import { TextField, IconButton, InputAdornment, Tooltip } from "@mui/material";
import CopyAllIcon from "@mui/icons-material/CopyAll";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface CopyTextFieldProps {
  [key: string]: any; // To support additional props for TextField
}

const CopyTextField: React.FC<CopyTextFieldProps> = ({ ...props }) => {
  const [copied, setCopied] = useState(false);
  const pixCopiaECola = useSelector(
    (state: RootState) => state.paymentModalSlice.pixCopiaECola
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(pixCopiaECola).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copy state after 2 seconds
    });
  };

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
                color= "primary"
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
