import { createContext, useContext, useState } from "react";

// Cria o contexto para gerenciar o estado de exibição do painel de amigos
const FriendsContext = createContext();

// Componente provedor que disponibiliza o estado de amigos para a aplicação
export const FriendsProvider = ({ children }) => {
  // Estado que controla a visibilidade do painel de amigos
  const [showFriends, setShowFriends] = useState(false);

  // Fornece o estado e a função para atualizar o estado aos componentes filhos
  return (
    <FriendsContext.Provider value={{ showFriends, setShowFriends }}>
      {children}
    </FriendsContext.Provider>
  );
};

// Hook personalizado para facilitar o acesso ao contexto de amigos
// Permite que componentes consumam o contexto sem importar useContext e FriendsContext
export const useFriends = () => {
  return useContext(FriendsContext);
};
