import LeftMenu from "./LeftMenu.jsx";
import { useState } from "react";
import UserConfigPage from "./UserConfigPage";

function ConfigurationsPage() {
  const [option, setOption] = useState("Informações do Usuário");

  const options = [
    {
      id: 1,
      text: "Informações do Usuário",
      element: <UserConfigPage />,
    },
  ];

  function handleOption(option) {
    setOption(option);
  }
  return (
    <div className="flex flex-row">
      <LeftMenu optionChange={handleOption}></LeftMenu>
      {options.map((curOption) => {
        console.log(curOption.text);
        if (curOption.text === option) {
          console.log(curOption.text);
          return curOption.element;
        }
      })}
    </div>
  );
}

export default ConfigurationsPage;
