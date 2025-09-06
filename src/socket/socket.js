import { io } from "socket.io-client";

let socket;

export const createSocket = (token) => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  console.log("🔌 Creating new socket connection...");
  socket = io("https://playnchat.onrender.com", {
    transports: ["websocket"],
    auth: { token },
    autoConnect: true,
  });

  return socket;
};
