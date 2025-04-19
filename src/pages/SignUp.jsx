// Importação de bibliotecas e componentes necessários
import validator from "validator";
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import axios from "axios";
import PasswordValidator from "password-validator";
import { toast } from "sonner";
import { LuEye, LuEyeClosed } from "react-icons/lu";

function SignUp() {
  const navigate = useNavigate();

  // Contexto de autenticação
  const { login } = useContext(AuthContext);

  // Estados para armazenar dados do formulário
  const [user, setUser] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  // Estados para controle de visibilidade da senha
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // Estados para validação
  const [errors, setErrors] = useState([]);
  const [isInitial, setIsInitial] = useState(true);

  // Validação de email
  const isEmailValid = email === "" ? null : validator.isEmail(email);

  // Validação de senha
  const isPasswordValid =
    password1 == "" && password2 == ""
      ? null
      : password1 === password2
      ? true
      : false;

  // Lista de regras para senha
  const typeOfErrors = [
    { text: "Pelo menos 8 caracteres", name: "min" },
    { text: "Pelo menos 1 caractere maiúsculo", name: "uppercase" },
    { text: "Pelo menos 1 caractere minúsculo", name: "lowercase" },
    { text: "Pelo menos 1 número", name: "digits" },
    { text: "Pelo menos 1 caractere especial", name: "symbols" },
    { text: "Sem nenhum espaço", name: "spaces" },
  ];

  // Configuração do esquema de validação de senha
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

  // Efeito para validar a senha quando ela é alterada
  useEffect(() => {
    if (password1) {
      const validationErrors = schema.validate(password1, { details: true });
      setErrors(validationErrors);
      setIsInitial(false);
    } else {
      setErrors([]);
      setIsInitial(true);
    }
    console.log(errors);
  }, [password1]);

  // Função para verificar se uma regra específica está nos erros
  function isRuleError(ruleName) {
    return errors.some((error) => error.validation === ruleName);
  }

  // Funções para lidar com mudanças nos campos do formulário
  function handleUserChange(event) {
    setUser(event.value);
  }

  function handleEmailChange(event) {
    setEmail(event.value);
  }

  function handlePasswordChange(event) {
    if (event.id == "password1") setPassword1(event.value);
    else if (event.id == "password2") setPassword2(event.value);
  }

  // Função para enviar o formulário de cadastro
  async function handleSignUpSubmit() {
    try {
      const response = await axios.post(
        "https://byte-land-backend.vercel.app/signup",
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
        navigate("/login");
        toast.success("Usuário criado com sucesso!");
      } else if (response.status == 200) {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Erro ao cadastrar usuário!");
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
          {/* Campo de entrada para o usuário */}
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
                    ? "border-gray-300 focus:border-gray-500"
                    : isEmailValid
                    ? "border-green-500 focus:border-green-500"
                    : "border-red-500 focus:border-red-500"
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
            {/* Exibição das regras de senha */}
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

          {/* Campo de entrada para confirmação de senha */}
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
                    ? "border-gray-300 focus:border-gray-500"
                    : isPasswordValid
                    ? "border-green-500 focus:border-green-500"
                    : "border-red-500 focus:border-red-500"
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
              className={`xl:w-1/3 cursor-not-allowed text-xl font-poppins font-semibold rounded-lg p-1 ${
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
                  toast.error("Preencha todos os campos!");
                } else if (!isEmailValid && isPasswordValid) {
                  toast.error("Email inválido!");
                } else if (isEmailValid && !isPasswordValid) {
                  toast.error("Senha inválida!");
                } else if (!isEmailValid && !isPasswordValid) {
                  toast.error("Email e senha inválidos!");
                } else if (errors.length > 0) {
                  toast.error("Senha inválida!");
                }
              }}
            >
              Continuar
            </button>
            {/* Links para login e página principal */}
            <div className="flex flex-row gap-2">
              <Link
                to="/login"
                className="border-b-2 font-poppins text-sm hover:bg-gray-200 px-5 pt-1 rounded-lg transition-all"
              >
                Você possui uma conta?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
