import React, { useState, useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";
import axios from "axios";

function UserSecurityPage() {
  const { user } = useContext(AuthContext);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  async function handleSubmit(userID, newPassword, oldPassword) {
    try {
      const response = await axios.post(
        "http://localhost:3000/changePassword",
        {
          userID: userID,
          newPassword: newPassword,
          oldPassword: oldPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status == 200) {
        console.log("Senha alterada com sucesso!", response.data);
        setOldPassword("");
        setNewPassword("");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="min-h-screen flex justify-end items-top border-l-2">
      <div className="flex flex-col w-9/10">
        <h1 className="font-semibold text-4xl text-gray-800 text-center py-5 mt-3 font-montserrat">
          Segurança
        </h1>
        <div className="flex flex-col  mx-20 shadow-xl p-10 rounded-xl gap-10">
          <div className="w-full h-24 ">
            <h2 className="text-3xl text-gray-800 mb-2 font-semibold flex gap-3">
              Senha Atual:
            </h2>
            <input
              className="border-2 border-gray-300 rounded-lg min-h-10 w-full p-2 font-funnel-sans"
              placeholder="Digite a sua senha atual"
              onChange={(e) => setOldPassword(e.target.value)}
              value={oldPassword}
              type="text"
            />
          </div>
          <div className="w-full h-24 ">
            <h2 className="text-3xl text-gray-800 mb-2 font-semibold flex gap-3">
              Nova Senha:
            </h2>
            <input
              className="border-2 border-gray-300 rounded-lg min-h-10 w-full p-2 font-funnel-sans"
              placeholder="Digite a nova senha"
              onChange={(e) => setNewPassword(e.target.value)}
              value={newPassword}
              type="text"
            />
          </div>
          <div className="w-full min-h-24 ">
            <div className="flex justify-center items-center">
              <button
                type="button"
                onClick={() => handleSubmit(user._id, newPassword, oldPassword)}
                className="border-2 border-black p-10 cursor-pointer hover:bg-black hover:text-white transition-all font-bold py-2 px-4 rounded"
              >
                Alterar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSecurityPage;
