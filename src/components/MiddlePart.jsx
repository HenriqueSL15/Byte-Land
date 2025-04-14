import Publication from "./Publication.jsx";
import NewPulicationBox from "./NewPublicationBox.jsx";
import axios from "axios";
import { useContext, useState, useEffect } from "react";

import { AnimatePresence } from "framer-motion";

import LoadingScreen from "./LoadingScreen.jsx";

import { AuthContext } from "./AuthContext.jsx";

import { useQuery } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

const fetchPublications = async () => {
  try {
    const response = await axios.get("http://localhost:3000/publications");
    const data = await response.data.reverse();

    return data;
  } catch (error) {
    console.error("Erro ao buscar publicações:", error);
  }
};

const fetchNotifications = async (userId) => {
  const { data } = await axios.get(
    `http://localhost:3000/users/${userId}/notifications`
  );

  return data.notifications.reverse();
};

function MiddlePart() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const {
    data: publications,
    isLoadingPublications,
    errorPublications,
  } = useQuery({
    queryKey: ["publications"],
    queryFn: fetchPublications,
    enabled: !!user,
  });

  const {
    data: notifications,
    isLoadingNotifications,
    errorNotifications,
  } = useQuery({
    queryKey: ["notifications", user?._id],
    queryFn: () => fetchNotifications(user._id),
    enabled: !!user?._id,
  });

  if (isLoadingPublications || isLoadingNotifications) {
    return <LoadingScreen />; // Ou redirecione para a página de login
  }

  return (
    <div className="w-full border-2 h-screen overflow-y-scroll scrollbar-hide relative border-gray-200">
      <div>
        {user && <NewPulicationBox />}

        {publications &&
          publications.map((element, index) => {
            return (
              <Publication
                id={element._id}
                isOwner={user ? user.name === element.owner.name : false}
                owner={element.owner}
                title={element.title}
                description={element.description}
                image={element.image}
                date={element.createdAt}
                key={element._id}
              />
            );
          })}
      </div>
    </div>
  );
}

export default MiddlePart;
