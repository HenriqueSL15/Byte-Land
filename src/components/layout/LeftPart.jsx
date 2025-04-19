import { FaHome } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { LuMessageSquareText } from "react-icons/lu";
import { FaUserFriends } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { useContext, useState, useEffect } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { AuthContext } from "../../contexts/AuthContext.jsx";

import Notifications from "../publications/Notifications.jsx";
import Friends from "../../features/friends/Friends.jsx";
import { useNotifications } from "../../contexts/NotificationContext.jsx";
import { useMessages } from "../../contexts/MessagesContext.jsx";
import { useFriends } from "../../contexts/FriendsContext.jsx";
import Messages from "../../features/messages/Messages.jsx";

// Função assíncrona para buscar notificações do usuário da API
// Retorna as notificações em ordem inversa (mais recentes primeiro)
async function fetchNotifications(userId) {
  const { data } = await axios.get(
    `https://byte-land-backend.vercel.app/users/${userId}/notifications`
  );

  return data.notifications.reverse();
}

function LeftPart() {
  // Obtém dados do usuário e função de logout do contexto de autenticação
  const { user, logout } = useContext(AuthContext);

  // Obtém estados e funções dos contextos de notificações, amigos e mensagens
  // Estes contextos controlam a visibilidade dos respectivos painéis
  const { showNotifications, setShowNotifications } = useNotifications();
  const { showFriends, setShowFriends } = useFriends();
  const { showMessages, setShowMessages } = useMessages();

  // Hook React Query para buscar notificações do usuário atual
  // A consulta só é executada quando existe um usuário logado (enabled: !!user)
  const {
    data: notifications,
    isLoadingNotifications,
    isError,
  } = useQuery({
    queryKey: ["notifications", user?._id],
    queryFn: () => fetchNotifications(user?._id),
    enabled: !!user,
  });

  // Filtra apenas notificações não lidas para exibir contador
  const newNotifications = notifications?.filter(
    (notification) => notification.read === false
  );

  const navigate = useNavigate();

  // Array de objetos que define os botões do menu lateral
  // Cada botão tem um id, texto e ícone correspondente
  const buttons = [
    {
      id: 1,
      text: "Home",
      icon: (
        <FaHome className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5 xl:w-7 xl:h-7" />
      ),
    },
    {
      id: 2,
      text: "Notificações",
      icon: (
        <IoIosNotifications className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5 xl:w-7 xl:h-7" />
      ),
    },
    {
      id: 3,
      text: "Mensagens",
      icon: (
        <LuMessageSquareText className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5 xl:w-7 xl:h-7" />
      ),
    },
    {
      id: 4,
      text: "Amigos",
      icon: (
        <FaUserFriends className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5 xl:w-7 xl:h-7" />
      ),
    },
    {
      id: 5,
      text: "Configurações",
      icon: (
        <IoMdSettings className="w-5 h-5 sm:w-6 sm:h-6 lg:w-5 lg:h-5 xl:w-7 xl:h-7" />
      ),
    },
  ];

  // Função para realizar logout do usuário
  // Navega para a página inicial e chama a função logout do contexto
  function handleLogout() {
    navigate("/");
    logout();
  }

  // Função que gerencia o comportamento ao clicar em cada botão do menu
  // Cada botão tem uma ação específica (navegação ou exibição de painel)
  function handleClick(text) {
    if (text === "Configurações") {
      navigate("/configs");
    }

    if (text === "Home") {
      navigate("/");
    } else if (text === "Notificações") {
      setShowNotifications(true);
    } else if (text === "Mensagens") {
      setShowMessages(true);
    } else if (text === "Amigos") {
      setShowFriends(true);
    } else if (text === "Sair") {
      handleLogout();
    }
  }

  return (
    // Componente motion.div do Framer Motion para animação de entrada/saída
    // Aplica animações de opacidade e escala ao componente
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className={`flex flex-col sm:p-0 lg:p-4 xl:p-10 h-screen text-center`}
    >
      {/* Mapeia o array de botões para criar os elementos de menu */}
      {buttons.map((button) => (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          key={button.id}
          type="button"
          onClick={() => handleClick(button.text)}
          className="flex gap-4 p-2 w-auto cursor-pointer my-3"
        >
          {button.icon}
          <p className="sm:text-sm lg:text-xl xl:text-2xl font-montserrat font-medium">
            {button.text}
          </p>
          {/* Exibe contador de notificações não lidas quando existirem */}
          {button.id === 2 && notifications && newNotifications.length > 0 && (
            <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full">
              <p className="text-white text-lg font-montserrat font-bold">
                {newNotifications.length}
              </p>
            </div>
          )}
        </motion.button>
      ))}
      {/* Seção inferior com informações do usuário e botão de logout */}
      <div className="flex flex-col mt-auto">
        <div className="flex gap-4 p-2 my-3">
          {user && (
            <div className="flex-col text-center">
              <div className="flex flex-row gap-3 mb-5">
                {/* Exibe a imagem do usuário ou uma imagem padrão */}
                <img
                  src={user?.image}
                  alt="Foto da pessoa"
                  className="w-12 h-12 rounded-full"
                />
                {/* Botão com nome do usuário que navega para página de perfil */}
                <button
                  type="button"
                  className="text-2xl pt-3 cursor-pointer font-montserrat font-medium text-gray-600 border-b-2 border-gray-400 mt-auto mb-2 hover:border-gray-600 hover:text-gray-900 transition-all"
                  onClick={() => navigate(`/userPage/${user._id}`)}
                >
                  {user.name}
                </button>
              </div>
              {/* Botão de logout com animação */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={handleLogout}
                className="border-2 px-5 py-3 font-montserrat font-bold rounded-lg cursor-pointer hover:bg-gray-200 text-xl"
              >
                Deslogar
              </motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Renderização condicional dos painéis de notificações, amigos e mensagens */}
      {/* AnimatePresence permite animar a saída dos componentes quando são removidos */}
      <AnimatePresence>
        {showNotifications && <Notifications />}
        {showFriends && <Friends />}
        {showMessages && <Messages />}
      </AnimatePresence>
    </motion.div>
  );
}

export default LeftPart;
