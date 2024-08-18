import Button from '@mui/material/Button';
import { ChangeEvent, useEffect } from 'react';
import { useFileContext } from '../contexts/FileContext';

export default function UploadButton() {
    const {file, receiveFile} = useFileContext()

    const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) {
            return;
        }
        receiveFile(e.target.files[0])
    }
    // debugging if file was set
    useEffect(()=>{
        const asyncPrint = async () => {
            console.log(file?.text())
        }
        asyncPrint()
    }, [file])
    return <Button variant="contained" component="label">
        SELECIONAR ARQUIVO PDF
    
        <input
            type="file"
            accept=".pdf"
            onChange={handleFileUpload}
            hidden
        />
    </Button>
}