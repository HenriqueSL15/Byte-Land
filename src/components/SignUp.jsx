// Biblioteca para validar emails
import validator from "validator";
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";
import { usePopUp } from "./PopUpContext.jsx";
import axios from "axios";
import PasswordValidator from "password-validator";

import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";

function SignUp() {
  const navigate = useNavigate();
  // Contexto de pop-up
  const { show, showPopUp, closePopUp, message, setPopUpMessage } = usePopUp();

  //Verificação se existe conflito de email ou usuário
  // const [conflict, setConflict] = useState(null);

  // Contexto de autenticação
  const { login } = useContext(AuthContext);

  // Usuário
  const [user, setUser] = useState("");

  // Email e verificação de email
  const [email, setEmail] = useState("");
  const isEmailValid = email === "" ? null : validator.isEmail(email);

  // Senhas e verificação das Senhas
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const isPasswordValid =
    password1 == "" && password2 == ""
      ? null
      : password1 === password2
      ? true
      : false;

  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

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
    if (password1) {
      const validationErrors = schema.validate(password1, { details: true });
      setErrors(validationErrors);
      setIsInitial(false);
    } else {
      setErrors([]); // Limpa os erros se o campo estiver vazio
      setIsInitial(true);
    }
    console.log(errors);
  }, [password1]);

  // Verifica se uma regra está presente nos erros
  function isRuleError(ruleName) {
    return errors.some((error) => error.validation === ruleName);
  }

  // Alteração do Usuário
  function handleUserChange(event) {
    setUser(event.value);
  }

  // Alteração do Email
  function handleEmailChange(event) {
    setEmail(event.value);
  }

  // Alteração das Senhas
  function handlePasswordChange(event) {
    // Determina qual é a senha com base no atributo ID do elemento
    if (event.id == "password1") setPassword1(event.value);
    else if (event.id == "password2") setPassword2(event.value);
  }

  //Envio do formulário de Login
  async function handleSignUpSubmit() {
    try {
      const response = await axios.post(
        "http://localhost:3000/signup",
        {
          user: user,
          email: email,
          password: password1,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Valor da response:", response.data.message);
      if (
        response.status == 200 &&
        response.data.message == "Usuário criado com sucesso!"
      ) {
        login(response.data.user);
        navigate("/");
        console.log("Sign Up realizado com sucesso!");
      } else if (response.status == 200) {
        setPopUpMessage(response.data.message);
        showPopUp();
      }
    } catch (error) {
      console.log(error);
    }
    console.log(`Usuário: ${user}\nEmail: ${email}\nSenha: ${password1}`);
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div
        className={`flex flex-col w-4/10 min-h-4/6 shadow-lg text-center overflow-y-auto transition-all `}
      >
        <h1 className="text-3xl p-3 font-montserrat font-semibold">Sign Up</h1>
        <div className="flex flex-col p-5 gap-7">
          {/* Label e Input do usuário */}
          <div className="flex flex-col text-start gap-2">
            <label
              htmlFor=""
              className="px-2 text-2xl font-poppins font-medium"
            >
              Usuário:
            </label>
            <input
              required
              type="text"
              value={user}
              onChange={(e) => handleUserChange(e.target)}
              placeholder="Digite seu usuário"
              className="w-full px-2 py-1 rounded-lg border border-gray-300 focus:outline-none focus:scale-101 focus:border-gray-500 transition-all"
            />
          </div>

          {/* Label e Input do Email */}
          <div className="flex flex-col text-start gap-2">
            <label
              htmlFor=""
              className="px-2 text-2xl font-poppins font-medium"
            >
              Email:
            </label>
            <input
              type="text"
              required
              placeholder="Digite seu email"
              value={email}
              onChange={(e) => handleEmailChange(e.target)}
              className={`
                w-full px-2 py-1 rounded-lg border border-gray-300
                ${
                  isEmailValid === null
                    ? "border-gray-300 focus:border-gray-500" // Cor padrão (cinza) quando o campo está vazio
                    : isEmailValid
                    ? "border-green-500 focus:border-green-500" // Verde se o email for válido
                    : "border-red-500 focus:border-red-500" // Vermelho se o email for inválido
                }
                 focus:outline-none focus:scale-101 transition-all
              `}
            />
          </div>

          {/* Label e Input da Senha */}
          <div className="flex flex-col text-start gap-2">
            <label
              htmlFor=""
              className="px-2 text-2xl font-poppins font-medium"
            >
              Senha:
            </label>
            <div className="flex relative">
              <input
                type={showPassword1 ? "text" : "password"}
                required
                placeholder="Digite sua senha"
                value={password1}
                id="password1"
                onChange={(e) => handlePasswordChange(e.target)}
                className={`
                w-full px-2 py-1 rounded-lg border border-gray-300
                ${
                  isInitial
                    ? "border-gray-300 "
                    : errors.length > 0
                    ? "border-red-500 focus:border-red-500"
                    : "border-green-500 focus:border-green-500"
                }
                 focus:outline-none focus:scale-101 transition-all
              `}
              />
              <button
                type="button"
                onClick={() => setShowPassword1(!showPassword1)}
                className="absolute inset-y-0 right-0 mr-2 cursor-pointer hover:scale-115 transition-all"
              >
                {showPassword1 ? (
                  <LuEyeClosed className="w-5 h-5" />
                ) : (
                  <LuEye className="w-5 h-5" />
                )}
              </button>
            </div>
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

          {/* Label e Input da Confirmação de Senha */}
          <div className="flex flex-col text-start gap-2">
            <label
              htmlFor=""
              className="px-2 text-2xl font-poppins font-medium"
            >
              Repita a senha:
            </label>
            <div className="flex relative">
              <input
                type={showPassword2 ? "text" : "password"}
                required
                placeholder="Confirme a sua senha"
                value={password2}
                id="password2"
                onChange={(e) => handlePasswordChange(e.target)}
                className={`
                w-full px-2 py-1 rounded-lg border border-gray-300
                ${
                  isPasswordValid === null
                    ? "border-gray-300 focus:border-gray-500" // Cor padrão (cinza) quando o campo está vazio
                    : isPasswordValid
                    ? "border-green-500 focus:border-green-500" // Verde se o email for válido
                    : "border-red-500 focus:border-red-500" // Vermelho se o email for inválido
                }
                 focus:outline-none focus:scale-101 transition-all
              `}
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute inset-y-0 right-0 mr-2 cursor-pointer hover:scale-115 transition-all"
              >
                {showPassword2 ? (
                  <LuEyeClosed className="w-5 h-5" />
                ) : (
                  <LuEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Botão de Continuar */}
          <div className="flex flex-col gap-3 items-center justify-center">
            <button
              type="button"
              // Verificação para alterar os estilos com base no preenchimento de todas as informações do formulário
              className={`w-1/3 cursor-not-allowed text-xl font-poppins font-semibold rounded-lg p-1 ${
                isEmailValid && isPasswordValid && user != ""
                  ? "border-2 border-green-500  cursor-pointer"
                  : "border-2 border-red-500  cursor-not-allowed"
              } hover:scale-105 transition-all`}
              onClick={() => {
                if (
                  isEmailValid &&
                  isPasswordValid &&
                  user != "" &&
                  errors.length == 0
                ) {
                  handleSignUpSubmit();
                } else if (
                  user == "" ||
                  email == "" ||
                  password1 == "" ||
                  password2 == ""
                ) {
                  setPopUpMessage("Preencha todos os campos!");
                  showPopUp(true);
                } else if (!isEmailValid && isPasswordValid) {
                  setPopUpMessage("Email inválido!");
                  showPopUp(true);
                } else if (isEmailValid && !isPasswordValid) {
                  setPopUpMessage("Senha inválida!");
                  showPopUp(true);
                } else if (!isEmailValid && !isPasswordValid) {
                  setPopUpMessage("Email e senha inválidos!");
                  showPopUp(true);
                }
              }}
            >
              Continuar
            </button>
            <div className="flex flex-row gap-2">
              <Link
                to="/login"
                className="border-b-2 font-poppins text-sm hover:bg-gray-200 px-5 pt-1 rounded-lg transition-all"
              >
                Você possui uma conta?
              </Link>
              <Link
                to="/"
                className="border-b-2 font-poppins text-sm hover:bg-gray-200 px-5 pt-1 rounded-lg transition-all"
              >
                Quer voltar a tela principal?
              </Link>
            </div>
          </div>
        </div>
      </div>
      {show && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900/50">
          <div className="absolute flex flex-col items-center justify-center gap-2 bg-white border-2 p-10 rounded-lg scale-130 ">
            <p className="text-red-500 text-center font-poppins text-sm font-semibold">
              {message}
            </p>
            <button
              type="button"
              className="border-b-2 font-poppins text-sm hover:bg-gray-200 px-5 pt-1 rounded-lg transition-all"
              onClick={() => {
                if (message == "Esse nome de usuário já está em uso.") {
                  setUser("");
                } else if (message == "Esse e-mail já está em uso.") {
                  setEmail("");
                } else if (
                  message == "Este nome de usuário e e-mail já estão em uso."
                ) {
                  setUser("");
                  setEmail("");
                }

                setPopUpMessage("");
                closePopUp();
              }}
            >
              Tentar novamente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default SignUp;
