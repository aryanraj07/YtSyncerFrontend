import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "sweetalert2/dist/sweetalert2.min.css";

import App from "./App.jsx";

import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { NotificationContextProvider } from "./context/NotificationContext.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";

createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <SocketProvider>
      <NotificationContextProvider>
        <App />
      </NotificationContextProvider>
    </SocketProvider>
  </AuthProvider>
);
