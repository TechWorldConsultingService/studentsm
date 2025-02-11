import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ReduxProvider from "./redux/ReduxProvider";
import { Toaster } from "react-hot-toast";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ReduxProvider>
      <App />
      <Toaster position="top-center" reverseOrder={false} />
    </ReduxProvider>
  </React.StrictMode>
);

// Performance monitoring
reportWebVitals();
