import React from "react";
// import ReactDOM from "react-dom";
import EditablePage from "./components/editablePage";
import { createRoot } from "react-dom/client";
import "./css/styles.css";
import Home from "./components/Home";

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <Home />
    <EditablePage />
  </React.StrictMode>
);
