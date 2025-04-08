import { FaHome } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { LuMessageSquareText } from "react-icons/lu";
import { FaUserFriends } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { queryClient } from "../main.jsx";

import { useContext, useState, useEffect } from "react";

import { AuthContext } from "./AuthContext.jsx";
import { usePopUp } from "./PopUpContext.jsx";
import Notifications from "./Notifications.jsx";
import { useNotifications } from "./NotificationContext.jsx";

async function fetchNotifications(userId) {
  const { data } = await axios.get(
    `http://localhost:3000/users/${userId}/notifications`
  );
  console.log(data.notifications);
  return data.notifications.reverse();
}

function LeftPart() {
  //Contexto do usuário
  const { user, logout } = useContext(AuthContext);

  //Contexto do pop up
  const { show } = usePopUp();

  //Contexto das notificações
  const { showNotifications, setShowNotifications } = useNotifications();

  const {
    data: notifications,
    isLoadingNotifications,
    isError,
  } = useQuery({
    queryKey: ["notifications", user?._id],
    queryFn: () => fetchNotifications(user?._id),
    enabled: !!user,
  });

  const newNotifications = notifications?.filter(
    (notification) => notification.read === false
  );

  const navigate = useNavigate();

  const buttons = [
    {
      id: 1,
      text: "Home",
      icon: <FaHome className="w-7 h-7" />,
    },
    {
      id: 2,
      text: "Notificações",
      icon: <IoIosNotifications className="w-7 h-7" />,
    },
    {
      id: 3,
      text: "Mensagens",
      icon: <LuMessageSquareText className="w-7 h-7" />,
    },
    {
      id: 4,
      text: "Amigos",
      icon: <FaUserFriends className="w-7 h-7" />,
    },
    {
      id: 5,
      text: "Configurações",
      icon: <IoMdSettings className="w-7 h-7" />,
    },
  ];

  function handleLogout() {
    navigate("/");
    logout();
  }

  function handleClick(text) {
    if (text === "Configurações") {
      navigate("/configs");
    } else if (text === "Home") {
      navigate("/");
    } else if (text === "Sair") {
      handleLogout();
    } else if (text === "Notificações") {
      setShowNotifications(true);
    }
  }

  return (
    <div className={`flex flex-col p-10 h-screen text-center`}>
      {buttons.map((button) => (
        <button
          key={button.id}
          type="button"
          onClick={() => handleClick(button.text)}
          className="flex gap-4 p-2 cursor-pointer my-3"
        >
          {button.icon}
          <p className="text-2xl font-montserrat font-medium">{button.text}</p>
          {button.id === 2 && notifications && newNotifications.length > 0 && (
            <div className="flex items-center justify-center w-8 h-8 bg-red-500 rounded-full">
              <p className="text-white text-lg font-montserrat font-bold">
                {newNotifications.length}
              </p>
            </div>
          )}
        </button>
      ))}
      <div className="flex flex-col mt-auto">
        <div className="flex gap-4 p-2 my-3">
          {user ? (
            <div className="flex-col text-center">
              <div className="flex flex-row gap-3 mb-5">
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
                <button
                  type="button"
                  className="text-2xl pt-3 cursor-pointer font-montserrat font-medium text-gray-600 border-b-2 border-gray-400 mt-auto mb-2 hover:border-gray-600 hover:text-gray-900 transition-all"
                  onClick={() => navigate(`/userPage/${user._id}`)}
                >
                  {user.name}
                </button>
              </div>
              <button
                type="button"
                onClick={handleLogout}
                className="border-2 px-5 py-3 font-montserrat font-bold rounded-lg cursor-pointer hover:bg-gray-200 text-xl"
              >
                Deslogar
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="border-2 px-5 py-3 font-montserrat font-bold rounded-lg cursor-pointer hover:bg-gray-200 text-xl"
            >
              Login
            </Link>
          )}
        </div>
      </div>

      {showNotifications && <Notifications />}
    </div>
  );
}

export default LeftPart;
