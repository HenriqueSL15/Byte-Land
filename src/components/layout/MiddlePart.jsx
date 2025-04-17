import Publication from "../publications/Publication.jsx";
import NewPulicationBox from "../publications/NewPublicationBox.jsx";
import axios from "axios";
import { useContext, useState, useEffect } from "react";

import { AnimatePresence } from "framer-motion";

import LoadingScreen from "../common/LoadingScreen.jsx";

import { AuthContext } from "../../contexts/AuthContext.jsx";

import { useQuery } from "@tanstack/react-query";

import { useNavigate } from "react-router-dom";

// Função assíncrona para buscar todas as publicações da API
// Inverte a ordem para mostrar as mais recentes primeiro
const fetchPublications = async () => {
  try {
    const response = await axios.get(
      "https://byte-land-backend.onrender.com/publications"
    );
    const data = await response.data.reverse();

    return data;
  } catch (error) {
    console.error("Erro ao buscar publicações:", error);
  }
};

// Função assíncrona para buscar notificações de um usuário específico
// Recebe o ID do usuário como parâmetro e retorna as notificações em ordem inversa
const fetchNotifications = async (userId) => {
  const { data } = await axios.get(
    `https://byte-land-backend.onrender.com/users/${userId}/notifications`
  );

  return data.notifications.reverse();
};

function MiddlePart() {
  // Obtém dados do usuário atual do contexto de autenticação
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Hook React Query para buscar todas as publicações
  // A consulta só é executada quando existe um usuário logado (enabled: !!user)
  const {
    data: publications,
    isLoadingPublications,
    errorPublications,
  } = useQuery({
    queryKey: ["publications"], // Chave única para identificar esta consulta no cache
    queryFn: fetchPublications, // Função que realiza a busca dos dados
    enabled: !!user, // Só executa a consulta se o usuário estiver logado
  });

  // Hook React Query para buscar notificações do usuário atual
  // A consulta só é executada quando existe um ID de usuário válido
  const {
    data: notifications,
    isLoadingNotifications,
    errorNotifications,
  } = useQuery({
    queryKey: ["notifications", user?._id], // Chave que inclui o ID do usuário para individualizar a consulta
    queryFn: () => fetchNotifications(user._id), // Função que busca as notificações para este usuário
    enabled: !!user?._id, // Só executa se existir um ID de usuário válido
  });

  // Exibe tela de carregamento enquanto os dados estão sendo buscados
  if (isLoadingPublications || isLoadingNotifications) {
    return <LoadingScreen />; // Componente que mostra um indicador de carregamento
  }

  return (
    // Container principal com rolagem vertical e borda
    <div className="w-full border-2 h-screen overflow-y-scroll scrollbar-hide relative border-gray-200">
      <div>
        {/* Renderiza o componente de nova publicação apenas se o usuário estiver logado */}
        {user && <NewPulicationBox />}

        {/* Mapeia todas as publicações para criar componentes Publication individuais */}
        {publications &&
          publications.map((element, index) => {
            return (
              <Publication
                id={element._id}
                // Verifica se o usuário atual é o dono da publicação para habilitar edição/exclusão
                isOwner={user ? user.name === element.owner.name : false}
                owner={element.owner}
                title={element.title}
                description={element.description}
                image={element.image}
                date={element.createdAt}
                key={element._id} // Chave única para otimização de renderização do React
              />
            );
          })}
      </div>
    </div>
  );
}

export default MiddlePart;
