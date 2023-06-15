import React from "react";
import EditablePage from "./editablePage";

const Home = () => {
  return (
    <div>
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
      {/**Render Editablepage components */}
      <EditablePage />
    </div>
  );
};

export default Home;
