import Publication from "./Publication.jsx";
import NewPulicationBox from "./NewPublicationBox.jsx";
import axios from "axios";
import { useContext, useState, useEffect } from "react";

import LoadingScreen from "./LoadingScreen.jsx";

import { AuthContext } from "./AuthContext.jsx";
import { usePopUp } from "./PopUpContext.jsx";

import PopUp from "./PopUp.jsx";

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
    show,
    showPopUp,
    closePopUp,
    message,
    fn,
    setPopUpFn,
    setPopUpMessage,
  } = usePopUp();

  const [popUpInfo, setPopUpInfo] = useState(null);

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

  // Função para renderizar os pop-ups
  const renderPopUps = () => {
    if (!show) return null;

    return (
      <>
        {message == "Comentário deletado com sucesso!" ||
        message === "Publicação editada com sucesso!" ||
        message === "Comentário adicionado com sucesso!" ||
        message === "Publicação criada com sucesso!" ||
        message === "Preencha todos os campos!" ||
        message === "Publicação deletada com sucesso!" ? (
          <PopUp message={message} type={"ok"} fn={null} />
        ) : (
          message ===
            "Deseja editar essa publicação? Essa ação não tem retorno." && (
            <PopUp message={message} type={"confirm/cancel"} fn={fn} />
          )
        )}
      </>
    );
  };

  if (isLoadingPublications || isLoadingNotifications) {
    return <LoadingScreen />; // Ou redirecione para a página de login
  }

  return (
    <div className="w-full border-2 h-screen overflow-y-scroll scrollbar-hide relative border-gray-200">
      <div>
        {user && <NewPulicationBox />}

        {publications &&
          publications.map((element, index) => {
            console.log(element);
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
      {renderPopUps()}
    </div>
  );
}

export default MiddlePart;
