import { queryClient } from "../main.jsx";
import { useFriends } from "./FriendsContext.jsx";
import { IoCloseOutline } from "react-icons/io5";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const fetchFriendsFn = async (userId) => {
  try {
    const response = await axios.get(
      `http://localhost:3000/users/${userId}/friends`
    );

    console.log(response.data.friends);

    return response.data.friends;
  } catch (error) {
    console.error(error);
  }
};

function Friends() {
  const { setShowFriends } = useFriends();
  const { user } = useContext(AuthContext);
  const [pendingFriendRequests, setPendingFriendRequests] = useState([]);
  const [friends, setFriends] = useState([]);
  const navigate = useNavigate();

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

  const {
    data: allFriends,
    isLoadingFriends,
    isError,
  } = useQuery({
    queryKey: ["allFriends", user._id],
    queryFn: () => fetchFriendsFn(user._id),
    enabled: !!user,
  });

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

  useEffect(() => {
    if (allFriends) {
      console.log("allFriends atualizado:", allFriends);
      console.log("pendingFriendRequests:", pendingFriendRequests);
      console.log("friends:", friends);
    }
  }, [allFriends, pendingFriendRequests, friends]);

  const handleFriendRequestOption = async (userId, friendId, status) => {
    try {
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

      const response = await axios.patch(
        `http://localhost:3000/users/${userId}/friends/${friendId}`,
        {
          status: status,
        }
      );

      if (status === "accepted") {
        addNotificationToOwner(friendId, userId, "Negou seu pedido de amizade");
        toast.success("Pedido de amizade negado!");
      } else if (status === "rejected") {
        addNotificationToOwner(
          friendId,
          userId,
          "Aceitou seu pedido de amizade"
        );
        toast.success("Pedido de amizade aceito!");
      }

      // if (response.status === 200) {
      //   queryClient.invalidateQueries(["allFriends", user._id]);
      // }

      return response.data;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full h-screen bg-black/50 absolute z-50 left-0 top-0 flex justify-center items-center">
      <div className="bg-white w-2/4 h-5/6 rounded-lg relative">
        <h1 className="text-3xl font-funnel-sans p-5">Amigos</h1>
        <button className="absolute cursor-pointer w-14 h-14 right-3 top-2">
          <IoCloseOutline
            className="w-full h-full hover:scale-110 transform transition-all"
            onClick={() => setShowFriends(false)}
          />
        </button>
        <div className="flex flex-col gap-5 p-5">
          <div>
            <h2 className="text-xl font-semibold font-montserrat">
              Pendentes (
              {pendingFriendRequests ? pendingFriendRequests.length : 0})
            </h2>
            <div>
              {pendingFriendRequests?.map((friend, index) => (
                <>
                  <div key={index} className="w-full min-h-16 flex flex-col">
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
                      <div className="flex gap-2 justify-end absolute right-0">
                        <button
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
                        </button>
                        <button
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
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
          <div>
            <h2 className="text-xl font-semibold font-montserrat">
              Amigos ({friends.length})
            </h2>
            <div>
              {friends?.map((friend, index) => (
                <>
                  <div key={index} className="w-full min-h-16 flex flex-col">
                    <div className="w-full min-h-1 rounded-full bg-gray-100"></div>
                    <div className="flex bg-white my-3 relative">
                      <button className="cursor-pointer w-20 h-full hover:scale-103 transform transition-all overflow-visible relative z-10">
                        <img
                          src={
                            friend.user.image ==
                            "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                              ? "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                              : `http://localhost:3000/${friend.user.image}`
                          }
                          alt="Foto do dono da notificação"
                          className="w-15 h-15 rounded-full"
                          onClick={() => {
                            navigate(`/userPage/${friend.user._id}`);
                            setShowFriends(false);
                          }}
                        />
                      </button>
                      <div className="flex flex-col gap-1">
                        <h1 className="text-start text-lg font-semibold font-montserrat">
                          {friend.user.name}
                        </h1>
                        <p className="text-start text-lg font-funnel-sans">
                          {friend.user.userPageDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Friends;
