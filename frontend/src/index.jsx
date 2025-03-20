import React from "react";
import { Toaster } from "react-hot-toast";
import { createRoot } from "react-dom/client";

import "./index.css";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
import ReduxProvider from "./redux/ReduxProvider";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ReduxProvider>
      <App />
      <Toaster position="top-center" reverseOrder={false} />
    </ReduxProvider>
  </React.StrictMode>
);

// Performance monitoring
reportWebVitals();
