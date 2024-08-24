import { Grid } from "@mui/material";
import Header from './components/Header/Header';
import Links from './Links';
import Footer from "./components/Footer/Footer";

export default function App() {
  return (
    <Grid container spacing={1} justifyContent="center" alignItems="center" style={{ textAlign: "center" }}>
      <Header/>
      <Links/>
      <Footer />
    </Grid>
  );
}
