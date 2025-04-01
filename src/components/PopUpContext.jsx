import { createContext, useContext, useState } from "react";

const PopUpContext = createContext();

export const PopUpProvider = ({ children }) => {
  const [show, setShow] = useState(false);
  const [message, setMessage] = useState("");
  const [fn, setFn] = useState(null);
  const [type, setType] = useState("");

  //Função para mostrar o pop up
  function showPopUp() {
    setShow(true);
  }

  //Função para definir a função do pop up
  function setPopUpFn(fn) {
    setFn(fn);
  }

  //Função para definir o tipo do pop up
  function setPopUpType(type) {
    setType(type);
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
      value={{
        show,
        showPopUp,
        closePopUp,
        message,
        setPopUpMessage,
        fn,
        setPopUpFn,
        type,
        setPopUpType,
      }}
    >
      {children}
    </PopUpContext.Provider>
  );
};

export const usePopUp = () => useContext(PopUpContext);
