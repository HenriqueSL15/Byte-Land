import Profile from "../user/Profile.jsx";
import { motion, AnimatePresence } from "framer-motion";

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// Função assíncrona para buscar usuários aleatórios da API
// Exclui o usuário atual da lista de resultados
const fetchRandomUsers = async (userId) => {
  try {
    const response = await axios.get(
      `https://byte-land-backend.onrender.com/users/${userId}/random-users`
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};

// Função utilitária para selecionar itens aleatórios de um array
// Retorna um novo array com 'count' itens aleatórios do array original
const getRandomItems = (array, count) => {
  if (array.length <= count) {
    return [...array];
  }

  const arrayCopy = [...array];
  const result = [];

  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * arrayCopy.length);
    // Remove o item selecionado do array para evitar duplicatas
    result.push(arrayCopy.splice(randomIndex, 1)[0]);
  }

  return result;
};

function RightPart() {
  // Estado para armazenar os usuários aleatórios selecionados
  const [randomUsers, setRandomUsers] = useState([]);
  const navigate = useNavigate();
  // Obtém dados do usuário atual do contexto de autenticação
  const { user } = useContext(AuthContext);

  // Hook React Query para buscar todos os usuários
  // A consulta só é executada quando existe um usuário logado (enabled: !!user)
  const {
    data: allUsers,
    isLoadingUsers,
    isError,
  } = useQuery({
    queryKey: ["allUsers"],
    queryFn: () => fetchRandomUsers(user._id),
    enabled: !!user,
  });

  // Atualiza os usuários aleatórios sempre que a lista completa de usuários mudar
  useEffect(() => {
    if (allUsers) {
      setRandomUsers(getRandomItems(allUsers, 6));
    }
  }, [allUsers]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className={`flex flex-col p-10 `}
    >
      <h1 className="sm:text-lg md:text-lg lg:text-xl xl:text-3xl text-center font-funnel-sans font-semibold sm:mb-3 md:mb-5 lg:mb-10">
        Perfis Sugeridos
      </h1>
      <div className="flex flex-col mx-auto sm:gap1 md:gap-2 lg:gap-5">
        {/* Mapeia os usuários aleatórios para criar componentes Profile individuais */}
        {randomUsers?.map((user, index) => {
          return (
            <Profile
              key={index}
              img={user.image}
              name={user.name}
              // Navega para a página do usuário quando o perfil é clicado
              onClick={() => navigate(`/userPage/${user._id}`)}
            />
          );
        })}
      </div>
    </motion.div>
  );
}

export default RightPart;
