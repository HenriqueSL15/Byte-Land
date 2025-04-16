import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, delay } from "framer-motion";

// Menu lateral para navegação entre opções de configuração
function LeftMenu({ optionChange }) {
  const navigate = useNavigate();
  const [option, setOption] = useState("Perfil do Usuário");

  // Lista de botões de navegação disponíveis no menu
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
  ];

  // Gerencia navegação ou troca de opção quando um botão é clicado
  function handleClick(text) {
    if (text === "Home") {
      navigate("/");
    } else {
      optionChange(text);
    }
  }

  return (
    <div
      className={`flex flex-col fixed lg:p-4 xl:p-10 h-screen text-center w-1/3 border-r-2`}
    >
      {buttons.map((button) => (
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          transition={{
            duration: 0.2,
            ease: "easeInOut",
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          key={button.id}
          type="button"
          onClick={() => handleClick(button.text)}
          className="flex gap-4 p-2 cursor-pointer my-3 "
        >
          {button.icon}
          <p className="md:text-lg lg:text-2xl font-montserrat font-medium">
            {button.text}
          </p>
        </motion.button>
      ))}
    </div>
  );
}

export default LeftMenu;
