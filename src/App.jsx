import { useState } from "react";
import LeftPart from "./components/LeftPart.jsx";
import MiddlePart from "./components/MiddlePart.jsx";
import RightPart from "./components/RightPart.jsx";
import "./App.css";

function App() {
  return (
    <>
      <div className="flex">
        <div className="w-3/12 h-screen">
          <LeftPart></LeftPart>
        </div>
        <div className="w-6/12 h-screen">
          <MiddlePart></MiddlePart>
        </div>
        <div className="w-3/12 h-screen">
          <RightPart></RightPart>
        </div>
      </div>
    </>
  );
}

export default App;
