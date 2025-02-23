import { FaTrashCan } from "react-icons/fa6";
import { AuthContext } from "./AuthContext.jsx";
import { useContext, useEffect, useState } from "react";
import { usePopUp } from "./PopUpContext.jsx";
import axios from "axios";

function Publication({ id, isOwner, owner, date, title, description, image }) {
  //Contexto do usuário
  const { user } = useContext(AuthContext);

  //Estado para mostrar ou não o botão de deletar publicação
  const { show, showPopUp, closePopUp, message, setPopUpMessage } = usePopUp();

  //Função para deletar a publicação
  async function handleDeletePublication() {
    const publicationData = {
      id: id,
      owner: owner,
    };

    const response = await axios.delete(
      `http://localhost:3000/deletePublication`,
      {
        data: publicationData,
      }
    );
  }

  if (typeof image == "string") image.replaceAll("\\", "/");
  return (
    <div className="flex items-center justify-center mb-10">
      <div className={`w-9/10 min-h-[600px] shadow-lg  rounded-lg my-5 `}>
        <div className="m-5 mb-10 flex items-center gap-2">
          <img
            src="https://cdn-icons-png.flaticon.com/512/711/711769.png"
            alt="Foto da pessoa"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl font-poppins font-medium">{owner}</h1>
            <h2 className="text-sm text-gray-600 font-poppins">
              {new Date(date).toLocaleString("pt-BR")}
            </h2>
          </div>
        </div>
        <div className="m-5 overflow-y-auto scrollbar-hide">
          <h1 className="text-2xl mb-3 font-funnel-sans">{title}</h1>
          <h2 className="text-base text-gray-800 mb-5 font-funnel-sans">
            {description}.
          </h2>
          <div className="flex justify-start">
            <img
              className="max-h-2/4 mb-5 rounded-lg"
              src={
                typeof image == "string"
                  ? "http://localhost:3000/" + image
                  : "No Image"
              }
              alt="Foto da publicação"
            />
          </div>
        </div>
        {/* Botão de deletar publicação */}
        {isOwner && (
          <div className="flex justify-start px-5 items-center gap-2 mb-5 h-[20px]">
            <button
              type="button"
              className=" font-bold py-2 px-4 rounded-full bg-white border-2 cursor-pointer hover:scale-103 hover:bg-black hover:text-white hover:border-2 transition-all"
              onClick={() => {
                setPopUpMessage(
                  "Tem certeza que você deseja deletar essa publicação? Essa ação não tem retorno."
                );
                showPopUp();
              }}
            >
              <FaTrashCan className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      {/* Pop Up */}
      {show && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 ">
          <div className="bg-white border-2 p-10 rounded-lg">
            <p className="text-red-500 text-center font-poppins text-xl font-semibold">
              {message}
            </p>
            <div className="flex justify-center gap-2 scale-130 mt-10">
              <button
                type="button"
                className="border-b-2 font-poppins text-sm hover:bg-gray-200 px-5 pt-1 rounded-lg transition-all"
                onClick={() => closePopUp()}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="border-b-2  font-poppins text-sm hover:bg-red-200 px-5 pt-1 rounded-lg transition-all"
                onClick={() => {
                  handleDeletePublication();
                  closePopUp();
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Publication;
