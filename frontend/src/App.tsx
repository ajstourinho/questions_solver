
import { Links } from './Links';
import { Grid} from "@mui/material";
import Footer from "./components/Footer/Footer";
import { Header } from './components/Header/Header';

function App() {
  return (
    <Grid container spacing={1} justifyContent="center" alignItems="center" style={{ textAlign: "center" }}>
      <Header/>
      <Links/>
      <Footer />
    </Grid>
  );
}

export default App;
