import React from "react";
// import ReactDOM from "react-dom";
import EditablePage from "./components/editablePage";
import { createRoot } from "react-dom/client";
import "./css/styles.css";

const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <h1 className="Logo bg-slate-100 text-3xl font-bold px-2 py-3 pl-4 rounded-lg">
      Notion Clone
    </h1>
    <p className="Intro">
      Helloo{" "}
      <span role="img" aria-label="greetings" className="Emoji">
        👋
      </span>{" "}
      You can add content below. Type <span className="Code">/</span> to see
      available commands.
    </p>
    <EditablePage />
  </React.StrictMode>
);
