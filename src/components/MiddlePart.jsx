import Publication from "./Publication.jsx";
import NewPulicationBox from "./NewPublicationBox.jsx";
import axios from "axios";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext.jsx";

function MiddlePart() {
  const { user } = useContext(AuthContext);
  const [publications, setPublications] = useState([]);

  const fetchPublications = async () => {
    try {
      const response = await axios.get("http://localhost:3000/getPublications");
      const data = await response.data;
      console.log(data);

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
      {user && <NewPulicationBox />}
      {publications &&
        publications.map((element, index) => {
          return (
            <Publication
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
  );
}

export default MiddlePart;
