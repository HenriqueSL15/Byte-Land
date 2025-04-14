import LeftMenu from "./LeftMenu.jsx";
import { useState } from "react";
import UserConfigPage from "./UserConfigPage.jsx";
import UserSecurityPage from "./UserSecurityPage.jsx";
import { useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";
import { useNavigate } from "react-router-dom";

import { motion, AnimatePresence } from "framer-motion";

function ConfigurationsPage() {
  const { user, isLoading } = useContext(AuthContext);
  const navigate = useNavigate();

  if (!user && !isLoading) navigate("/login");

  const [option, setOption] = useState("Informações do Usuário");

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

  function handleOption(option) {
    setOption(option);
  }
  return (
    <div className="flex w-full">
      <div className="flex left-0 flex-row w-1/3">
        <LeftMenu optionChange={handleOption}></LeftMenu>
      </div>
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
