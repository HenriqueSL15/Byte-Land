import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext.jsx";
import axios from "axios";
import PasswordValidator from "password-validator";
import { toast } from "sonner";

function UserSecurityPage() {
  const { user } = useContext(AuthContext);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [errors, setErrors] = useState([]);
  const [isInitial, setIsInitial] = useState(true);

  const typeOfErrors = [
    { text: "Pelo menos 8 caracteres", name: "min" },
    { text: "Pelo menos 1 caractere maiúsculo", name: "uppercase" },
    { text: "Pelo menos 1 caractere minúsculo", name: "lowercase" },
    { text: "Pelo menos 1 número", name: "digits" },
    { text: "Pelo menos 1 caractere especial", name: "symbols" },
    { text: "Sem nenhum espaço", name: "spaces" },
  ];

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

  async function handleSubmit(userId, newPassword, oldPassword) {
    if (errors.length > 0) {
      toast.error("Senha Inválida!");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/users/${userId}/password`,
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
        console.log("Senha alterada com sucesso!", response.data);
        toast.success("Senha alterada com sucesso!");
        setOldPassword("");
        setNewPassword("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Senha incorreta!");
    }
  }

  // Verifica se uma regra está presente nos erros
  function isRuleError(ruleName) {
    return errors.some((error) => error.validation === ruleName);
  }

  return (
    <div className="min-h-screen flex justify-end items-top border-l-2">
      <div className="flex flex-col w-9/10">
        <h1 className="font-semibold text-4xl text-gray-800 text-center py-5 mt-3 font-montserrat">
          Segurança
        </h1>
        <div className="flex flex-col  mx-20 shadow-xl p-10 rounded-xl gap-10">
          <div className="w-full h-24 ">
            <h2 className="text-3xl text-gray-800 mb-2 font-semibold flex gap-3">
              Senha Atual:
            </h2>
            <input
              className="border-2 border-gray-300 rounded-lg min-h-10 w-full p-2 font-funnel-sans"
              placeholder="Digite a sua senha atual"
              onChange={(e) => setOldPassword(e.target.value)}
              value={oldPassword}
              type="text"
            />
          </div>
          <div className="w-full h-24 ">
            <h2 className="text-3xl text-gray-800 mb-2 font-semibold flex gap-3">
              Nova Senha:
            </h2>
            <input
              className={`border-2 rounded-lg min-h-10 w-full p-2 font-funnel-sans focus:outline-none ${
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
              type="text"
            />
            <div className="font-funnel-sans ml-1 flex flex-col gap-1 mt-1">
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
          </div>
          <div className="w-full min-h-24 ">
            <div className="flex justify-center items-center">
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
    </div>
  );
}

export default UserSecurityPage;
