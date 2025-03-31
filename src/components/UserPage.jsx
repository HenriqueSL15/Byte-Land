import React, { useContext, useEffect, useState, useRef } from "react";
import LeftPart from "./LeftPart.jsx";
import RightPart from "./RightPart.jsx";
import axios from "axios";
import Publication from "./Publication.jsx";
import { CiImageOn } from "react-icons/ci";
import { IoCloseOutline } from "react-icons/io5";
import { AuthContext } from "./AuthContext.jsx";
import { useParams } from "react-router-dom";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { usePopUp } from "./PopUpContext.jsx";
import LoadingScreen from "./LoadingScreen.jsx";

async function getUserDataFn(userId) {
  const response = await axios.get(
    `http://localhost:3000/users/${userId}/publications`
  );

  return response.data;
}

async function updateUserDataMutationFn({ userId, formData }) {
  const response = await axios.put(
    `http://localhost:3000/users/${userId}/userPage`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}

function UserPage() {
  const { userId } = useParams();
  const { user, login } = useContext(AuthContext);

  const [editInfo, setEditInfo] = useState(false);

  const { show, showPopUp, closePopUp, message, setPopUpMessage } = usePopUp();
  const fileInputRef = React.useRef(null);

  const [editedImage, setEditedImage] = useState(null);
  const [editedDescription, setEditedDescription] = useState(null);

  const queryClient = useQueryClient();

  const {
    data: userData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userPageData", userId],
    queryFn: () => getUserDataFn(userId),
    enabled: !!userId,
  });

  const updateUserMutation = useMutation({
    mutationFn: updateUserDataMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries(["userPageData", userId]);

      login(userData.user);
      setEditedDescription("");
      setEditedImage(null);
      setEditInfo(false);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  function renderPopUps() {
    if (!show) return null;

    return (
      <>
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50">
          <div className="bg-white p-6 w-1/12 h-1/12"></div>
        </div>
      </>
    );
  }

  const handleDeleteImage = () => {
    setEditedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ""; // Reseta o valor do input
    }
  };

  // Função para alterar a imagem
  const handleImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setEditedImage(file);
    }
  };

  async function handleSaveChanges() {
    const formData = new FormData();
    formData.append("image", editedImage);
    formData.append("description", editedDescription);

    updateUserMutation.mutate({
      userId: userData.user._id,
      formData: formData,
    });
  }

  if (isLoading) {
    return <LoadingScreen />; // Ou redirecione para a página de login
  }

  return (
    <div className="flex flex-row h-screen">
      <div className="w-3/12">
        <LeftPart />
      </div>
      <div className="w-6/12 border-x-2 border-gray-300 overflow-y-scroll scrollbar-hide relative">
        <div className="h-screen w-full p-5 flex flex-col gap-36 ">
          <div className="relative pb-14">
            <img
              src={
                userData.user.image !=
                "https://cdn-icons-png.flaticon.com/512/711/711769.png"
                  ? `http://localhost:3000/${userData.user.image}`
                  : "https://cdn-icons-png.flaticon.com/512/711/711769.png"
              }
              className="absolute bg-white bottom-0 left-3 h-32 w-32 g-black rounded-full z-48 border-3 border-white shadow-md "
              alt="Imagem do Usuário"
            />
            <img
              src={
                userData.user.userPageImage !=
                "https://www.solidbackgrounds.com/images/1920x1080/1920x1080-black-solid-color-background.jpg"
                  ? `http://localhost:3000/${userData.user.userPageImage}`
                  : "https://www.solidbackgrounds.com/images/1920x1080/1920x1080-black-solid-color-background.jpg"
              }
              alt="Imagem do Perfil do Usuário"
              className="rounded-lg w-full h-72 z-40"
            />
            <div className="absolute left-36 top-[87%] min-w-[590px] max-w-[650px] flex justify-between items-center">
              <div className="flex flex-col w-[75%]">
                <h1 className="font-funnel-sans text-2xl mb-1">
                  {userData.user ? userData.user.name : "Não possui nome"}
                </h1>

                <p className="font-funnel-sans text-lg text-[#979797]">
                  {userData.user
                    ? userData.user.userPageDescription
                    : "Não possui descrição"}
                </p>
              </div>
              {userData.user._id === user._id && (
                <button
                  type="button"
                  className="border-2 border-black cursor-pointer font-montserrat font-semibold hover:bg-black hover:text-white transition-all hover:scale-105 transform rounded-full w-40 h-12"
                  onClick={() => {
                    setEditInfo(true);
                  }}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-normal ml-10">Posts</h1>
            <div>
              {userData.posts &&
                userData.posts.length > 0 &&
                userData.posts.map((element, index) => {
                  return (
                    <Publication
                      id={element._id}
                      isOwner={userData.user._id === user._id}
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
        {editInfo && (
          <div className="fixed inset-0 flex items-center justify-center bg-gray-900/50 z-50">
            <div className="bg-white p-6 w-1/2 min-h-5/6 rounded-lg border-1 border-black relative">
              <button
                className="absolute right-4 w-14 h-14 cursor-pointer transform hover:scale-110 transition-all"
                onClick={() => setEditInfo(false)}
              >
                <IoCloseOutline className="h-full w-full" />
              </button>
              <h1 className="text-3xl font-semibold font-montserrat mt-3 text-center">
                Editar informações do perfil
              </h1>
              <div className="flex flex-col gap-3 mt-10">
                <h2 className="text-lg font-poppins">Descrição</h2>
                <textarea
                  className="bg-[#f2f2f2] font-funnel-sans placeholder-[#979797] rounded-sm min-h-32 p-2 w-full border-1 border-[#979797]"
                  placeholder="Escreva sua nova descrição"
                  onChange={(e) => setEditedDescription(e.target.value)}
                  value={editedDescription}
                ></textarea>
              </div>
              <div className="flex flex-col gap-3 mt-10">
                <h2 className="text-lg font-poppins">Imagem de Fundo</h2>
                <div className="flex flex-col gap-3 items-center">
                  <label className="bg-[#f2f2f2] w-full min-h-44 border-1 border-[#979797] rounded-sm cursor-pointer flex items-center justify-center">
                    {!editedImage ? (
                      <CiImageOn className="w-full h-32" />
                    ) : (
                      <img
                        src={URL.createObjectURL(editedImage)}
                        alt="Imagem selecionada"
                        className="min-h-36 max-h-36 w-auto"
                        value={editedImage}
                      />
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                  </label>
                  {editedImage && (
                    <button
                      onClick={handleDeleteImage}
                      className="transform border-1 border-black bg-white w-1/3 rounded-lg p-1 hover:text-red-500 hover:border-red-500 hover:scale-101  transition-all cursor-pointer"
                    >
                      Remover Imagem
                    </button>
                  )}
                </div>
                <button
                  onClick={() => handleSaveChanges()}
                  className="hover:scale-101 transform transition-all bg-black text-white font-bold p-3 rounded-full cursor-pointer"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        )}
        {/* {renderPopUps()} */}
      </div>
      <div className="w-3/12">
        <RightPart />
      </div>
    </div>
  );
}

export default UserPage;
