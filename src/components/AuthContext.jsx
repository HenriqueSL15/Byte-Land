import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Cria o contexto de autenticação
export const AuthContext = createContext();

// Provedor de autenticação
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Estado do usuário logado
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se há um usuário logado ao carregar a aplicação
  useEffect(() => {
    checkAuth();
  }, []);

  const fetchUser = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:3000/users/${userId}`);

      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await axios.get("http://localhost:3000/api/check-auth", {
        withCredentials: true,
      });

      if (response.data.isAuthenticated) {
        const userData = await fetchUser(response.data.user.id);

        if (!userData) throw new Error("User data not found");
        setUser(userData);
        setIsAuthenticated(true);
      }
    } catch (err) {
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    console.log(user);
  }, [user]);

  // Função para fazer login
  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  // Função para fazer logout
  const logout = async () => {
    try {
      await axios.post("/logout", {}, { withCredentials: true });
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, checkAuth, isLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
