import { io } from "socket.io-client";

let socket;
const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8000"
    : "https://playnchat.onrender.com";

export const createSocket = () => {
  if (socket) {
    socket.disconnect(); //existing socket found disconnecting old one
    socket = null;
  }
  // if (!token) {
  //   console.warn("No token provided for socket connection");
  //   return null;
  // }
  console.log("🔌 Creating new socket connection...");
  socket = io(API_URL, {
    transports: ["websocket"],
    // auth: { token },
    withCredentials: true,
    reconnectionAttempts: 5, // try reconnecting up to 5 times
    reconnectionDelay: 2000, // wait 2 seconds between attempts
  });
  socket.on("connect", () => {
    console.log(`Socket connected,${socket.id}`);
  });
  socket.on("disconnect", (reason) => {
    console.log(`Socket disconnected,${reason}`);
  });
  socket.on("reconnect-attempt", (attempt) => {
    console.log(`Reconnect attempt,${attempt}`);
  });
  return socket;
};
export const getSocket = () => socket;
