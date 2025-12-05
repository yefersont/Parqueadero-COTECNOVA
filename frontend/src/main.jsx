// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { RegistroProvider } from "./context/RegistroContext.jsx";
import { HeroUIProvider } from "@heroui/react";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename="/">
      <HeroUIProvider>
        <RegistroProvider>
          <App />
        </RegistroProvider>
      </HeroUIProvider>
    </BrowserRouter>
  </React.StrictMode>
);
