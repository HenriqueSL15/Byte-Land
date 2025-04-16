import { motion, AnimatePresence } from "framer-motion";
import { useMessages } from "../../contexts/MessagesContext.jsx";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import axios from "axios";
import { useState, useContext, useEffect, useRef } from "react";
import { IoCloseOutline, IoArrowBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

// Busca a lista de amigos do usuário
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

// Busca mensagens de uma conversa específica
const fetchConversationMessages = async ({ queryKey }) => {
  const [_, userId, friendId] = queryKey;
  try {
    const response = await axios.get(
      `http://localhost:3000/conversation/${userId}/${friendId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
    return { messages: [], conversation: null };
  }
};

// Envia uma nova mensagem para a conversa
const sendMessage = async (conversationId, senderId, content) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/conversations/${conversationId}/message`,
      { conversationId, senderId, content }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

function Messages() {
  const { showMessages, setShowMessages, selectedFriend, setSelectedFriend } =
    useMessages();

  const [messages, setMessages] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const messagesEndRef = useRef(null);
  const [friends, setFriends] = useState([]);

  const queryClient = useQueryClient();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Adiciona notificação para o destinatário
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

  // Busca lista de amigos
  const {
    data: allFriends,
    isLoadingFriends,
    isError,
  } = useQuery({
    queryKey: ["allFriends", user._id],
    queryFn: () => fetchFriendsFn(user._id),
    enabled: !!user,
  });

  // Busca mensagens da conversa atual
  const { data: conversationData, isLoadingConversationData } = useQuery({
    queryKey: ["conversation", user?._id, selectedFriend?.user?._id],
    queryFn: fetchConversationMessages,
    enabled: !!user && !!selectedFriend,
    refetchInterval: 3000, // Refetch a cada 3 segundos
  });

  // Atualiza mensagens quando os dados da conversa mudam
  useEffect(() => {
    if (conversationData) {
      if (conversationData.messages) {
        console.log("Atualizando mensagens:", conversationData.messages);
        setMessages(conversationData.messages);
      }

      if (conversationData.conversation) {
        console.log("Atualizando conversa:", conversationData.conversation);
        setCurrentConversation(conversationData.conversation);
      }
    }
  }, [conversationData]);

  // Filtra amigos aceitos
  useEffect(() => {
    if (allFriends) {
      const accepted = allFriends.filter(
        (friend) => friend.status === "accepted"
      );
      setFriends(accepted);
    }
  }, [allFriends]);

  // Abre o chat com um amigo
  const handleOpenChat = async (friend, event) => {
    if (event) {
      event.stopPropagation();
    }
    setSelectedFriend(friend);
  };

  // Envia uma nova mensagem
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentConversation) return;

    try {
      const newMessage = await sendMessage(
        currentConversation._id,
        user._id,
        messageInput
      );

      if (newMessage) {
        // Feedback imediato
        setMessages((prevMessages) => [...prevMessages, newMessage]);
        setMessageInput("");

        addNotificationToOwner(
          selectedFriend.user._id,
          user._id,
          "Mandou uma mensagem para você!"
        );

        // Atualiza dados
        queryClient.invalidateQueries([
          "conversation",
          user._id,
          selectedFriend.user._id,
        ]);

        queryClient.refetchQueries({
          queryKey: ["conversation", user._id, selectedFriend.user._id],
        });
      }
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  // Envia mensagem ao pressionar Enter
  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Rola para o final da conversa
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fecha o modal de mensagens
  const handleClose = () => {
    setShowMessages(false);
    setSelectedFriend(null);
  };

  return (
    <motion.div
      id="messages-modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        ease: "easeOut",
        type: "tween",
        duration: 0.2,
      }}
      className="absolute w-full h-screen bg-black/40 z-50 top-0 left-0 flex justify-center items-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        className="w-1/3 h-2/3 bg-white rounded-lg flex flex-col relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            e.stopPropagation();
            handleClose();
          }}
          className="md:w-10 md:h-10 xl:w-16 xl:h-20 absolute top-0 right-2"
        >
          <IoCloseOutline className="w-full h-full cursor-pointer" />
        </motion.div>
        <AnimatePresence mode="wait">
          {!selectedFriend ? (
            // Lista de amigos
            <motion.div
              className="flex flex-col gap-7"
              key={"friendList"}
              initial={{ x: 0 }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.3 }}
            >
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="plg:p-5 md:p-1 md:text-2xl lg:text-3xl font-funnel-sans"
              >
                Mensagens
              </motion.h1>

              {friends.length > 0 ? (
                friends.map((friend) => (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.2,
                      ease: "easeInOut",
                      delay: 0.2,
                    }}
                    key={friend.user._id}
                    className="flex smd:gap-1 lg:gap-3 mx-3"
                  >
                    <motion.img
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2, ease: "easeInOut" }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowMessages(false);
                        setSelectedFriend(null);
                        navigate(`/userPage/${friend.user._id}`);
                      }}
                      className="cursor-pointer sm:w-10 sm:h-10 lg:w-14 lg:h-14 rounded-full object-cover"
                      src={
                        friend.user.image ==
                        "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                          ? "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                          : `http://localhost:3000/${friend.user.image}`
                      }
                      alt="Foto do usuário"
                    />

                    <div className="flex flex-col justify-center">
                      <h1 className="lg:text-lg xl:text-xl font-funnel-sans">
                        {friend.user.name}
                      </h1>
                    </div>
                    <div className="w-full flex justify-end items-center">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={(e) => handleOpenChat(friend, e)}
                        className="sm:text-xs sm:px-1 md:w-[100px] lg:w-[100px] xl:w-[150px] h-3/4 bg-white border-2 border-black rounded-lg text-md mr-3 font-poppins cursor-pointer"
                      >
                        Abrir Chat
                      </motion.button>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="flex justify-center items-center h-32">
                  <p className="text-gray-500">
                    Você ainda não tem amigos para conversar.
                  </p>
                </div>
              )}
            </motion.div>
          ) : (
            // Tela de chat
            <motion.div
              key="chatView"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3 }}
              className="flex flex-col h-full w-full"
            >
              <div className="flex items-center p-4 border-b">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedFriend(null);
                  }}
                  className="mr-3"
                >
                  <IoArrowBackOutline className="w-6 h-6 cursor-pointer" />
                </motion.button>
                <img
                  src={
                    selectedFriend.user.image ==
                    "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                      ? "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                      : `http://localhost:3000/${selectedFriend.user.image}`
                  }
                  alt={`Foto de ${selectedFriend.user.name}`}
                  className="w-12 h-12 rounded-full object-cover mr-3"
                />
                <h2 className="text-xl font-funnel-sans">
                  {selectedFriend.user.name}
                </h2>
              </div>

              <div className="flex-grow p-4 overflow-y-auto">
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={index}
                      className={`mb-4 flex ${
                        msg.sender._id === user._id || msg.sender === user._id
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] break-words p-3 rounded-lg ${
                          msg.sender._id === user._id || msg.sender === user._id
                            ? "bg-blue-500 text-white text-end"
                            : "bg-gray-200 text-start"
                        }`}
                      >
                        {msg.content}
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <p className="text-gray-500">
                      Nenhuma mensagem ainda. Comece a conversar!
                    </p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="sm:p-1 md:p-4 border-t">
                <div className="flex ">
                  <input
                    type="text"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Digite sua mensagem..."
                    className="flex-grow p-2 border rounded-l-lg sm:text-sm sm:max-w-[75%] md:text-sm lg:text-xl focus:outline-none md:max-w-[75%] lg:max-w-[90%]"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleSendMessage}
                    className="bg-black text-white sm:p-1 md:p-2 rounded-r-lg hover:bg-white hover:text-black border-1 border-black transition-all cursor-pointer"
                  >
                    Enviar
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

export default Messages;
