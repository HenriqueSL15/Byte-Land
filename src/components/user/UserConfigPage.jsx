import React, { useContext, useState, useRef, useEffect } from "react";
import { CiImageOn } from "react-icons/ci";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import validator from "validator";
import axios from "axios";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

function UserConfigPage() {
  // Obtém dados do usuário e função de login do contexto de autenticação
  const { user, login } = useContext(AuthContext);

  // Referência para o input de arquivo
  const fileInputRef = useRef(null);

  // Estados para armazenar os dados do formulário
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  // Valida o formato do email usando a biblioteca validator
  const isEmailValid = email != "" && email != null && validator.isEmail(email);

  // Controla se o campo de email está em seu estado inicial
  const [isEmailInitial, setIsEmailInitial] = useState(true);

  // Estados para gerenciar a imagem do perfil
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  // Manipula a seleção de uma nova imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
      setImage(file);
    } else {
      setImagePreview("");
      setImage("");
    }
  };

  // Remove a imagem selecionada
  const handleDeleteImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview("");
      setImage("");
      fileInputRef.current.value = "";
    }
  };

  // Envia os dados do formulário para o servidor
  async function handleSubmit() {
    // Verifica se algum campo foi alterado
    const isNameChanged = name !== "" && name !== null;
    const isEmailChanged = email !== "" && email !== null;
    const isImageChanged = image !== "" && image !== null;

    if (!isNameChanged && !isEmailChanged && !isImageChanged) {
      toast.info("Nenhuma informação foi alterada!");
      return;
    }

    // Prepara os dados para envio
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    if (image) {
      formData.append("image", image);
    }

    try {
      // Envia requisição para atualizar os dados do usuário
      const response = await axios.put(
        `https://byte-land-backend.vercel.app/users/${user._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status == 200) {
        toast.success("Informações editadas com sucesso!");
        // Limpa os campos após sucesso
        setName("");
        setEmail("");
        setImage("");
        setImagePreview("");
        // Atualiza os dados do usuário no contexto
        login(response.data.user);
      }
    } catch (error) {
      console.error(error);
      toast.error("Erro ao editar informações! Tente novamente");
    }
  }

  // Limpa URLs de objeto quando o componente é desmontado
  useEffect(() => {
    return () => {
      if (image) {
        URL.revokeObjectURL(image);
      }
    };
  }, [image]);

  // Atualiza o estado de validação do email
  useEffect(() => {
    if (!email) {
      setIsEmailInitial(true);
    } else {
      setIsEmailInitial(false);
    }
  }, [email]);

  return (
    <motion.div
      key={"user-config-page"}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="min-h-screen flex justify-end items-top"
    >
      <div className="flex flex-col w-9/10">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.2, ease: "easeInOut" }}
          className="font-semibold sm:text-2xl md:text-4xl text-gray-800 text-center py-5 mt-3 font-montserrat"
        >
          Informações do Usuário
        </motion.h1>
        <div className="flex flex-col  mx-20 shadow-xl p-10 rounded-xl gap-10">
          <div className="w-full h-24 ">
            <h2 className="md:text-xl lg:text-3xl text-gray-800 mb-2 font-semibold flex gap-3">
              Nome
              <p className="md:text-xl lg:text-3xl text-gray-500">
                {user && user.name}
              </p>
            </h2>
            <input
              className="border-2 border-gray-300 rounded-lg sm:text-xs md:text-xl min-h-10 w-full p-2 font-funnel-sans"
              placeholder="Digite o nome para alteração"
              type="text"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="w-full h-24 ">
            <h2 className="md:text-xl lg:text-3xl text-gray-800 mb-2 font-semibold flex gap-3">
              Email
              <p className="md:text-xl lg:text-3xl text-gray-500">
                {user && user.email}
              </p>
            </h2>
            <input
              // Aplica classes condicionais baseadas na validação do email
              className={`border-2 border-gray-300 rounded-lg sm:text-xs md:text-xl min-h-10 w-full p-2 font-funnel-sans focus:outline-none ${
                isEmailInitial
                  ? "border-gray-300"
                  : isEmailValid
                  ? "border-green-500 focus:border-green-500"
                  : "border-red-500 focus:border-red-500"
              }`}
              placeholder="Digite o email para alteração"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="text"
            />
          </div>
          <div className="w-full min-h-24 ">
            <h2 className="md:text-xl lg:text-3xl text-gray-800 mb-2 font-semibold flex gap-3">
              Foto de Perfil
              <img
                src={user && user.image}
                alt=""
                className="w-10 h-10 rounded-full"
              />
            </h2>
            {!imagePreview && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative w-10"
              >
                {/* Input de arquivo escondido */}
                <input
                  type="file"
                  id="fileInput"
                  className="hidden w-1/3"
                  onChange={handleImageChange}
                />
                {/* Botão personalizado com uma imagem */}
                <label htmlFor="fileInput" className="cursor-pointer ">
                  <CiImageOn className="sm:w-15 sm:h-15 md:w-20 md:h-20 text-gray-800 hover:bg-gray-200 border-2 border-black rounded-lg" />
                </label>
              </motion.div>
            )}
            <div className="flex items-center gap-4">
              <AnimatePresence mode="wait">
                {imagePreview && ( // Exibe a prévia da nova imagem abaixo do input
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mt-4 flex flex-col items-center gap-3 bg-gray-100 p-5 rounded-lg justify-center"
                  >
                    <h3 className="text-xl text-gray-800 mb-2 font-semibold font-poppins">
                      Nova Foto de Perfil:
                    </h3>
                    <img
                      src={imagePreview}
                      alt="Prévia da nova imagem"
                      className="w-20 h-20 rounded-full"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleDeleteImage}
                      className="bg-white font-funnel-sans border-2 border-black hover:bg-gray-100 text-black px-4 py-2 rounded-lg cursor-pointer"
                    >
                      Deletar
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleSubmit}
              className="border-2 border-black p-10 cursor-pointer hover:bg-black hover:text-white transition-all font-bold py-2 px-4 rounded"
            >
              Salvar
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UserConfigPage;
