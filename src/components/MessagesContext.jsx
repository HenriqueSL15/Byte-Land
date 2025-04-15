import { createContext, useContext, useState } from "react";

const MessagesContext = createContext();

export const MessagesProvider = ({ children }) => {
  const [showMessages, setShowMessages] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

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

export const useMessages = () => {
  return useContext(MessagesContext);
};
