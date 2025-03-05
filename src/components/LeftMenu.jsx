import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function LeftMenu({ optionChange }) {
  const navigate = useNavigate();

  const [option, setOption] = useState("Perfil do Usuário");

  const buttons = [
    {
      id: 1,
      text: "Home",
    },
    {
      id: 2,
      text: "Informações do Usuário",
    },
    {
      id: 3,
      text: "Segurança",
    },
    {
      id: 4,
      text: "Preferências",
    },
    {
      id: 5,
      text: "Notificações",
    },
  ];

  function handleClick(text) {
    if (text === "Home") {
      navigate("/");
    } else {
      optionChange(text);
    }
  }

  return (
    <div className={`flex flex-col fixed p-10 h-screen text-center w-1/3`}>
      {buttons.map((button) => (
        <button
          key={button.id}
          type="button"
          onClick={() => handleClick(button.text)}
          className="flex gap-4 p-2 cursor-pointer my-3"
        >
          {button.icon}
          <p className="text-2xl font-montserrat font-medium">{button.text}</p>
        </button>
      ))}
    </div>
  );
}

export default LeftMenu;
