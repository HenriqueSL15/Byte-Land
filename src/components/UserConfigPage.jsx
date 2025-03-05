import React, { useContext, useState } from "react";
import { AuthContext } from "./AuthContext.jsx";

function UserConfigPage() {
  const { user } = useContext(AuthContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  return (
    <div className="w-full h-screen flex justify-center items-top border-l-2 ">
      <div className="flex flex-col mt-10 w-9/10">
        <h1 className="font-semibold text-4xl text-gray-800 text-center p-10 font-montserrat">
          Informações do Usuário
        </h1>
        <div className="flex flex-col  mx-20 shadow-xl p-10 rounded-xl gap-10">
          <div className="w-full h-24 ">
            <h2 className="text-3xl text-gray-800 mb-2 font-semibold">
              Nome ({user && user.name})
            </h2>
            <input
              className="border-2 border-gray-300 rounded-lg min-h-10 w-full p-2 font-funnel-sans"
              placeholder="Digite o nome para alteração"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="w-full h-24 ">
            <h2 className="text-3xl text-gray-800 mb-2 font-semibold">
              Email ({user && user.email})
            </h2>
            <input
              className="border-2 border-gray-300 rounded-lg min-h-10 w-full p-2 font-funnel-sans"
              placeholder="Digite o email para alteração"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
            />
          </div>
          {/* <div className="w-full h-24 ">
            <h2 className="text-3xl mb-2 font-semibold">Imagem</h2>
            <input
              className="border-2 border-black rounded-lg min-h-10 min-w-1/2 p-2 font-funnel-sans"
              type="file"
            />
          </div> */}

          <div className="flex justify-center items-center">
            <button className="border-2 border-black p-10 cursor-pointer hover:bg-black hover:text-white transition-all font-bold py-2 px-4 rounded">
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserConfigPage;
