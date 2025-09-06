// SocketContext.jsx
import React, { createContext, useContext, useEffect, useRef } from "react";
import { createSocket } from "../socket/socket";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = React.useState(null);
  const { auth } = useAuth();

  useEffect(() => {
    if (auth?.token) { 
      const s = createSocket(auth.token);
      setSocket(s);

      return () => {
        if (s) s.disconnect();
      };
    }
  }, [auth?.token]);
  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("🔌 Connected:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("❌ Disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  useEffect(() => {
    if (socket) {
      console.log("Socket connected:", socket);
    }
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
