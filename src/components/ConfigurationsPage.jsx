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
    <div className="flex w-full">
      <div className="flex left-0 flex-row w-1/3">
        <LeftMenu optionChange={handleOption}></LeftMenu>
      </div>
      <div className="flex flex-col w-full">
        {options.map((curOption) => {
          console.log(curOption.text);
          if (curOption.text === option) {
            console.log(curOption.text);
            return curOption.element;
          }
        })}
      </div>
    </div>
  );
}

export default ConfigurationsPage;
