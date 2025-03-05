import React, { useContext, useState, useRef, useEffect } from "react";
import { CiImageOn } from "react-icons/ci";
import { AuthContext } from "./AuthContext.jsx";

function UserConfigPage() {
  const { user } = useContext(AuthContext);
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    } else {
      setImage("");
    }
  };

  const handleDeleteImage = () => {
    if (image) {
      URL.revokeObjectURL(image);
      setImage("");
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  return (
    <div className="min-h-screen flex justify-end items-top border-l-2">
      <div className="flex flex-col w-9/10">
        <h1 className="font-semibold text-4xl text-gray-800 text-center py-5 mt-3 font-montserrat">
          Informações do Usuário
        </h1>
        <div className="flex flex-col  mx-20 shadow-xl p-10 rounded-xl gap-10">
          <div className="w-full h-24 ">
            <h2 className="text-3xl text-gray-800 mb-2 font-semibold flex gap-3">
              Nome <p className="text-gray-500">{user && user.name}</p>
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
            <h2 className="text-3xl text-gray-800 mb-2 font-semibold flex gap-3">
              Email <p className="text-gray-500">{user && user.email}</p>
            </h2>
            <input
              className="border-2 border-gray-300 rounded-lg min-h-10 w-full p-2 font-funnel-sans"
              placeholder="Digite o email para alteração"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
            />
          </div>
          <div className="w-full min-h-24 ">
            <h2 className="text-3xl text-gray-800 mb-2 font-semibold flex gap-3">
              Foto de Perfil{" "}
              <img
                src={user && user.image}
                alt=""
                className="w-10 h-10 rounded-full"
              />
            </h2>
            {!image && (
              <div className="relative w-10">
                {/* Input de arquivo escondido */}
                <input
                  type="file"
                  id="fileInput"
                  className="hidden w-1/3"
                  onChange={handleImageChange}
                />
                {/* Botão personalizado com uma imagem */}
                <label htmlFor="fileInput" className="cursor-pointer ">
                  <CiImageOn className="w-20 h-20 text-gray-800 hover:bg-gray-200 border-2 border-black rounded-lg" />
                </label>
              </div>
            )}
            <div className="flex items-center gap-4">
              {image && ( // Exibe a prévia da nova imagem abaixo do input
                <div className="mt-4 flex flex-col items-center gap-3 bg-gray-100 p-5 rounded-lg justify-center">
                  <h3 className="text-xl text-gray-800 mb-2 font-semibold font-poppins">
                    Nova Foto de Perfil:
                  </h3>
                  <img
                    src={image}
                    alt="Prévia da nova imagem"
                    className="w-20 h-20 rounded-full"
                  />
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="bg-white font-funnel-sans border-2 border-black hover:bg-gray-100 text-black px-4 py-2 rounded-lg cursor-pointer"
                  >
                    Deletar
                  </button>
                </div>
              )}
            </div>
          </div>

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
