import { createContext, useContext, useState } from "react";

// Cria o contexto para gerenciar o estado de mensagens na aplicação
const MessagesContext = createContext();

// Componente provedor que disponibiliza o estado de mensagens para toda a aplicação
export const MessagesProvider = ({ children }) => {
  // Estado que controla a visibilidade do painel de mensagens
  const [showMessages, setShowMessages] = useState(false);

  // Estado que armazena o amigo selecionado para conversa
  const [selectedFriend, setSelectedFriend] = useState(null);

  // Fornece os estados e funções para atualização aos componentes filhos
  return (
    <MessagesContext.Provider
      value={{
        showMessages,
        setShowMessages,
        selectedFriend,
        setSelectedFriend,
      }}
    >
      {children}
    </MessagesContext.Provider>
  );
};

// Hook personalizado para facilitar o acesso ao contexto de mensagens
// Permite que componentes consumam o contexto sem importar useContext e MessagesContext
export const useMessages = () => {
  return useContext(MessagesContext);
};
