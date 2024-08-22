import React from "react";
import * as ReactDOM from "react-dom";

// import { ThemeProvider } from "@mui/material/styles";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import App from "./App";
import { store } from "./store/store";
import { Provider } from "react-redux";
import { BrowserRouter } from 'react-router-dom';
import { FileContextProvider } from "./contexts/FileContext";


const root = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <FileContextProvider>
      <Provider store={store}>
        {/* <ThemeProvider theme={theme}> */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
        {/* </ThemeProvider> */}
      </Provider>
    </FileContextProvider>
  </React.StrictMode>,
  root
);
