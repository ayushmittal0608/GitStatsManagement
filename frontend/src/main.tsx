import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { AutoReviewProvider } from "./AutoReviewContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AutoReviewProvider>
        <App />
      </AutoReviewProvider>
    </BrowserRouter>
  </React.StrictMode>
);
