import React from "react";
import * as ReactDOM from "react-dom";

// import { ThemeProvider } from "@mui/material/styles";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import App from "./App";
// import { store } from "./store/store";
// import { Provider } from "react-redux";

import { BrowserRouter } from "react-router-dom";

const root = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    {/* <Provider store={store}>
      <ThemeProvider theme={theme}> */}
        <BrowserRouter>
          <App />
        </BrowserRouter>
      {/* </ThemeProvider>
    </Provider> */}
  </React.StrictMode >,
  root
);
