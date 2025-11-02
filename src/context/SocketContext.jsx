// SocketContext.jsx
import React, { createContext, useContext, useEffect, useRef } from "react";
import { createSocket } from "../socket/socket";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { auth } = useAuth();
  const [socket, setSocket] = React.useState(null);
  // const { auth } = useAuth();

  useEffect(
    () => {
      if (!auth?.isLoggedIn || !auth?.user?._id) {
        console.log("⏸️ No authenticated user — skipping socket connection");
        if (socket) {
          socket.disconnect();
          setSocket(null);
        }
        return;
      }
      console.log(" Auth token changed — setting up new socket");
      // if (auth?.token) {
      const s = createSocket();
      s.on("connect", () => {
        console.log(`✅ Socket connected: ${s.id}`);
      });

      s.on("disconnect", (reason) => {
        console.warn(`❌ Socket disconnected: ${reason}`);
      });
      setSocket(s);

      return () => {
        console.log(" Cleaning up socket connection");
        s.disconnect();
      };
      // }
    },
    //  [auth?.token]
    [auth?.isLoggedIn, auth?.user?._id]
  );
  // useEffect(() => {
  //   if (!socket) return;
  //   const onConnect = () => console.log("🔌 Connected:", socket.id);

  //   const onDisconnect = () => console.log("❌ Disconnected from socket");

  //   socket.on("connect", onConnect);

  //   socket.on("disconnect", onDisconnect);

  //   return () => {
  //     socket.off("connect", onConnect);
  //     socket.off("disconnect", onDisconnect);
  //   };
  // }, [socket]);

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
