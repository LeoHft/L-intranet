import { AuthAttributesProvider } from "@/context/AuthAttributsContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./index.css";
import App from "./App.jsx";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <AuthAttributesProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </AuthAttributesProvider>
  // </StrictMode>,
);
