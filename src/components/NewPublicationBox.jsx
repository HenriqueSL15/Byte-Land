import { CiImageOn } from "react-icons/ci";
import React, { useState, useContext } from "react";
import axios from "axios";

import { AuthContext } from "./AuthContext.jsx";
import { usePopUp } from "./PopUpContext.jsx";

function NewPublicationBox() {
  //Contexto de pop-up
  const { show, showPopUp, closePopUp, message, setPopUpMessage } = usePopUp();

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const titleLimit = 100;
  const descriptionLimit = 500;

  const { user } = useContext(AuthContext);

  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file); // Armazena o arquivo, não a URL
      console.log("Image:", file);
    }
  };

  const handleSubmitPublication = async () => {
    if (!title || !description) {
      setPopUpMessage("Preencha todos os campos!");
      showPopUp();
      return;
    }

    const formData = new FormData();
    formData.append("owner", user._id); //Alterar par ao ID
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image ? image : null); // Adiciona o arquivo de imagem
    }

    try {
      const response = await axios.post(
        "http://localhost:3000/publications",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // Usado para enviar arquivos
          },
        }
      );
      console.log("resposta do servidor:", response.status);
      if (response.status === 201) {
        setPopUpMessage("Publicação criada com sucesso!");
        showPopUp();
        setTitle("");
        setDescription("");
        setImage(null);
      }
    } catch (error) {
      console.error("Erro ao enviar a publicação:", error);
    }
  };

  return (
    <div className={`flex items-center justify-center mb-10 z-10`}>
      <div className="w-9/10 shadow-lg rounded-lg my-5">
        <div className="m-5 mb-5 flex items-center gap-2">
          <img
            src={
              user.image !=
              "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                ? `http://localhost:3000/${user.image}`
                : "https://cdn-icons-png.flaticon.com/512/711/711769.png"
            }
            alt="Foto da pessoa"
            className="w-12 h-12 rounded-full"
          />
          <div className="flex flex-col">
            <h1 className="text-2xl font-poppins font-medium">
              {user ? user.name : "Nome da Pessoa"}
            </h1>
          </div>
        </div>
        <div className="m-5 flex flex-col justify-center">
          <div className="flex flex-col items-center">
            <div className="w-full relative">
              <input
                type="text"
                className={`text-2xl mb-3 px-2 pt-2 pb-0 border-b-1 w-full font-montserrat focus:outline-none focus:border-b-2`}
                placeholder="Título da publicação"
                value={title}
                onChange={(e) => {
                  if (e.target.value.length <= titleLimit) {
                    setTitle(e.target.value);
                  }
                }}
              />
              <h2
                className={`text-[15px] select-none absolute right-1 bottom-11 ${
                  title.length == titleLimit && "text-red-500"
                } `}
              >
                {title.length}/{titleLimit}
              </h2>
            </div>
            <div className="w-full relative">
              <textarea
                className="text-base text-gray-800 w-full font-funnel-sans   mb-5 overflow-y-scroll scrollbar-hide h-[200px] p-2 border-1 border-gray-500 rounded-lg"
                placeholder="Conteúdo da publicação"
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= descriptionLimit) {
                    setDescription(e.target.value);
                  }
                }}
              />
              <h2
                className={`text-[15px] select-none absolute right-2 bottom-7   ${
                  description.length == descriptionLimit && "text-red-500"
                } `}
              >
                {description.length}/{descriptionLimit}
              </h2>
            </div>
          </div>

          {/* Exibe a imagem selecionada */}
          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Imagem selecionada"
              className="max-h-60 w-auto mx-auto object-contain mb-5 rounded-lg"
            />
          )}

          <div className="flex items-center justify-between">
            {/* Botão para selecionar imagem */}
            <label className="flex items-center justify-center w-16 h-16 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
              <CiImageOn className="w-14 h-14" />
              <input
                type="file"
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
            </label>

            {/* Botão para apagar imagem */}
            {image && (
              <button
                type="button"
                className="text-black h-1/2 font-bold border-2 w-1/4 py-2 px-4 rounded-full cursor-pointer"
                onClick={() => setImage(null)}
              >
                Delete Image
              </button>
            )}
          </div>

          {/* Botão de enviar */}
          <button
            type="button"
            onClick={handleSubmitPublication}
            className="mt-5 text-center w-2/6 p-3 rounded-lg h-full border-2 font-poppins font-semibold text-xl cursor-pointer hover:bg-gray-100 hover:text-gray-900"
          >
            Enviar Publicação
          </button>
        </div>
      </div>
    </div>
  );
}

export default NewPublicationBox;
