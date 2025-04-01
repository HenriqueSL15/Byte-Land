import { FaHome } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { LuMessageSquareText } from "react-icons/lu";
import { FaUserFriends } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { Link, useNavigate } from "react-router-dom";

import { useContext, useState } from "react";

import { AuthContext } from "./AuthContext.jsx";
import { usePopUp } from "./PopUpContext.jsx";
import Notifications from "./Notifications.jsx";
import { useNotifications } from "./NotificationContext.jsx";

function LeftPart() {
  //Contexto do pop up
  const { show } = usePopUp();

  //Contexto das notificações
  const { showNotifications, setShowNotifications } = useNotifications();

  //Navegação
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

  const { user, logout } = useContext(AuthContext);

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
