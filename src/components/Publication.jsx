import { FaTrashCan } from "react-icons/fa6";
import { AuthContext } from "./AuthContext.jsx";
import { FaPencilAlt } from "react-icons/fa";
import { IoCloseOutline } from "react-icons/io5";
import { IoSend } from "react-icons/io5";
import { CiImageOn } from "react-icons/ci";
import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { usePopUp } from "./PopUpContext.jsx";
import axios from "axios";

const fetchComments = async (publicationId) => {
  const { data } = await axios.get(
    `http://localhost:3000/publications/${publicationId}/comments`
  );
  return data.comments.reverse();
};

const addCommentMutationFn = async (commentData) => {
  const response = await axios.post(
    `http://localhost:3000/publications/${commentData.id}/comments`,
    commentData,
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

const deleteCommentMutationFn = async (data) => {
  console.log(data);
  const response = await axios.delete(
    `http://localhost:3000/publications/${data.publicationId}/comments/${data.commentId}`
  );

  return response.data;
};

const deletePublicationMutationFn = async (data) => {
  console.log(data);
  const response = await axios.delete(
    `http://localhost:3000/publications/${data.id}?owner=${data.owner._id}`
  );

  return response.data;
};

const editPublicationMutationFn = async ({ publicationId, formData }) => {
  console.log(publicationId);
  console.log(formData);
  const response = await axios.put(
    `http://localhost:3000/publications/${publicationId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

function Publication({
  id,
  isOwner,
  owner,
  date,
  title,
  description,
  image,
  key,
}) {
  const navigate = useNavigate();

  // Contexto do usuário
  const { user } = useContext(AuthContext);
  // Estado para mostrar ou não o botão de deletar publicação
  const { show, showPopUp, closePopUp, message, setPopUpMessage } = usePopUp();

  const newCommentLimit = 125;

  const inputRef = useRef(null);

  // Estado para armazenar novos comentários
  const [newComment, setNewComment] = useState("");

  // Estado sobre as edições feitas
  const [editedTitle, setEditedTitle] = useState(title); // Inicializa com o título original
  const [editedDescription, setEditedDescription] = useState(description); // Inicializa com a descrição original
  const [editedImage, setEditedImage] = useState(() => {
    if (image instanceof Blob) return image;
    return typeof image === "string" ? "EXISTING_IMAGE" : null;
  });

  // Estado para alterar a exibição do botão para um form
  const [edit, setEdit] = useState(false);

  const queryClient = useQueryClient();

  const {
    data: comments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["comments", id],
    queryFn: () => fetchComments(id),
    enabled: !!id,
  });

  const addCommentMutation = useMutation({
    mutationFn: addCommentMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });

      setNewComment("");
      setPopUpMessage("Comentário adicionado com sucesso!");
      showPopUp();
    },
    onError: (error) => {
      console.error("Erro ao adicionar o comentário:", error);
      setPopUpMessage("Erro ao adicionar comentário. Tente novamente.");
      showPopUp();
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: deleteCommentMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comments", id] });
      setPopUpMessage("Comentário deletado com sucesso!");
      showPopUp();
    },
    onError: (error) => {
      console.error("Erro ao deletar o comentário:", error);
      // setPopUpMessage("Erro ao deletar comentário. Tente novamente.");
      // showPopUp();
    },
  });

  const deletePublicationMutation = useMutation({
    mutationFn: deletePublicationMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publications"] });
      setPopUpMessage("Publicação deletada com sucesso!");
      showPopUp();
    },
    onError: (error) => {
      console.error("Erro ao deletar a publicação:", error);
      // setPopUpMessage("Erro ao deletar publicação. Tente novamente.");
      // showPopUp();
    },
  });

  const editPublicationMutation = useMutation({
    mutationFn: editPublicationMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["publications"] });

      setEdit(false);
      setPopUpMessage("Publicação editada com sucesso!");
      showPopUp();
    },
    onError: (error) => {
      console.error("Erro ao editar a publicação:", error);
      // setPopUpMessage("Erro ao editar publicação. Tente novamente.");
      // showPopUp();
    },
  });

  // Função para alterar a imagem
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
    // Verifica se houve alterações
    const hasChanges =
      editedTitle !== title ||
      editedDescription !== description ||
      editedImage !== "EXISTING_IMAGE";

    if (!hasChanges) {
      setPopUpMessage("Nenhuma alteração foi feita.");
      showPopUp();
      return; // Sai da função se não houver alterações
    }

    const formData = new FormData();

    formData.append("owner", owner._id);
    formData.append("title", editedTitle);
    formData.append("description", editedDescription);

    if (editedImage instanceof Blob) {
      formData.append("image", editedImage);
    } else if (editedImage === null) {
      formData.append("image", null);
    }

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

  const removeImage = () => {
    setEditedImage(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  if (typeof image == "string") image.replaceAll("\\", "/");

  // Função para renderizar os pop-ups
  const renderPopups = () => {
    if (!show) return null;

    return (
      <div
        className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50"
        id="comments-popup"
      >
        {message == "Comentário deletado com sucesso!" && (
          <div className="absolute flex flex-col items-center justify-center gap-2 bg-white border-2 p-10 rounded-lg scale-130 ">
            <p className="text-red-500 text-center font-poppins text-sm font-semibold">
              {message}
            </p>
            <button
              type="button"
              className="border-b-2 font-poppins text-sm hover:bg-gray-200 px-5 pt-1 rounded-lg transition-all"
              onClick={() => {
                setPopUpMessage("");
                closePopUp();
              }}
            >
              Ok
            </button>
          </div>
        )}

        {(message === "Publicação editada com sucesso!" ||
          message === "Comentário adicionado com sucesso!" ||
          message === "Publicação criada com sucesso!" ||
          message === "Preencha todos os campos!" ||
          message === "Publicação deletada com sucesso!") && (
          <div className="bg-white border-2 p-10 rounded-lg">
            <p className="text-red-500 text-center font-poppins text-xl font-semibold">
              {message}
            </p>
            <div className="flex justify-center gap-2 scale-130 mt-10">
              <button
                type="button"
                className="border-b-2 font-poppins text-sm hover:bg-red-200 px-5 pt-1 rounded-lg transition-all"
                onClick={() => {
                  setPopUpMessage("");
                  closePopUp();
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        )}

        {message ===
          "Deseja editar essa publicação? Essa ação não tem retorno." && (
          <div className="bg-white border-2 p-10 rounded-lg">
            <p className="text-red-500 text-center font-poppins text-xl font-semibold">
              {message}
            </p>
            <div className="flex justify-center gap-2 scale-130 mt-10">
              <button
                type="button"
                className="border-b-2 font-poppins text-sm hover:bg-gray-200 px-5 pt-1 rounded-lg transition-all"
                onClick={() => {
                  setPopUpMessage("");
                  closePopUp();
                }}
              >
                Cancelar
              </button>
              <button
                type="button"
                className="border-b-2 font-poppins text-sm hover:bg-red-200 px-5 pt-1 rounded-lg transition-all"
                onClick={() => {
                  setPopUpMessage("");
                  closePopUp();
                  console.log(editedTitle, editedDescription);
                  handleEditPublication();
                }}
              >
                Confirmar
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  useEffect(() => {
    setEditedTitle(title);
    setEditedDescription(description);
  }, [title, description]); // ← Dependências das props

  return (
    <>
      {!edit ? (
        <div className="flex items-center justify-center border-[2px] border-gray-200 m-10 mb-10 rounded-3xl">
          <div className={`w-9/10 min-h-[300px] rounded-lg my-5`}>
            {/* Conteúdo da publicação */}
            <button
              type="button"
              onClick={() => navigate(`/userPage/${owner._id}`)}
              className="m-5 mb-10 flex cursor-pointer gap-2"
            >
              <img
                src={
                  owner.image !=
                  "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                    ? `http://localhost:3000/${owner.image}`
                    : "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                }
                alt="Foto da pessoa"
                className={`w-12 h-12 rounded-full`}
              />
              <div className="flex flex-col">
                <h1 className="text-2xl text-start font-poppins font-medium">
                  {owner.name}
                </h1>
                <h2 className="text-sm text-gray-600 font-poppins">
                  {new Date(date).toLocaleString("pt-BR")}
                </h2>
              </div>
            </button>
            <div className="m-5 overflow-y-auto scrollbar-hide">
              <h1 className="text-2xl mb-3 font-funnel-sans">{title}</h1>
              <h2 className="text-base text-gray-800 mb-5 font-funnel-sans">
                {description}
              </h2>
              <div className="flex justify-start">
                <img
                  className={`max-h-2/4 mb-5 rounded-lg ${
                    image == null && "hidden"
                  }  `}
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
                  className="font-bold py-2 px-4 rounded-full bg-white border-2 cursor-pointer hover:scale-103 hover:bg-black hover:text-white hover:border-2 transition-all"
                  onClick={() => {
                    handleDeletePublication(id, owner);
                  }}
                >
                  <FaTrashCan className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  className="font-bold py-2 px-4 rounded-full bg-white border-2 cursor-pointer hover:scale-103 hover:bg-black hover:text-white hover:border-2 transition-all"
                  onClick={() => {
                    setEdit(true);
                    setEditedTitle(title); // ← Atualiza com valor atual
                    setEditedDescription(description); // ← Atualiza com valor atual
                  }}
                >
                  <FaPencilAlt className="w-5 h-5" />
                </button>
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
                            ? "http://localhost:3000/" + user.image
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
                        className="border-2 border-gray-200 w-full overflow-y-auto min-h-[50px] rounded-sm min-w-[500px] p-1 font-poppins"
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

              {comments &&
                comments[0] != undefined &&
                comments.map((element, index) => {
                  return (
                    <div key={index} className="p-2 rounded-sm mb-3">
                      <div className="mb-1 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() =>
                            navigate(`/userPage/${element.owner._id}`)
                          }
                          className="flex cursor-pointer"
                        >
                          <img
                            src={
                              element.owner.image !=
                              "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                                ? `http://localhost:3000/${element.owner.image}`
                                : "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                            }
                            alt="Foto da pessoa"
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="flex flex-col pl-2">
                            <h1 className="font-poppins font-medium text-start">
                              {element.owner.name}
                            </h1>
                            <p className="text-start w-[450px] break-words">
                              {element.comment}
                            </p>
                          </div>
                        </button>
                        {user && user.name == element.owner.name && (
                          <button
                            className="cursor-pointer w-10 h-full flex justify-end"
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
        </div>
      ) : (
        edit && (
          <div
            className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-49"
            id="edit-post-modal"
          >
            {console.log(
              id,
              isOwner,
              owner,
              date,
              title,
              description,
              image,
              key
            )}
            <div
              className={`min-h-[600px] rounded-lg my-5 bg-white flex flex-col w-6/10`}
            >
              {/* Conteúdo do formulário de edição */}
              <div className="m-5 mb-10 flex items-center gap-2">
                <img
                  src={
                    owner.image !=
                    "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                      ? `http://localhost:3000/${owner.image}`
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
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                />

                <textarea
                  className="text-base text-gray-800 w-full font-funnel-sans mb-5 overflow-y-scroll scrollbar-hide h-[200px] p-2 border-1 border-gray-500 rounded-lg"
                  placeholder="Conteúdo da publicação"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                />

                {/* Exibe a imagem selecionada */}
                {editedImage && (
                  <img
                    className={`rounded-lg max-h-60 w-auto mx-auto object-contain`}
                    src={
                      editedImage instanceof Blob
                        ? URL.createObjectURL(editedImage)
                        : editedImage === "EXISTING_IMAGE"
                        ? `http://localhost:3000/${image}`
                        : null
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
                        ref={inputRef}
                      />
                    </label>
                  )}

                  {/* Botão para apagar imagem */}
                  {editedImage && (
                    <button
                      type="button"
                      className="text-black h-1/2 font-bold border-2 w-1/4 py-2 px-4 rounded-full cursor-pointer"
                      onClick={removeImage}
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
                    className="font-bold py-2 px-4 rounded-full bg-white border-2 cursor-pointer hover:scale-103 hover:bg-black hover:text-white hover:border-2 transition-all"
                    onClick={() => {
                      handleEditPublication();
                      // setPopUpMessage(
                      //   "Deseja editar essa publicação? Essa ação não tem retorno."
                      // );
                      // showPopUp();
                    }}
                  >
                    <IoSend className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      )}

      {/* Renderização dos pop-ups */}
      {renderPopups()}
    </>
  );
}

export default Publication;
