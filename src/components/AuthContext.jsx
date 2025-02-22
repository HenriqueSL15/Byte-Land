import React, { createContext, useState, useEffect } from "react";

// Cria o contexto de autenticação
export const AuthContext = createContext();

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado do usuário logado

  // Verifica se há um usuário logado ao carregar a aplicação
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Função para fazer login
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData)); // Salva no localStorage
  };

  // Função para fazer logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user"); // Remove do localStorage
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
