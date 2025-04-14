import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./components/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "./components/NotificationContext.jsx";
import { FriendsProvider } from "./components/FriendsContext.jsx";

export const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <NotificationProvider>
        <AuthProvider>
          <FriendsProvider>
            <App />
          </FriendsProvider>
        </AuthProvider>
      </NotificationProvider>
    </QueryClientProvider>
  </StrictMode>
);
