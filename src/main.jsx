import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
import { PopUpProvider } from "./components/PopUpContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <PopUpProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </PopUpProvider>
    </QueryClientProvider>
  </StrictMode>
);
