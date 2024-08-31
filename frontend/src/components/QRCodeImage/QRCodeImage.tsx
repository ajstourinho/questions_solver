import React from 'react';
import { Box, Card, CardMedia, Typography } from '@mui/material';

interface IQRCodeImage {
    base64String: string,
}

export default function QRCodeImage ({base64String}: IQRCodeImage) {
    return (
        <Card sx={{ maxWidth: 400, margin: 'auto', mt: 4, boxShadow: 3, borderRadius: 2 }}>
            <CardMedia
                component="img"
                image={`data:image/png;base64,${base64String}`}
                sx={{ borderRadius: 2 }}
            />
        </Card>
    );
};