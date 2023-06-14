import React from "react";
import { createRoot } from "react-dom/client";
import "./css/styles.css";
import Home from "./components/Home";

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    {/**Render Home components */}
    <Home />
  </React.StrictMode>
);
