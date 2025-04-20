// Biblioteca para validar emails
import validator from "validator";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import { AuthContext } from "../contexts/AuthContext.jsx";
import { toast } from "sonner";

import axios from "axios";

import { LuEye } from "react-icons/lu";
import { LuEyeClosed } from "react-icons/lu";

function Login() {
  // Hook para navegação
  const navigate = useNavigate();

  // Contexto de autenticação
  const { login } = useContext(AuthContext);

  // Estado e validação do email
  const [email, setEmail] = useState("");
  const isEmailValid = email === "" ? null : validator.isEmail(email);

  // Estados para senha e visibilidade
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Função para atualizar o email
  function handleEmailChange(event) {
    setEmail(event.value);
  }

  // Função para atualizar a senha
  function handlePasswordChange(event) {
    setPassword(event.value);
  }

  // Função assíncrona para enviar o formulário de login
  async function handleLoginSubmit() {
    try {
      // Requisição POST para o servidor
      const response = await axios.post(
        "https://byte-land-backend.vercel.app/login",
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

      // Se a resposta for bem-sucedida
      if (response.status == 200) {
        login(response.data.user);

        toast.success("Login realizado com sucesso!");
        navigate("/");
      }
    } catch (error) {
      console.log(error);
      toast.error("Email ou senha incorretos!");
    }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col w-4/10 min-h-3/6 shadow-lg text-center overflow-y-auto">
        <h1 className="text-3xl p-3 font-montserrat font-semibold">Login</h1>
        <div className="flex flex-col p-5 gap-7">
          {/* Campo de entrada para o email */}
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

          {/* Campo de entrada para a senha */}
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
              {/* Botão para mostrar/ocultar senha */}
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

          {/* Botão de login e links adicionais */}
          <div className="flex items-center justify-center flex-col gap-3">
            <button
              type="button"
              className={`lg:w-1/3 cursor-not-allowed text-xl font-poppins font-semibold rounded-lg p-1 ${
                isEmailValid && password != ""
                  ? "border-2 border-green-500 cursor-pointer"
                  : "border-2 border-red-500 cursor-not-allowed"
              } hover:scale-105 transition-all`}
              onClick={() => {
                if (isEmailValid && password != "") {
                  handleLoginSubmit();
                } else if (email == "" || password == "") {
                  toast.error("Preencha todos os campos!");
                } else if (!isEmailValid && email != "") {
                  toast.error("Email inválido!");
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
