// Importações de ícones e componentes
import { FaTrashCan } from "react-icons/fa6";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { FaPencilAlt } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
// Hooks do React
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../common/LoadingScreen.jsx";
import { toast } from "sonner"; // Biblioteca para notificações toast
// Hooks do React Query para gerenciamento de estado e requisições
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// Biblioteca para animações
import { motion, AnimatePresence } from "framer-motion";
// Cliente HTTP
import axios from "axios";

// Função para buscar comentários de uma publicação
const fetchComments = async (publicationId) => {
  const { data } = await axios.get(
    `https://byte-land-backend.onrender.com/publications/${publicationId}/comments`
  );
  return data.comments.reverse(); // Inverte a ordem para mostrar os mais recentes primeiro
};

// Função para adicionar um comentário a uma publicação
const addCommentMutationFn = async (commentData) => {
  const response = await axios.post(
    `https://byte-land-backend.onrender.com/publications/${commentData.id}/comments`,
    commentData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

// Função para deletar um comentário
const deleteCommentMutationFn = async (data) => {
  console.log(data);
  const response = await axios.delete(
    `https://byte-land-backend.onrender.com/publications/${data.publicationId}/comments/${data.commentId}`
  );

  return response.data;
};

// Função para deletar uma publicação
const deletePublicationMutationFn = async (data) => {
  console.log(data);
  const response = await axios.delete(
    `https://byte-land-backend.onrender.com/publications/${data.id}?owner=${data.owner._id}`
  );

  return response.data;
};

// Função para editar uma publicação
const editPublicationMutationFn = async ({ publicationId, formData }) => {
  console.log(publicationId);
  console.log(formData);
  const response = await axios.put(
    `https://byte-land-backend.onrender.com/publications/${publicationId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data", // Necessário para envio de arquivos
      },
    }
  );

  return response.data;
};

// Componente principal de Publicação
function Publication({ id, isOwner, owner, date, title, description, image }) {
  const navigate = useNavigate();

  // Obtém dados do usuário logado do contexto de autenticação
  const { user } = useContext(AuthContext);

  // Limite de caracteres para comentários
  const newCommentLimit = 125;

  // Referência para o input de imagem
  const inputRef = useRef(null);

  // Estado para armazenar novos comentários
  const [newComment, setNewComment] = useState("");

  // Estados para gerenciar edições na publicação
  const [editedTitle, setEditedTitle] = useState(title); // Inicializa com o título original
  const [editedDescription, setEditedDescription] = useState(description); // Inicializa com a descrição original
  const [editedImage, setEditedImage] = useState(() => {
    if (image instanceof Blob) return image;
    return typeof image === "string" ? "EXISTING_IMAGE" : null;
  });

  // Estado para controlar o modo de edição
  const [edit, setEdit] = useState(false);

  // Limites de caracteres para título e descrição
  const titleLimit = 100;
  const descriptionLimit = 500;

  // Cliente de consulta do React Query
  const queryClient = useQueryClient();

  // Consulta para buscar comentários
  const {
    data: comments,
    isLoadingComments,
    error,
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => fetchComments(id),
    enabled: !!id, // Só executa se houver um ID válido
  });

  // Mutação para adicionar comentários
  const addCommentMutation = useMutation({
    mutationFn: addCommentMutationFn,
    onSuccess: () => {
      // Invalida a consulta de comentários para forçar uma nova busca
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      queryClient.invalidateQueries(["userPageData", owner._id]);

      // Limpa o campo de comentário
      setNewComment("");

      // Exibe notificação de sucesso
      toast.success("Comentário adicionado com sucesso!");

      // Adiciona notificação para o dono da publicação (se não for o próprio usuário)
      if (owner._id !== user._id) {
        addNotificationToOwner(
          owner._id,
          user._id,
          "Adicionou um comentário na sua publicação de nome: " + title
        );
      }
    },
    onError: (error) => {
      console.error("Erro ao adicionar o comentário:", error);
      toast.error("Erro ao adicionar comentário. Tente novamente.");
    },
  });

  // Mutação para deletar comentários
  const deleteCommentMutation = useMutation({
    mutationFn: deleteCommentMutationFn,
    onSuccess: () => {
      // Invalida a consulta de comentários para forçar uma nova busca
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      queryClient.invalidateQueries(["userPageData", owner._id]);
      toast.success("Comentário deletado com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao deletar o comentário:", error);
      toast.error("Erro ao deletar comentário. Tente novamente.");
    },
  });

  // Mutação para deletar publicações
  const deletePublicationMutation = useMutation({
    mutationFn: deletePublicationMutationFn,
    onSuccess: () => {
      // Invalida consultas relacionadas para atualizar a UI
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      queryClient.invalidateQueries(["userPageData", owner._id]);
      toast.success("Publicação deletada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao deletar a publicação:", error);
      toast.error("Erro ao deletar publicação. Tente novamente.");
    },
  });

  // Função para adicionar notificação ao dono da publicação
  async function addNotificationToOwner(
    publicationOwner,
    notificationOwner,
    message
  ) {
    const notificationData = {
      message,
      owner: notificationOwner,
    };

    const response = await axios.post(
      `https://byte-land-backend.onrender.com/users/${publicationOwner}/notifications`,
      notificationData
    );

    // Invalida a consulta de notificações para atualizar a UI
    queryClient.invalidateQueries({
      queryKey: ["notifications", publicationOwner],
    });

    return response.data;
  }

  // Mutação para editar publicações
  const editPublicationMutation = useMutation({
    mutationFn: editPublicationMutationFn,
    onSuccess: () => {
      // Invalida a consulta de publicações para forçar uma nova busca
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      queryClient.invalidateQueries(["userPageData", owner._id]);

      // Sai do modo de edição
      setEdit(false);
      toast.success("Publicação editada com sucesso!");
    },
    onError: (error) => {
      console.error("Erro ao editar a publicação:", error);
      toast.error("Erro ao editar a publicação. Tente novamente");
    },
  });

  // Função para alterar a imagem da publicação
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setEditedImage(file);
    }
  };

  // Função para deletar a publicação
  const handleDeletePublication = async (id, owner) => {
    const data = {
      id: id,
      owner: owner,
    };

    deletePublicationMutation.mutate(data);
  };

  // Função para editar a publicação
  async function handleEditPublication() {
    // Verifica se houve alterações antes de enviar
    const hasChanges =
      editedTitle !== title ||
      editedDescription !== description ||
      editedImage !== "EXISTING_IMAGE";

    if (!hasChanges) {
      toast.info("Nenhuma alteração foi feita.");
      return; // Sai da função se não houver alterações
    }

    // Prepara os dados para envio
    const formData = new FormData();
    formData.append("owner", owner._id);
    formData.append("title", editedTitle);
    formData.append("description", editedDescription);

    // Trata a imagem de acordo com o estado
    if (editedImage instanceof Blob) {
      formData.append("image", editedImage);
    } else if (editedImage === null) {
      formData.append("image", null);
    }

    // Executa a mutação de edição
    editPublicationMutation.mutate({ publicationId: id, formData: formData });
  }

  // Função para deletar um comentário
  async function deleteComment(publicationId, commentId) {
    const data = {
      publicationId: publicationId,
      commentId: commentId,
    };

    deleteCommentMutation.mutate(data);
  }

  // Função para adicionar um comentário em uma publicação
  async function addComment(userId, publicationId, comment) {
    const commentData = {
      user: userId,
      id: publicationId,
      comment: comment,
    };

    addCommentMutation.mutate(commentData);
  }

  // Função para remover a imagem da publicação durante edição
  const removeImage = () => {
    setEditedImage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  // Normaliza caminhos de imagem substituindo barras invertidas
  if (typeof image == "string") image.replaceAll("\\", "/");

  // Atualiza os estados de edição quando as props mudam
  useEffect(() => {
    setEditedTitle(title);
    setEditedDescription(description);
  }, [title, description]); // ← Dependências das props

  // Exibe tela de carregamento enquanto os comentários estão sendo buscados
  if (isLoadingComments) {
    return <LoadingScreen />;
  }

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 0.3,
            ease: "easeInOut",
          }}
          key="publication"
          className="flex items-center justify-center border-[2px] border-gray-200 m-10 mb-10 rounded-3xl"
        >
          <div className={`w-9/10 min-h-[300px] rounded-lg my-5`}>
            {/* Conteúdo da publicação */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="button"
              onClick={() => navigate(`/userPage/${owner._id}`)}
              className="m-5 mb-10 flex cursor-pointer gap-2"
            >
              <img
                src={
                  owner.image !=
                  "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                    ? `https://byte-land-backend.onrender.com/${owner.image}`
                    : "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                }
                alt="Foto da pessoa"
                className={`w-12 h-12 rounded-full`}
              />
              <div className="flex flex-col">
                <h1 className="text-2xl text-start font-poppins font-medium">
                  {owner.name}
                </h1>
                <h2 className="md:text-sm text-gray-600 font-poppins">
                  {new Date(date).toLocaleString("pt-BR")}
                </h2>
              </div>
            </motion.button>
            <div className="m-5 overflow-y-auto scrollbar-hide">
              <h1 className="text-2xl mb-3 font-funnel-sans">{title}</h1>
              <h2 className="text-base text-gray-800 font-funnel-sans">
                {description}
              </h2>
              {console.log(image)}
              <div className="flex justify-start">
                <img
                  className={`max-h-2/4 my-5 rounded-lg ${
                    image == null && "hidden"
                  }  `}
                  src={
                    typeof image == "string"
                      ? "https://byte-land-backend.onrender.com/" + image
                      : "No Image"
                  }
                  alt="Foto da publicação"
                />
              </div>
            </div>
            {/* Botão de deletar publicação */}
            {isOwner && (
              <div className="flex justify-start px-5 items-center gap-2 mb-5 h-[20px]">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="font-bold py-2 px-4 rounded-full bg-white border-2 cursor-pointer hover:scale-103 hover:bg-black hover:text-white hover:border-2 transition-all"
                  onClick={() => {
                    handleDeletePublication(id, owner);
                  }}
                >
                  <FaTrashCan className="w-5 h-5" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="font-bold py-2 px-4 rounded-full bg-white border-2 cursor-pointer hover:scale-103 hover:bg-black hover:text-white hover:border-2 transition-all"
                  onClick={() => {
                    setEdit(true);
                    setEditedTitle(title);
                    setEditedDescription(description);
                  }}
                >
                  <FaPencilAlt className="w-5 h-5" />
                </motion.button>
              </div>
            )}
            <div className="px-5 w-full h-0.5 flex mt-10">
              <h1 className="w-full h-full bg-gray-300 rounded-full mx-auto"></h1>
            </div>
            {/* Seção dos comentários */}
            <div className="px-5 mt-10 gap-10 w-full">
              <h1 className="mb-2 text-xl font-semibold font-montserrat">
                Comments:
              </h1>
              <div className="py-2 rounded-sm mb-5 w-full">
                {user && (
                  <div>
                    <div className="mb-3 flex items-center gap-2">
                      <img
                        src={
                          user.image !=
                          "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                            ? "https://byte-land-backend.onrender.com/" +
                              user.image
                            : "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                        }
                        alt="Foto da pessoa"
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex flex-col">
                        <h1 className="font-poppins font-medium">
                          {user.name}
                        </h1>
                      </div>
                    </div>
                    <div className="relative w-full">
                      <textarea
                        placeholder="Escreva seu comentário"
                        className="sm:text-sm lg:text-xl border-2 border-gray-200 w-full overflow-y-auto min-h-[50px] rounded-sm p-1 font-poppins"
                        onChange={(e) => {
                          if (e.target.value.length <= newCommentLimit) {
                            setNewComment(e.target.value);
                          }
                        }}
                        value={newComment}
                      />
                      <h2
                        className={`text-[15px] select-none absolute right-2 bottom-17 ${
                          newComment.length == newCommentLimit && "text-red-500"
                        } `}
                      >
                        {newComment.length}/{newCommentLimit}
                      </h2>
                    </div>
                    <button
                      className="w-full h-10 cursor-pointer bg-white text-black border-2 border-black rounded-sm font-montserrat font-semibold hover:bg-black hover:text-white transition-all"
                      onClick={() => addComment(user._id, id, newComment)}
                    >
                      Enviar Comentário
                    </button>
                  </div>
                )}
              </div>

              {Array.isArray(comments) &&
                comments.map((element, index) => {
                  return (
                    <div key={index} className="p-2 rounded-sm mb-3">
                      <div className="mb-1 flex items-start w-full">
                        <img
                          src={
                            element.owner &&
                            element.owner.image !==
                              "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                              ? `https://byte-land-backend.onrender.com/${element.owner.image}`
                              : "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                          }
                          alt="Foto da pessoa"
                          className="w-10 h-10 rounded-full flex-shrink-0"
                          onClick={() =>
                            navigate(`/userPage/${element.owner?._id}`)
                          }
                          style={{ cursor: "pointer" }}
                        />
                        <div className="flex flex-col pl-2 flex-grow overflow-hidden">
                          <h1
                            className="font-poppins font-medium text-start cursor-pointer"
                            onClick={() =>
                              navigate(`/userPage/${element.owner?._id}`)
                            }
                          >
                            {element.owner
                              ? element.owner.name
                              : "Unknown User"}
                          </h1>
                          <p className="text-start w-full break-words text-sm whitespace-normal">
                            {element.comment}
                          </p>
                        </div>
                        {user &&
                          element.owner &&
                          user.name == element.owner.name && (
                            <button
                              className="cursor-pointer flex-shrink-0 ml-auto"
                              onClick={() => deleteComment(id, element._id)}
                            >
                              <IoCloseOutline className="w-10 h-10" />
                            </button>
                          )}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        </motion.div>

        {edit && (
          <motion.div
            key="edit-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.2,
              ease: "easeOut",
            }}
            className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-49"
            id="edit-post-modal"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              key="edit-modal-content"
              transition={{
                duration: 0.2,
                ease: "easeOut",
              }}
              className={`min-h-[600px] rounded-lg my-5 bg-white flex flex-col w-6/10`}
            >
              {/* Conteúdo do formulário de edição */}
              <div className="m-5 mb-10 flex items-center gap-2">
                <img
                  src={
                    owner.image !=
                    "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                      ? `https://byte-land-backend.onrender.com/${owner.image}`
                      : "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                  }
                  alt="Foto da pessoa"
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex flex-col">
                  <h1 className="text-2xl font-poppins font-medium">
                    {owner.name}
                  </h1>
                  <h2 className="text-sm text-gray-600 font-poppins">
                    {new Date(date).toLocaleString("pt-BR")}
                  </h2>
                </div>
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  whileHover={{ scale: 1.1 }}
                  className="h-15 w-15 flex justify-center items-center gap-2 ml-auto"
                >
                  <button
                    className="cursor-pointer w-full h-full"
                    onClick={() => setEdit(false)}
                  >
                    <IoCloseOutline className="w-full h-full" />
                  </button>
                </motion.div>
              </div>
              <div className="m-5 scrollbar-hide">
                <div className="relative w-full">
                  <input
                    type="text"
                    className="text-2xl mb-3 px-2 pt-2 pb-0 border-b-1 w-full font-montserrat focus:outline-none focus:border-b-2"
                    placeholder="Título da publicação"
                    value={editedTitle}
                    onChange={(e) => {
                      if (e.target.value.length <= titleLimit) {
                        setEditedTitle(e.target.value);
                      }
                    }}
                  />
                  <h2
                    className={`text-[15px] select-none absolute right-1 bottom-11 ${
                      editedTitle.length == titleLimit && "text-red-500"
                    } `}
                  >
                    {editedTitle.length}/{titleLimit}
                  </h2>
                </div>
                <div className="relative w-full">
                  <textarea
                    className="text-base text-gray-800 w-full font-funnel-sans mb-1 overflow-y-scroll scrollbar-hide h-[200px] p-2 border-1 border-gray-500 rounded-lg"
                    placeholder="Conteúdo da publicação"
                    value={editedDescription}
                    onChange={(e) => {
                      if (e.target.value.length <= descriptionLimit) {
                        setEditedDescription(e.target.value);
                      }
                    }}
                  />
                  <h2
                    className={`text-[15px] select-none absolute right-2 bottom-7   ${
                      editedDescription.length == descriptionLimit &&
                      "text-red-500"
                    } `}
                  >
                    {editedDescription.length}/{descriptionLimit}
                  </h2>
                </div>

                {/* Exibe a imagem selecionada */}
                <AnimatePresence>
                  {editedImage && (
                    <motion.img
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{
                        duration: 0.2,
                        ease: "easeInOut",
                      }}
                      className={`rounded-lg max-h-60 w-auto mx-auto object-contain`}
                      src={
                        editedImage instanceof Blob
                          ? URL.createObjectURL(editedImage)
                          : editedImage === "EXISTING_IMAGE"
                          ? `https://byte-land-backend.onrender.com/${image}`
                          : null
                      }
                      alt="Foto da publicação"
                    />
                  )}
                </AnimatePresence>

                <div className="flex items-center justify-between">
                  {/* Botão para selecionar imagem */}
                  {!editedImage && (
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
                  )}

                  {/* Botão para apagar imagem */}
                  <div className="w-full flex justify-center mt-1">
                    {editedImage && (
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="text-black h-1/2 font-bold border-2 w-1/4 py-2 px-4 rounded-full cursor-pointer "
                        onClick={removeImage}
                      >
                        Delete Image
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>

              {/* Botão de editar publicação */}
              {isOwner && (
                <div className="flex justify-start px-5 items-center gap-2 mb-4 h-[20px]">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    className="font-bold py-2 px-4 rounded-full z-50 bg-white border-2 cursor-pointer hover:bg-black hover:text-white hover:border-2 transition-all"
                    onClick={() => {
                      handleEditPublication();
                    }}
                  >
                    <IoSend className="w-5 h-5" />
                  </motion.button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Publication;
