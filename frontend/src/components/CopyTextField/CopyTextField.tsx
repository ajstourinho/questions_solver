import React, { useState } from "react";
import { TextField, IconButton, InputAdornment, Tooltip } from "@mui/material";
import CopyAllIcon from "@mui/icons-material/CopyAll";

interface CopyTextFieldProps {
  value: string;
  [key: string]: any; // To support additional props for TextField
}

const CopyTextField: React.FC<CopyTextFieldProps> = ({ value, ...props }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset copy state after 2 seconds
    });
  };

  return (
    <TextField
      {...props}
      value={value}
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
