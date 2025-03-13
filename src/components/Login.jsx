// Biblioteca para validar emails
import validator from "validator";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { AuthContext } from "./AuthContext.jsx";
import { usePopUp } from "./PopUpContext.jsx";

import axios from "axios";

import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";

function Login() {
  // Navegação
  const navigate = useNavigate();

  // Contexto de pop-up
  const { show, showPopUp, closePopUp, message, setPopUpMessage } = usePopUp();

  //Contexto de login
  const { login } = useContext(AuthContext);

  // Email e verificação de email
  const [email, setEmail] = useState("");
  const isEmailValid = email === "" ? null : validator.isEmail(email);

  // Senhas e verificação das Senhas
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Alteração do Email
  function handleEmailChange(event) {
    setEmail(event.value);
  }

  // Alteração das Senhas
  function handlePasswordChange(event) {
    setPassword(event.value);
  }

  //Envio do formulário de Login
  async function handleLoginSubmit() {
    console.log("Enviando dados...");
    try {
      const response = await axios.post(
        "http://localhost:3000/login",
        {
          email: email,
          password: password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status == 200) {
        login(response.data.user);
        console.log("Login realizado com sucesso!");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      setPopUpMessage(error.response.data.message);
      showPopUp();
      // if (
      //   error.response.data.message == "O email ou a senha estão incorretos!"
      // ) {
      //   console.log("Deu errado");
      //   setPopUpMessage(error.response.data.message);
      //   showPopUp();
      // }
    }
    console.log(`Email: ${email}\nSenha: ${password}`);
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col w-4/10 min-h-3/6 shadow-lg text-center overflow-y-auto">
        <h1 className="text-3xl p-3 font-montserrat font-semibold">Login</h1>
        <div className="flex flex-col p-5 gap-7">
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
                type={showPassword ? "text" : "password"}
                required
                placeholder="Digite sua senha"
                value={password}
                id="password1"
                onChange={(e) => handlePasswordChange(e.target)}
                className={`
                w-full px-2 py-1 rounded-lg border border-gray-300
                 focus:outline-none focus:scale-101 transition-all
              `}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 mr-2 cursor-pointer hover:scale-115 transition-all"
              >
                {showPassword ? (
                  <LuEyeClosed className="w-5 h-5" />
                ) : (
                  <LuEye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Botão de Continuar */}
          <div className="flex items-center justify-center flex-col gap-3">
            <button
              type="button"
              // Verificação para alterar os estilos com base no preenchimento de todas as informações do formulário
              className={`w-1/3 cursor-not-allowed text-xl font-poppins font-semibold rounded-lg p-1 ${
                isEmailValid && password != ""
                  ? "border-2 border-green-500  cursor-pointer"
                  : "border-2 border-red-500  cursor-not-allowed"
              } hover:scale-105 transition-all`}
              onClick={() => {
                if (isEmailValid && password != "") {
                  handleLoginSubmit();
                } else if (email == "" || password == "") {
                  setPopUpMessage("Preencha todos os campos!");
                  showPopUp(true);
                } else if (!isEmailValid && email != "") {
                  setPopUpMessage("Email inválido!");
                  showPopUp(true);
                }
              }}
            >
              Continuar
            </button>
            <div className="flex flex-row gap-2">
              <Link
                to="/signup"
                className="border-b-2 font-poppins text-sm hover:bg-gray-200 px-5 pt-1 rounded-lg transition-all"
              >
                Você não possui uma conta?
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
      {/* Pop-up*/}
      {show && (
        <div className="fixed inset-0 flex justify-center items-center bg-black/50">
          <div className="absolute flex flex-col items-center justify-center gap-2 bg-white border-2 p-10 rounded-lg scale-130 ">
            <p className="text-red-500 text-center font-poppins text-sm font-semibold">
              {message}
            </p>
            <button
              type="button"
              className="border-b-2 font-poppins text-sm hover:bg-gray-200 px-5 pt-1 rounded-lg transition-all"
              onClick={() => {
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

export default Login;
