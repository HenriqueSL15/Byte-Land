import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import axios from "axios";
import PasswordValidator from "password-validator"; // Biblioteca para validação de senhas
import { toast } from "sonner"; // Notificações toast
import { motion, AnimatePresence } from "framer-motion"; // Animações de UI

function UserSecurityPage() {
  // Obtém dados do usuário do contexto de autenticação
  const { user } = useContext(AuthContext);

  // Estados para controlar os campos de senha
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // Estados para validação de senha
  const [errors, setErrors] = useState([]);
  const [isInitial, setIsInitial] = useState(true); // Controla se o usuário já começou a digitar

  // Lista de requisitos de senha para exibição
  const typeOfErrors = [
    { text: "Pelo menos 8 caracteres", name: "min" },
    { text: "Pelo menos 1 caractere maiúsculo", name: "uppercase" },
    { text: "Pelo menos 1 caractere minúsculo", name: "lowercase" },
    { text: "Pelo menos 1 número", name: "digits" },
    { text: "Pelo menos 1 caractere especial", name: "symbols" },
    { text: "Sem nenhum espaço", name: "spaces" },
  ];

  // Configuração do validador de senha
  const schema = new PasswordValidator();

  schema
    .is()
    .min(8)
    .has()
    .uppercase()
    .has()
    .lowercase()
    .has()
    .digits()
    .has()
    .symbols()
    .has()
    .not()
    .spaces();

  // Efeito para validar a senha em tempo real enquanto o usuário digita
  useEffect(() => {
    if (newPassword) {
      const validationErrors = schema.validate(newPassword, { details: true });
      setErrors(validationErrors);
      setIsInitial(false);
    } else {
      setErrors([]); // Limpa os erros se o campo estiver vazio
      setIsInitial(true);
    }
  }, [newPassword]);

  // Função para enviar requisição de alteração de senha
  async function handleSubmit(userId, newPassword, oldPassword) {
    if (errors.length > 0) {
      toast.error("Senha Inválida!");
      return;
    }

    try {
      const response = await axios.put(
        `https://byte-land-backend.vercel.app/users/${userId}/password`,
        {
          newPassword: newPassword,
          oldPassword: oldPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status == 200) {
        toast.success("Senha alterada com sucesso!");
        setOldPassword("");
        setNewPassword("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Senha incorreta!");
    }
  }

  // Verifica se uma regra específica está na lista de erros
  function isRuleError(ruleName) {
    return errors.some((error) => error.validation === ruleName);
  }

  return (
    // Container principal com animação de entrada
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.2,
        ease: "easeInOut",
      }}
      className="min-h-screen flex justify-end items-top"
    >
      <div className="flex flex-col w-9/10">
        {/* Título com animação */}
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.2, ease: "easeInOut" }}
          className="font-semibold sm:text-2xl md:text-4xl text-gray-800 text-center py-5 mt-3 font-montserrat"
        >
          Segurança
        </motion.h1>
        <div className="flex flex-col  mx-20 shadow-xl p-10 rounded-xl gap-5">
          {/* Campo de senha atual */}
          <div className="w-full h-24 ">
            <h2 className="md:text-xl lg:text-3xl text-gray-800 mb-2 font-semibold flex gap-3">
              Senha Atual:
            </h2>
            <input
              className="border-2 border-gray-300 rounded-lg min-h-10 w-full p-2 font-funnel-sans"
              placeholder="Digite a sua senha atual"
              onChange={(e) => setOldPassword(e.target.value)}
              value={oldPassword}
              type="text" // Deveria ser type="password" para segurança
            />
          </div>
          {/* Campo de nova senha com validação visual */}
          <div className="w-full h-24 ">
            <h2 className="md:text-xl lg:text-3xl text-gray-800 mb-2 font-semibold flex gap-3">
              Nova Senha:
            </h2>
            <input
              className={`border-2 rounded-lg min-h-10 w-full  p-2 font-funnel-sans focus:outline-none ${
                isInitial
                  ? "border-gray-300"
                  : errors.length > 0
                  ? "border-red-500 focus:border-red-500"
                  : "border-green-500 focus:border-green-500"
              }}`}
              placeholder="Digite a nova senha"
              onChange={(e) => {
                setNewPassword(e.target.value);
              }}
              value={newPassword}
              type="text" // Deveria ser type="password" para segurança
            />
          </div>
          {/* Botão de alteração com estado condicional */}
          <div className="w-full min-h-24 ">
            {/* Lista de requisitos de senha com feedback visual */}
            <div className="font-funnel-sans ml-1 sm:text-sm md:text-md flex flex-col gap-1">
              {typeOfErrors.map((rule) => (
                <p
                  key={rule.name}
                  className={`${
                    isInitial || isRuleError(rule.name)
                      ? "text-red-500"
                      : "text-green-500"
                  }
                  `}
                >
                  *{rule.text}
                </p>
              ))}
            </div>
            <div className="flex justify-center items-center mt-5">
              <button
                type="button"
                onClick={() => {
                  errors.length > 0
                    ? toast.error("Senha Inválida!")
                    : handleSubmit(user._id, newPassword, oldPassword);
                }}
                className={`transform transition-all border-2 border-black p-10 font-bold py-2 px-4 rounded ${
                  isInitial || errors.length > 0
                    ? "border-red-500  cursor-not-allowed bg-gray-200"
                    : "cursor-pointer  border-green-500 hover:scale-110 bg-white"
                } `}
              >
                Alterar
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default UserSecurityPage;
