// Página de configurações do usuário com opções para perfil e segurança
import LeftMenu from "../components/layout/LeftMenu.jsx";
import { useState } from "react";
import UserConfigPage from "../components/user/UserConfigPage.jsx";
import UserSecurityPage from "../components/user/UserSecurityPage.jsx";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

function ConfigurationsPage() {
  // Obtém dados do usuário e estado de carregamento
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  // Redireciona para login se não houver usuário autenticado
  if (!user && !isLoading) navigate("/login");

  // Estado para controlar a opção selecionada
  const [option, setOption] = useState("Informações do Usuário");

  // Opções disponíveis com seus respectivos componentes
  const options = [
    {
      id: 1,
      text: "Informações do Usuário",
      element: <UserConfigPage />,
    },
    {
      id: 2,
      text: "Segurança",
      element: <UserSecurityPage />,
    },
  ];

  // Atualiza a opção selecionada
  function handleOption(option) {
    setOption(option);
  }

  return (
    <div className="flex w-full">
      {/* Menu lateral */}
      <div className="flex left-0 flex-row w-1/3">
        <LeftMenu optionChange={handleOption}></LeftMenu>
      </div>
      {/* Área de conteúdo */}
      <div className="flex flex-col w-full">
        {options.map((curOption) => {
          if (curOption.text === option) {
            return curOption.element;
          }
        })}
      </div>
    </div>
  );
}

export default ConfigurationsPage;
