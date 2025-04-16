import { queryClient } from "../../main.jsx";
import { useFriends } from "../../contexts/FriendsContext.jsx";
import { useMessages } from "../../contexts/MessagesContext.jsx";
import { IoCloseOutline } from "react-icons/io5";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

// Função para buscar a lista de amigos do usuário da API
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

function Friends() {
  const { setShowFriends } = useFriends();
  const { setShowMessages, setSelectedFriend } = useMessages();
  const { user } = useContext(AuthContext);
  const [pendingFriendRequests, setPendingFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

  // Função para adicionar notificações ao usuário
  async function addNotificationToOwner(userId, notificationOwner, message) {
    const notificationData = {
      message,
      owner: notificationOwner,
    };

    const response = await axios.post(
      `http://localhost:3000/users/${userId}/notifications`,
      notificationData
    );

    // Invalida a query de notificações para atualizar a UI
    queryClient.invalidateQueries({
      queryKey: ["notifications", userId],
    });

    return response.data;
  }

  // Busca a lista de amigos usando React Query
  const {
    data: allFriends,
    isLoadingFriends,
    isError,
  } = useQuery({
    queryKey: ["allFriends", user._id],
    queryFn: () => fetchFriendsFn(user._id),
    enabled: !!user,
  });

  // Separa amigos em pendentes e aceitos quando os dados são carregados
  useEffect(() => {
    if (allFriends) {
      const pending = allFriends.filter(
        (friend) => friend.sender !== user._id && friend.status === "pending"
      );

      const accepted = allFriends.filter(
        (friend) => friend.status === "accepted"
      );

      setPendingFriendRequests(pending);
      setFriends(accepted);
    }
  }, [allFriends, user._id]);

  // Gerencia a aceitação ou rejeição de solicitações de amizade
  const handleFriendRequestOption = async (userId, friendId, status) => {
    try {
      // Atualiza o estado local antes da resposta da API para UI responsiva
      if (status === "accepted") {
        if (allFriends) {
          const acceptedFriend = pendingFriendRequests.find(
            (friend) => friend.sender === friendId
          );

          if (acceptedFriend) {
            setPendingFriendRequests((prev) =>
              prev.filter((friend) => friend.sender !== friendId)
            );

            const updatedFriend = { ...acceptedFriend, status: "accepted" };
            setFriends((prev) => [...prev, updatedFriend]);
          }
        }
      } else if (status === "rejected") {
        setPendingFriendRequests((prev) => {
          prev.filter((friend) => friend.sender !== friendId);
        });
      }

      // Envia a atualização para a API
      const response = await axios.patch(
        `http://localhost:3000/users/${userId}/friends/${friendId}`,
        {
          status: status,
        }
      );

      // Adiciona notificação e exibe toast baseado na ação
      if (status === "accepted") {
        addNotificationToOwner(friendId, userId, "Negou seu pedido de amizade");
        toast.success("Pedido de amizade aceito!");
      } else if (status === "rejected") {
        addNotificationToOwner(
          friendId,
          userId,
          "Aceitou seu pedido de amizade"
        );
        toast.success("Pedido de amizade negado!");
      }

      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  // Abre o chat com um amigo selecionado
  const handleOpenChat = (friend) => {
    setShowFriends(false);
    setSelectedFriend(friend);
    setShowMessages(true);
  };

  return (
    // Modal de fundo com animação
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setShowFriends(false);
        }
      }}
      className="w-full h-screen bg-black/50 absolute z-50 left-0 top-0 flex justify-center items-center"
    >
      {/* Container principal do modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{
          duration: 0.2,
          ease: "easeInOut",
        }}
        className="bg-white w-2/4 h-5/6 rounded-lg relative"
      >
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-funnel-sans p-5"
        >
          Amigos
        </motion.h1>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="absolute cursor-pointer w-14 h-14 right-3 top-2"
        >
          <IoCloseOutline
            className="w-full h-full hover:scale-110 transform transition-all"
            onClick={() => setShowFriends(false)}
          />
        </motion.button>
        <div className="flex flex-col gap-5 p-5">
          {/* Seção de solicitações pendentes */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
                delay: 0.1,
              }}
              className="text-xl font-semibold font-montserrat"
            >
              Pendentes (
              {pendingFriendRequests ? pendingFriendRequests.length : 0})
            </motion.h2>
            <div>
              {pendingFriendRequests?.map((friend, index) => (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.3 + index * 0.1,
                    }}
                    key={index}
                    className="w-full min-h-16 flex flex-col"
                  >
                    <div className="w-full min-h-1 rounded-full bg-gray-100"></div>
                    <div className="flex bg-white my-3 relative">
                      <button className="cursor-pointer w-20 h-full hover:scale-105 transform transition-all">
                        <img
                          src={
                            friend.user.image ==
                            "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                              ? "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                              : `http://localhost:3000/${friend.user.image}`
                          }
                          alt="Foto do dono da notificação"
                          className="w-15 h-15 rounded-full"
                        />
                      </button>
                      <div className="flex flex-col gap-1">
                        <h1 className="text-start text-lg font-semibold font-montserrat">
                          {friend.user.name}
                        </h1>
                        <p className="text-start text-lg">
                          {friend.user.userPageDescription}
                        </p>
                      </div>
                      {/* Botões para aceitar ou recusar solicitação */}
                      <div className="flex gap-2 justify-end absolute right-0">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="border-2 px-5 py-3 font-montserrat font-bold rounded-lg cursor-pointer hover:bg-gray-200 text-xl"
                          onClick={() =>
                            handleFriendRequestOption(
                              user._id,
                              friend.sender,
                              "accepted"
                            )
                          }
                        >
                          Aceitar
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleFriendRequestOption(
                              user._id,
                              friend.sender,
                              "rejected"
                            )
                          }
                          className="border-2 px-5 py-3 font-montserrat font-bold rounded-lg cursor-pointer hover:bg-gray-200 text-xl"
                        >
                          Recusar
                        </motion.button>
                      </div>
                    </div>
                  </motion.div>
                </>
              ))}
            </div>
          </div>
          {/* Seção de amigos aceitos */}
          <div>
            <motion.h2
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                ease: "easeInOut",
                delay: 0.2,
              }}
              className="text-xl font-semibold font-montserrat"
            >
              Amigos ({friends.length})
            </motion.h2>
            <div>
              {friends?.map((friend, index) => (
                <>
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.3 + index * 0.1,
                    }}
                    key={index}
                    className="w-full min-h-16 flex flex-col"
                  >
                    <div className="flex bg-white my-3 relative">
                      {/* Imagem do amigo com navegação para perfil */}
                      <div className="flex gap-2 ml-[5%]">
                        <button className="cursor-pointer sm:w-8 md:w-12 lg:w-15 h-full hover:scale-103 transform transition-all overflow-visible relative z-10">
                          <img
                            src={
                              friend.user.image ==
                              "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                                ? "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                                : `http://localhost:3000/${friend.user.image}`
                            }
                            alt="Foto do dono da notificação"
                            className="w-full h-full rounded-full"
                            onClick={() => {
                              navigate(`/userPage/${friend.user._id}`);
                              setShowFriends(false);
                            }}
                          />
                        </button>

                        <h1 className="text-start flex jusfity-center items-center sm:text-sm md:text-md lg:text-lg font-semibold font-montserrat">
                          {friend.user.name}
                        </h1>
                      </div>

                      {/* Botão para iniciar conversa */}
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.9 }}
                        transition={{
                          duration: 0.2,
                          ease: "easeOut",
                        }}
                        onClick={() => handleOpenChat(friend)}
                        className="absolute md:top-1/6 lg:top-1/4 right-5 p-2 sm:text-xs md:text-sm lg:text-md xl:text-xl text-black border-2 border-black cursor-pointer rounded-lg hover:bg-black hover:text-white transition-all"
                      >
                        Mandar Mensagem
                      </motion.button>
                    </div>
                  </motion.div>
                </>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default Friends;
