import React, { useEffect } from "react";
import { Grid } from "@mui/material";
import Header from "./components/Header/Header";
import Links from "./Links";
import Footer from "./components/Footer/Footer";

export default function App() {
  useEffect(() => {
    // Adjust tab title (base it on the route)
    document.title = "iLoveProvaAntiga | Medicina";
  }, []);

  return (
    <Grid
      container
      spacing={1}
      justifyContent="center"
      style={{ textAlign: "center" }}
    >
      <Header />
      <Links />
      <Footer />
    </Grid>
  );
}
