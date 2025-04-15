import { createContext, useContext, useState } from "react";

const MessagesContext = createContext();

export const MessagesProvider = ({ children }) => {
  const [showMessages, setShowMessages] = useState(false);

  return (
    <MessagesContext.Provider value={{ showMessages, setShowMessages }}>
      {children}
    </MessagesContext.Provider>
  );
};

export const useMessages = () => {
  return useContext(MessagesContext);
};
