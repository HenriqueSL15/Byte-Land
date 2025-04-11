import { useState } from "react";
import HomePage from "./components/HomePage.jsx";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import ConfigurationsPage from "./components/ConfigurationsPage.jsx";
import UserPage from "./components/UserPage.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import "./App.css";

function App() {
  return (
    <>
      <Toaster richColors />
      {/* Cria um roteador com diversas rotas */}
      <Router>
        <Routes>
          {/* Cada rota liga a uma URL e um elemento para ser exibido ao entrar na mesma */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/configs" element={<ConfigurationsPage />} />
          <Route path="/userPage/:userId" element={<UserPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
