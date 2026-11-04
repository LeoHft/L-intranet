import { AuthAttributesProvider } from "@/context/AuthAttributsContext";
import { ThemeProvider } from "@/context/ThemeContext";
import App from "./App.jsx";

import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")).render(
  <AuthAttributesProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </AuthAttributesProvider>
);
