import { useState } from "react";
import HomePage from "./pages/HomePage.jsx";
import SignUp from "./pages/SignUp.jsx";
import Login from "./pages/Login.jsx";
import ConfigurationsPage from "./pages/ConfigurationsPage.jsx";
import UserPage from "./pages/UserPage.jsx";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

import "./App.css";
import ProtectedRoute from "./components/common/ProtectedRoute.jsx";

function App() {
  return (
    <>
      <Toaster richColors />
      {/* Cria um roteador com diversas rotas */}
      <Router>
        <Routes>
          {/* Cada rota liga a uma URL e um elemento para ser exibido ao entrar na mesma */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/configs"
            element={
              <ProtectedRoute>
                <ConfigurationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userPage/:userId"
            element={
              <ProtectedRoute>
                <UserPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
