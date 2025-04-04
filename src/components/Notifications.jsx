import { useQuery, useQueryClient } from "@tanstack/react-query";
import { queryClient } from "../main.jsx";
import axios from "axios";
import { useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";
import LoadingScreen from "./LoadingScreen.jsx";
import { IoCloseOutline } from "react-icons/io5";
import { useNotifications } from "./NotificationContext.jsx";

function Notifications() {
  const { user } = useContext(AuthContext);
  const { setShowNotifications } = useNotifications();

  const notifications = queryClient.getQueryData(["notifications", user._id]);

  return (
    <div className="absolute w-full h-screen bg-black/40 z-50 flex items-center justify-center top-0 left-0">
      <div className="w-1/3 h-2/3 bg-white rounded-lg flex flex-col relative">
        <h1 className="p-5 text-3xl font-funnel-sans">Notificações</h1>
        <button className="absolute cursor-pointer w-14 h-14 right-3 top-2">
          <IoCloseOutline
            className="w-full h-full hover:scale-110 transform transition-all"
            onClick={() => setShowNotifications(false)}
          />
        </button>

        <div className="flex flex-col gap-13 mt-3 px-3 overflow-y-auto">
          {notifications &&
            notifications.map((notification, index) => {
              return (
                <div
                  key={index}
                  className="w-full min-h-16 flex flex-col gap-3"
                >
                  <div className="w-full min-h-1 rounded-full bg-gray-100"></div>
                  <div className="flex">
                    <img
                      src={
                        notification.owner.image ==
                        "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                          ? "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                          : `http://localhost:3000/${notification.owner.image}`
                      }
                      alt="Foto do dono da notificação"
                      className="w-16 h-16 rounded-full"
                    />
                    <div className="flex flex-col gap-1 mb-5">
                      <h1 className="text-start ml-4 text-lg font-semibold font-montserrat">
                        {notification.owner.name}
                      </h1>
                      <p className="text-start ml-4 text-lg">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default Notifications;

{
  /* <div className="bg-blue-500/50 w-full min-h-16 flex">
  <img src="" alt="" className="w-16 h-16 rounded-full bg-black" />
  <div className="flex flex-col gap-1">
    <h1 className="text-start ml-4 text-lg font-semibold font-montserrat">
      Nome da pessoa
    </h1>
    <p className="text-start ml-4 text-lg">
      Lorem ipsum, dolor sit amet consectetur adipisicing
    </p>
  </div>
</div>; */
}
