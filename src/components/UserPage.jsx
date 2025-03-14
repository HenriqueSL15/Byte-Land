import React, { useContext, useEffect, useState } from "react";
import LeftPart from "./LeftPart.jsx";
import RightPart from "./RightPart.jsx";
import axios from "axios";
import Publication from "./Publication.jsx";
import { AuthContext } from "./AuthContext.jsx";

function UserPage() {
  const { user } = useContext(AuthContext);
  const [userPosts, setUserPosts] = useState([]);

  async function getUserPosts() {
    try {
      if (!user) {
        console.log("Usuário não está autenticado.");
        return;
      }

      console.log("fazendo busca");

      const response = await axios.post(
        "http://localhost:3000/getUserPosts",
        {
          userId: user._id,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        setUserPosts(response.data.posts);
        // console.log("Posts do usuário foram recebidos com sucesso!");
      }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (user) {
      getUserPosts(); // Busca inicial
      const interval = setInterval(() => getUserPosts(), 1000); // Busca periódica
      return () => clearInterval(interval); // Limpa o intervalo ao desmontar
    }
  }, [user]); // Executa quando `user` muda

  // useEffect(() => {
  //   console.log(userPosts);
  // }, [userPosts]);

  if (!user) {
    return <p>Carregando...</p>; // Ou redirecione para a página de login
  }

  return (
    <div className="flex flex-row h-screen">
      <div className="w-3/12">
        <LeftPart />
      </div>
      <div className="w-6/12 border-x-2 border-gray-300 overflow-y-scroll scrollbar-hide relative">
        <div className="h-screen w-full p-5 flex flex-col gap-36">
          <div className="relative pb-14">
            <img
              src={user ? `http://localhost:3000/${user.image}` : ""}
              className="absolute bottom-0 left-3 h-32 w-32 bg-black rounded-full z-48 border-3 border-white shadow-md "
              alt="Imagem do Usuário"
            />
            <img
              src="https://preview.redd.it/oupwnwwcn8fe1.jpeg?auto=webp&s=bb26424933e0ec767facc328ab0c53e3c892fae3"
              alt="Imagem do Perfil do Usuário"
              className="rounded-lg w-full h-72 z-40"
            />
            <div className="absolute left-36 top-[87%] max-w-[650px] flex justify-between items-center">
              <div className="flex flex-col w-[75%]">
                <h1 className="font-funnel-sans text-2xl mb-1">
                  {user ? user.name : "Não possui nome"}
                </h1>
                <p className="font-funnel-sans text-lg text-[#979797]">
                  Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                  Explicabo placeat nemo quod beatae natus dolore, accusamus,
                  sunt
                </p>
              </div>
              <button className="border-2 border-black cursor-pointer font-montserrat font-semibold hover:bg-black hover:text-white transition-all hover:scale-105 transform rounded-full w-40 h-12">
                Edit Profile
              </button>
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-normal ml-10">Posts</h1>
            <div>
              {userPosts &&
                userPosts.map((element, index) => {
                  return (
                    <Publication
                      id={element._id}
                      isOwner={true}
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
        </div>
      </div>
      <div className="w-3/12">
        <RightPart />
      </div>
    </div>
  );
}

export default UserPage;
