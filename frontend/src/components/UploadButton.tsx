import Button from '@mui/material/Button';
import { ChangeEvent } from 'react';

export default function UploadButton() {
    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }
        const file = e.target.files[0];
    }
    return <Button variant="contained" component="label">
        SELECIONAR ARQUIVO PDF
        
        <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            hidden
        />
    </Button>
}