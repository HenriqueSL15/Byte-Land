import React, { createContext, useState, useEffect } from "react";

// Cria o contexto de autenticação que será usado em toda a aplicação
export const AuthContext = createContext();

// Componente provedor que envolve a aplicação e fornece o estado de autenticação
export const AuthProvider = ({ children }) => {
  // Estado para armazenar os dados do usuário autenticado
  const [user, setUser] = useState(null);

  // Estado para controlar se os dados estão sendo carregados
  const [isLoading, setIsLoading] = useState(true);

  // Efeito que executa uma vez ao montar o componente
  // Recupera os dados do usuário do localStorage para manter a sessão após recarregar a página
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem("user");
        // Verifica se o valor armazenado é válido antes de fazer o parse
        if (storedUser && storedUser !== "undefined") {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error("Erro ao carregar usuário:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  // Função para autenticar o usuário
  // Atualiza o estado e persiste os dados no localStorage
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Função para desconectar o usuário
  // Limpa o estado e remove os dados do localStorage
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  // Fornece o contexto com o estado do usuário e as funções de autenticação
  // para todos os componentes filhos na árvore de componentes
  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
