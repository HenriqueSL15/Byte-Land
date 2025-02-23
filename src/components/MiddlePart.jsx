import Publication from "./Publication.jsx";
import NewPulicationBox from "./NewPublicationBox.jsx";
import axios from "axios";
import { useContext, useState, useEffect } from "react";

import { AuthContext } from "./AuthContext.jsx";
import { usePopUp } from "./PopUpContext.jsx";

function MiddlePart() {
  const { user } = useContext(AuthContext);
  const [publications, setPublications] = useState([]);

  const { show, showPopUp, closePopUp, message, setPopUpMessage } = usePopUp();

  const fetchPublications = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getPublications");
      const data = await response.data;

      setPublications(data.reverse());
    } catch (error) {
      console.error("Erro ao buscar publicações:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => fetchPublications(), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full border-2 h-screen overflow-y-scroll scrollbar-hide relative border-gray-200">
      <div>
        {user && <NewPulicationBox />}
        {publications &&
          publications.map((element, index) => {
            return (
              <Publication
                id={element._id}
                isOwner={user ? user.name === element.owner : false}
                key={index}
                owner={element.owner}
                title={element.title}
                description={element.description}
                image={element.image}
                date={element.createdAt}
              />
            );
          })}
      </div>
    </div>
  );
}

export default MiddlePart;
