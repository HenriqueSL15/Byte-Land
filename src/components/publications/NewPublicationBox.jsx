import { CiImageOn } from "react-icons/ci";
import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

import { AuthContext } from "../../contexts/AuthContext.jsx";

import { useMutation, useQueryClient } from "@tanstack/react-query";

// Função assíncrona para criar uma nova publicação
// Envia os dados do formulário para a API usando multipart/form-data
const createPublication = async (formData) => {
  const response = await axios.post(
    "https://byte-land-backend.vercel.app/publications",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data", // Necessário para enviar arquivos
      },
    }
  );

  return response.data;
};

function NewPublicationBox() {
  // Referência para o input de arquivo para manipulação direta do DOM
  const inputRef = useRef(null);

  // Estados para armazenar os dados do formulário
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  // Limites de caracteres para os campos
  const titleLimit = 100;
  const descriptionLimit = 500;

  // Cliente de consulta para gerenciar o cache do React Query
  const queryClient = useQueryClient();

  // Hook de mutação para criar uma nova publicação
  const mutation = useMutation({
    mutationFn: createPublication,
    onSuccess: () => {
      // Invalida a consulta de publicações para forçar uma nova busca
      queryClient.invalidateQueries({ queryKey: ["publications"] });

      // Feedback visual e reset do formulário
      toast.success("Publicação criada com sucesso!");
      setTitle("");
      setDescription("");
      setImage(null);
    },
    onError: (error) => {
      console.error("Erro ao enviar a publicação:", error);
      toast.error(error.response?.data?.message);
    },
  });

  // Obtém dados do usuário atual do contexto de autenticação
  const { user } = useContext(AuthContext);

  // Manipula a seleção de imagem
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setImage(file); // Armazena o arquivo, não a URL
    }
  };

  // Remove a imagem selecionada
  const removeImage = () => {
    setImage(null);
    if (inputRef.current) {
      inputRef.current.value = ""; // Limpa o input de arquivo
    }
  };

  // Manipula o envio da publicação
  const handleSubmitPublication = async () => {
    // Validação básica
    if (!title || !description) {
      toast.error("Preencha todos os campos!");
      return;
    }

    // Cria um objeto FormData para enviar dados multipart
    const formData = new FormData();
    formData.append("owner", user._id);
    formData.append("title", title);
    formData.append("description", description);
    if (image) {
      formData.append("image", image);
    }

    // Executa a mutação com os dados do formulário
    mutation.mutate(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className={`flex items-center justify-center mb-10 z-10`}
    >
      <div className="w-9/10 shadow-lg rounded-lg my-5">
        {/* Cabeçalho com informações do usuário */}
        <div className="m-5 mb-5 flex items-center gap-2">
          <img
            src={user?.image}
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
            {/* Campo de título com contador de caracteres */}
            <div className="w-full relative">
              <input
                type="text"
                className={`md:text-2xl mb-3 px-2 pt-2 pb-0 border-b-1 w-full font-montserrat focus:outline-none focus:border-b-2`}
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
            {/* Campo de descrição com contador de caracteres */}
            <div className="w-full relative">
              <textarea
                className="text-base text-gray-800 w-full font-funnel-sans mb-5 overflow-y-scroll scrollbar-hide h-[200px] p-2 border-1 border-gray-500 rounded-lg"
                placeholder="Conteúdo da publicação"
                value={description}
                onChange={(e) => {
                  if (e.target.value.length <= descriptionLimit) {
                    setDescription(e.target.value);
                  }
                }}
              />
              <h2
                className={`text-[15px] select-none absolute right-2 bottom-7 ${
                  description.length == descriptionLimit && "text-red-500"
                } `}
              >
                {description.length}/{descriptionLimit}
              </h2>
            </div>
          </div>
          <div>
            {/* Exibe a imagem selecionada com animação */}
            <AnimatePresence>
              {image && (
                <motion.img
                  initial={{ opacity: 1, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                  }}
                  src={URL.createObjectURL(image)}
                  alt="Imagem selecionada"
                  className="max-h-60 w-auto mx-auto object-contain mb-5 rounded-lg"
                />
              )}
            </AnimatePresence>

            <motion.div className="flex items-center justify-between">
              {/* Botão para selecionar imagem */}
              <motion.label
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center justify-center w-16 h-16 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <CiImageOn className="w-14 h-14" />
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  ref={inputRef}
                />
              </motion.label>

              {/* Botão para apagar imagem (só aparece quando há uma imagem) */}
              {image && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-black lg:h-1/2 font-bold lg:w-1/4 lg:py-2 lg:px-4 rounded-full text-center p-3 font-poppins text-md border-2 cursor-pointer hover:bg-gray-100 hover:text-gray-900"
                  onClick={removeImage}
                >
                  Delete Image
                </motion.button>
              )}
            </motion.div>

            {/* Botão de enviar publicação */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={handleSubmitPublication}
              className="mt-5 text-center sm:p-2 lg:w-2/6 lg:p-3 rounded-lg lg:h-full border-2 font-poppins font-semibold text-xl cursor-pointer hover:bg-gray-100 hover:text-gray-900"
            >
              Enviar Publicação
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default NewPublicationBox;
