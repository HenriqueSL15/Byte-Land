import { createContext, useContext, useState } from "react";

const FriendsContext = createContext();

export const FriendsProvider = ({ children }) => {
  const [showFriends, setShowFriends] = useState(false);

  return (
    <FriendsContext.Provider value={{ showFriends, setShowFriends }}>
      {children}
    </FriendsContext.Provider>
  );
};

export const useFriends = () => {
  return useContext(FriendsContext);
};
