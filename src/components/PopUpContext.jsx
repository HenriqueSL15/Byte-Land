import { createContext, useContext, useState } from "react";

const PopUpContext = createContext();

export const PopUpProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");

  //Função para mostrar o pop up
  function showPopUp() {
    setShow(true);
  }

  //Função para definir a mensagem
  function setPopUpMessage(message) {
    setMessage(message);
  }

  //Função para fechar o pop up
  function closePopUp() {
    setShow(false);
  }

  return (
    <PopUpContext.Provider
      value={{ show, showPopUp, closePopUp, message, setPopUpMessage }}
    >
      {children}
    </PopUpContext.Provider>
  );
};

export const usePopUp = () => useContext(PopUpContext);
