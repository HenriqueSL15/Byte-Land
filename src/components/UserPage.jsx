import React, { useContext, useEffect, useState } from "react";
import LeftPart from "./LeftPart.jsx";
import RightPart from "./RightPart.jsx";
import { AuthContext } from "./AuthContext.jsx";

function UserPage() {
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <div className="flex flex-row ">
      <div className="w-3/12">
        <LeftPart />
      </div>
      <div className="w-6/12  bg-[#F2F2F2]">
        <div className="h-screen w-full p-5 flex flex-col">
          <div className="relative pb-14">
            <img
              src={`http://localhost:3000/${user.image}`}
              className="absolute bottom-0 left-3 h-32 w-32 bg-black rounded-full z-50 border-3 border-white shadow-md "
              alt="Imagem do Usuário"
            />
            <img
              src="https://preview.redd.it/oupwnwwcn8fe1.jpeg?auto=webp&s=bb26424933e0ec767facc328ab0c53e3c892fae3"
              alt="Imagem do Perfil do Usuário"
              className="rounded-lg w-full h-72 z-40"
            />
            <div className="absolute left-36 top-[87%] max-w-[450px]">
              <h1 className="font-funnel-sans text-2xl mb-1">{user.name}</h1>
              <p className="font-funnel-sans text-lg text-[#979797]">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                Explicabo placeat nemo quod beatae natus dolore, accusamus, sunt
              </p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-3/12">
        <RightPart />
      </div>
    </div>
  );
}

export default UserPage;
