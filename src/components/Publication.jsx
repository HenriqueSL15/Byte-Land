import { FaTrashCan } from "react-icons/fa6";
import { AuthContext } from "./AuthContext.jsx";
import { FaPencilAlt } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { useContext, useEffect, useState, useCallback } from "react";
import { usePopUp } from "./PopUpContext.jsx";
import axios from "axios";

function Publication({ id, isOwner, owner, date, title, description, image }) {
  // console.log(id);
  //Contexto do usuário
  const { user } = useContext(AuthContext);

  //Estado para mostrar ou não o botão de deletar publicação
  const { show, showPopUp, closePopUp, message, setPopUpMessage } = usePopUp();

  //Estaod sobre as edições feitas
  const [editedTitle, setEditedTitle] = useState(null);
  const [editedDescription, setEditedDescription] = useState(null);
  const [editedImage, setEditedImage] = useState(null);

  //Estado para alterar a exibição do botão para um form
  const [edit, setEdit] = useState(false);

  //Função para alterar a imagem
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setEditedImage(file); // Armazena o arquivo, não a URL
      console.log("Image:", file);
    }
  };

  //Função para deletar a publicação
  const handleDeletePublication = async (id, owner) => {
    console.log("ID dentro da função:", id); // Verifique o ID no console
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

    console.log("Resposta do servidor:", response.data);
  };

  //Função para editar a publicação
  async function handleEditPublication() {
    const formData = new FormData();

    // Adiciona os campos ao FormData
    formData.append("owner", owner);
    formData.append("id", id);
    formData.append("title", editedTitle == null ? title : editedTitle);
    formData.append(
      "description",
      editedDescription == null ? description : editedDescription
    );

    // Se uma nova imagem foi selecionada, adiciona ao FormData
    if (editedImage instanceof File) {
      formData.append("image", editedImage);
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/editPublication`,
        formData,
        { "Content-Type": "multipart/form-data" }
      );

      if (response.status == 200) {
        setEdit(false);
        setPopUpMessage("Publicação editada com sucesso!");
        showPopUp();
      }
    } catch (error) {
      setPopUpMessage(error.response.data.message);
      showPopUp();
    }
  }

  if (typeof image == "string") image.replaceAll("\\", "/");
  return !edit ? (
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
            {description}
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
                handleDeletePublication(id, owner);
                // setPopUpMessage(
                //   "Tem certeza que você deseja deletar essa publicação? Essa ação não tem retorno."
                // );
                // showPopUp();
              }}
            >
              <FaTrashCan className="w-5 h-5" />
            </button>
            <button
              type="button"
              className=" font-bold py-2 px-4 rounded-full bg-white border-2 cursor-pointer hover:scale-103 hover:bg-black hover:text-white hover:border-2 transition-all"
              onClick={() => {
                setEdit(true);
              }}
            >
              <FaPencilAlt className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      {/* Pop Up */}
      {show &&
        message ==
          "Tem certeza que você deseja deletar essa publicação? Essa ação não tem retorno." && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50">
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
                    handleDeletePublication(id, owner);
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
  ) : (
    edit && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-49">
        <div
          className={`min-h-[600px] shadow-lg  rounded-lg my-5 bg-white flex flex-col w-6/10`}
        >
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
            <div className="h-15 w-15 flex justify-center items-center gap-2 ml-auto">
              <button
                className="cursor-pointer w-full h-full"
                onClick={() => setEdit(false)}
              >
                <IoCloseOutline className="w-full h-full" />
              </button>
            </div>
          </div>
          <div className="m-5 overflow-y-auto scrollbar-hide">
            <input
              type="text"
              className="text-2xl mb-3 p-2 border-b-1 w-full font-montserrat"
              placeholder="Título da publicação"
              defaultValue={title}
              onChange={(e) => setEditedTitle(e.target.value)}
            />
            <textarea
              className="text-base text-gray-800 w-full font-funnel-sans mb-5 overflow-y-scroll scrollbar-hide h-[200px] p-2 border-1 border-gray-500 rounded-lg"
              placeholder="Conteúdo da publicação"
              defaultValue={description}
              onChange={(e) => setEditedDescription(e.target.value)}
            />
            {/* Exibe a imagem selecionada */}
            {editedImage && (
              <img
                className="rounded-lg max-h-60"
                src={
                  typeof editedImage == "object"
                    ? URL.createObjectURL(editedImage)
                    : "http://localhost:3000/" + editedImage
                }
                alt="Foto da publicação"
              />
            )}

            <div className="flex items-center justify-between">
              {/* Botão para selecionar imagem */}
              {!editedImage && (
                <label className="flex items-center justify-center w-16 h-16 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                  <CiImageOn className="w-14 h-14" />
                  <input
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </label>
              )}

              {/* Botão para apagar imagem */}
              {editedImage && (
                <button
                  type="button"
                  className="text-black h-1/2 font-bold border-2 w-1/4 py-2 px-4 rounded-full cursor-pointer"
                  onClick={() => setEditedImage(null)}
                >
                  Delete Image
                </button>
              )}
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
                    "Deseja editar essa publicação? Essa ação não tem retorno."
                  );
                  showPopUp();
                }}
              >
                <IoSend className="w-5 h-5" />
              </button>
            </div>
          )}
          {show &&
            message ==
              "Deseja editar essa publicação? Essa ação não tem retorno." && (
              <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50">
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
                        handleEditPublication();
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
      </div>
    )
  );
}

export default Publication;
