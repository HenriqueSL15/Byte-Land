import { useContext, useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../contexts/AuthContext.jsx";
import LoadingScreen from "./LoadingScreen.jsx";

function ProtectedRoute({ children }) {
  const { user, isLoading } = useContext(AuthContext);
  const location = useLocation();

  // Se ainda estiver carregando, não faça nada (opcional: mostrar um spinner)
  if (isLoading) {
    <LoadingScreen />;
  } else {
    console.log(user);
  }

  setTimeout(() => {
    // Se não houver usuário e não estiver carregando, redirecione para login
    if (!user && !isLoading) {
      // Salva a URL atual para redirecionar de volta após o login
      return (
        <Navigate to="/login" state={{ from: location.pathname }} replace />
      );
    }
  }, 1000);

  // Se houver usuário, renderize o conteúdo da rota
  return children;
}

export default ProtectedRoute;
