import React from 'react';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function RedirectButton() {
  const navigate = useNavigate();

  const handleRedirect = () => {
    navigate('/target-page');
  };

  return (
    <Button variant="contained" color="primary" onClick={handleRedirect}>
      Go to Target Page
    </Button>
  );
};