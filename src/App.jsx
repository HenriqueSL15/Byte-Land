import { useState } from "react";
import HomePage from "./components/HomePage.jsx";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import "./App.css";

function App() {
  return (
    <>
      {/* Cria um roteador com diversas rotas */}
      <Router>
        <Routes>
          {/* Cada rota liga a uma URL e um elemento para ser exibido ao entrar na mesma */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
