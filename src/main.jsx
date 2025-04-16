import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { NotificationProvider } from "./contexts/NotificationContext.jsx";
import { FriendsProvider } from "./contexts/FriendsContext.jsx";
import { MessagesProvider } from "./contexts/MessagesContext.jsx";

export const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <MessagesProvider>
        <NotificationProvider>
          <AuthProvider>
            <FriendsProvider>
              <App />
            </FriendsProvider>
          </AuthProvider>
        </NotificationProvider>
      </MessagesProvider>
    </QueryClientProvider>
  </StrictMode>
);
