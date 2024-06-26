import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { NextUIProvider } from "@nextui-org/react";
import { Provider } from "react-redux";
import App from "./App";
import { store } from "./Store/store";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <NextUIProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </NextUIProvider>
);
