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

  //   async function getOwnerInformation(ownerName = owner) {
  //   try {
  //     const response = await axios.get(
  //       "http://localhost:3000/getOwnerInformation",
  //       {
  //         owner: owner,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );

  //     if (response.status == 200) {
  //       setOwnerInfo(response.data.owner);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // }

  console.log(publications);

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
                isOwner={user ? user.name === element.owner.name : false}
                key={element._id}
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
