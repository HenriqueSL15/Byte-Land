import { FaHome } from "react-icons/fa";
import { IoIosNotifications } from "react-icons/io";
import { LuMessageSquareText } from "react-icons/lu";
import { FaUserFriends } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { Link } from "react-router-dom";

function LeftPart() {
  const buttons = [
    {
      id: 1,
      text: "Home",
      icon: <FaHome className="w-7 h-7" />,
    },
    {
      id: 2,
      text: "Notifications",
      icon: <IoIosNotifications className="w-7 h-7" />,
    },
    {
      id: 3,
      text: "Messages",
      icon: <LuMessageSquareText className="w-7 h-7" />,
    },
    {
      id: 4,
      text: "Friends",
      icon: <FaUserFriends className="w-7 h-7" />,
    },
    {
      id: 5,
      text: "Settings",
      icon: <IoMdSettings className="w-7 h-7" />,
    },
  ];

  const login = [];

  return (
    <div className="flex flex-col p-10 h-screen text-center">
      {buttons.map((button) => (
        <div key={button.id} className="flex gap-4 p-2 cursor-pointer my-3">
          {button.icon}
          <p className="text-2xl font-montserrat font-medium">{button.text}</p>
        </div>
      ))}
      <div className="flex flex-col mt-auto">
        <div className="flex gap-4 p-2 cursor-pointer my-3">
          {login[0] ? (
            <img
              src="https://cdn-icons-png.flaticon.com/512/711/711769.png"
              alt="Foto da pessoa"
              className="w-12 h-12 rounded-full"
            />
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
    </div>
  );
}

export default LeftPart;
