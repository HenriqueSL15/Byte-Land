import React, { useContext, useEffect, useState, useRef } from "react";
import LeftPart from "./LeftPart.jsx";
import RightPart from "./RightPart.jsx";
import axios from "axios";
import Publication from "./Publication.jsx";
import { CiImageOn } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { AuthContext } from "./AuthContext.jsx";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

import { useNavigate } from "react-router-dom";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import LoadingScreen from "./LoadingScreen.jsx";

const fetchFriendsFn = async (userId) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/users/${userId}/friends`
    );

    return response.data.friends;
  } catch (error) {
    console.error(error);
  }
};

async function getUserDataFn(userId) {
  const response = await axios.get(
    `http://localhost:3000/users/${userId}/publications`
  );

  return response.data;
}

async function updateUserDataMutationFn({ userId, formData }) {
  const response = await axios.put(
    `http://localhost:3000/users/${userId}/userPage`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

function UserPage() {
  const { userId } = useParams();
  const { user, login, isLoading: isLoadingUser } = useContext(AuthContext);

  const navigate = useNavigate();

  if (!user && !isLoadingUser) navigate("/login");

  const [editInfo, setEditInfo] = useState(false);

  const fileInputRef = React.useRef(null);

  const [isFriend, setIsFriend] = useState(false);

  const [editedImage, setEditedImage] = useState(null);
  const [editedDescription, setEditedDescription] = useState(null);

  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userPageData", userId],
    queryFn: () => getUserDataFn(userId),
    enabled: !!userId,
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUserDataMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["userPageData", userId]);

      login(userData.user);
      setEditedDescription("");
      setEditedImage(null);
      setEditInfo(false);
      toast.success("Informações editadas com sucesso!");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Erro ao editar informações! Tente novamente");
    },
  });

  const handleDeleteImage = () => {
    setEditedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reseta o valor do input
    }
  };

  async function addNotificationToOwner(userId, notificationOwner, message) {
    const notificationData = {
      message,
      owner: notificationOwner,
    };

    const response = await axios.post(
      `http://localhost:3000/users/${userId}/notifications`,
      notificationData
    );

    queryClient.invalidateQueries({
      queryKey: ["notifications", userId],
    });

    return response.data;
  }

  // Função para alterar a imagem
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setEditedImage(file);
    }
  };

  async function handleSaveChanges() {
    const formData = new FormData();

    formData.append("image", editedImage);

    if (editedDescription) formData.append("description", editedDescription);

    if (!editedDescription && !editedImage) {
      return toast.info("Nenhuma alteração foi feita.");
    }

    updateUserMutation.mutate({
      userId: userData.user._id,
      formData: formData,
    });
  }

  const handleSendFriendRequest = async (userId, friendId) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/users/${userId}/friends/${friendId}`
      );
      toast.success("Solicitação enviada com sucesso!");
      addNotificationToOwner(
        friendId,
        userId,
        "Enviou uma solicitação de amizade para você!"
      );

      return response.data;
    } catch (error) {
      console.error(error);
      toast.error("Erro ao enviar solicitação de amizade");
    }
  };

  const handleRemoveFriend = async (userId, friendId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/users/${userId}/friends/${friendId}`
      );
      toast.success("Amizade desfeita com sucesso!");
      addNotificationToOwner(friendId, userId, "Desfez sua amizade");
      if (response.status === 200) {
        queryClient.invalidateQueries(["allFriends", user._id]);
      }
      return response.data;
    } catch (error) {
      console.error(error);
      toast.error("Erro ao desfazer amizade");
    }
  };

  const {
    data: allFriends,
    isLoadingFriends,
    isError,
  } = useQuery({
    queryKey: ["allFriends", user?._id],
    queryFn: () => fetchFriendsFn(user._id),
    enabled: !!user,
  });

  useEffect(() => {
    if (!isLoadingFriends && allFriends) {
      setIsFriend(
        allFriends.some(
          (friend) => friend.user._id === userId && friend.status === "accepted"
        )
      );
    }
  }, [isLoadingFriends, allFriends, userId]);

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="flex flex-row h-screen"
    >
      <div className="w-3/12">
        <LeftPart />
      </div>
      <div className="w-6/12 border-x-2 border-gray-300 overflow-y-scroll scrollbar-hide relative">
        <div className="h-screen w-full p-5 flex flex-col gap-36 ">
          <div className="relative pb-14">
            <div className="absolute bg-white bottom-0 left-3 h-32 w-32 rounded-full z-48 border-3 border-white shadow-md overflow-hidden">
              <motion.img
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.15 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                src={
                  userData.user.image !=
                  "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                    ? `http://localhost:3000/${userData.user.image}`
                    : "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                }
                className="h-full w-full object-cover"
                alt="Imagem do Usuário"
              />
            </div>
            <img
              src={
                userData.user.userPageImage !=
                "https://www.solidbackgrounds.com/images/1920x1080/1920x1080-black-solid-color-background.jpg"
                  ? `http://localhost:3000/${userData.user.userPageImage}`
                  : "https://www.solidbackgrounds.com/images/1920x1080/1920x1080-black-solid-color-background.jpg"
              }
              alt="Imagem do Perfil do Usuário"
              className="rounded-lg w-full h-72 z-40"
            />
            <div className="absolute left-36 top-[87%] min-w-[590px] max-w-[650px] flex justify-between items-center">
              <div className="flex flex-col w-[75%]">
                <h1 className="font-funnel-sans text-2xl mb-1">
                  {userData.user ? userData.user.name : "Não possui nome"}
                </h1>

                <p className="font-funnel-sans text-lg text-[#979797]">
                  {userData.user
                    ? userData.user.userPageDescription
                    : "Não possui descrição"}
                </p>
              </div>
              {userData?.user._id === user?._id ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="border-2 border-black cursor-pointer font-montserrat font-semibold hover:bg-black hover:text-white transition-all hover:scale-105 transform rounded-full w-40 h-12"
                  onClick={() => {
                    setEditInfo(true);
                  }}
                >
                  Editar Perfil
                </motion.button>
              ) : !isFriend ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="border-2 border-black cursor-pointer font-montserrat font-semibold hover:bg-black hover:text-white transition-all hover:scale-105 transform rounded-full w-40 h-12"
                  onClick={() => handleSendFriendRequest(user._id, userId)}
                >
                  Adicionar Amigo
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  className="border-2 border-black cursor-pointer font-montserrat font-semibold hover:bg-black hover:text-white transition-all hover:scale-105 transform rounded-full w-40 h-12"
                  onClick={() => handleRemoveFriend(user._id, userId)}
                >
                  Desfazer Amizade
                </motion.button>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-normal ml-10">Posts</h1>
            <div>
              {userData.posts &&
                userData.posts.length > 0 &&
                userData.posts.map((element, index) => {
                  return (
                    <Publication
                      id={element._id}
                      isOwner={userData.user._id === user._id}
                      key={element._id}
                      owner={element.owner}
                      title={element.title}
                      description={element.description}
                      image={element.image}
                      date={element.createdAt}
                    />
                  );
                })}
            </div>
          </div>
        </div>
        <AnimatePresence>
          {editInfo && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                ease: "easeInOut",
                duration: 0.2,
                type: "tween",
              }}
              className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{
                  ease: "easeInOut",
                  duration: 0.2,
                  type: "tween",
                }}
                className="bg-white p-6 w-1/2 min-h-5/6 rounded-lg border-1 border-black relative"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="absolute right-4 w-14 h-14 cursor-pointer transform hover:scale-110 transition-all"
                  onClick={() => setEditInfo(false)}
                >
                  <IoCloseOutline className="h-full w-full" />
                </motion.button>
                <motion.h1
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.2,
                    ease: "easeInOut",
                    delay: 0.1,
                  }}
                  className="text-3xl font-semibold font-montserrat mt-3 text-center"
                >
                  Editar informações do perfil
                </motion.h1>
                <div className="flex flex-col gap-3 mt-10">
                  <h2 className="text-lg font-poppins">Descrição</h2>
                  <textarea
                    className="bg-[#f2f2f2] font-funnel-sans placeholder-[#979797] rounded-sm min-h-32 p-2 w-full border-1 border-[#979797]"
                    placeholder="Escreva sua nova descrição"
                    onChange={(e) => setEditedDescription(e.target.value)}
                    value={editedDescription}
                  ></textarea>
                </div>
                <div className="flex flex-col gap-3 mt-10">
                  <h2 className="text-lg font-poppins">Imagem de Fundo</h2>
                  <div className="flex flex-col gap-3 items-center">
                    <motion.label
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[#f2f2f2] w-full min-h-44 border-1 border-[#979797] rounded-sm cursor-pointer flex items-center justify-center"
                    >
                      {!editedImage ? (
                        <CiImageOn className="w-full h-32" />
                      ) : (
                        <img
                          src={URL.createObjectURL(editedImage)}
                          alt="Imagem selecionada"
                          className="min-h-36 max-h-36 w-auto rounded-md"
                          value={editedImage}
                        />
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                        ref={fileInputRef}
                      />
                    </motion.label>
                    {editedImage && (
                      <button
                        onClick={handleDeleteImage}
                        className="transform border-1 border-black bg-white w-1/3 rounded-lg p-1 hover:text-red-500 hover:border-red-500 hover:scale-101  transition-all cursor-pointer"
                      >
                        Remover Imagem
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleSaveChanges()}
                    className="hover:scale-101 transform transition-all bg-black text-white font-bold p-3 rounded-full cursor-pointer"
                  >
                    Salvar
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="w-3/12">
        <RightPart />
      </div>
    </motion.div>
  );
}

export default UserPage;
