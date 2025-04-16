import { createContext, useState, useContext } from "react";

// Cria o contexto para gerenciar o estado de notificações na aplicação
const NotificationContext = createContext();

// Componente provedor que disponibiliza o estado de notificações para toda a aplicação
export const NotificationProvider = ({ children }) => {
  // Estado que controla a visibilidade do painel de notificações
  const [showNotifications, setShowNotifications] = useState(false);

  // Fornece o estado e a função para atualizar o estado aos componentes filhos
  return (
    <NotificationContext.Provider
      value={{ showNotifications, setShowNotifications }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook personalizado para facilitar o acesso ao contexto de notificações
// Permite que componentes consumam o contexto sem importar useContext e NotificationContext
export const useNotifications = () => {
  return useContext(NotificationContext);
};
