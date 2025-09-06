import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import VideoPlayer from "../components/VideoPlayer";
import ChatBox from "../components/ChatBox";
import { useSocket } from "../context/SocketContext";
import { toast } from "react-toastify";

const Room = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [roomJoined, setRoomJoined] = useState(false);
  const socket = useSocket(); // ⬅️ consume from context
  const navigate = useNavigate();
  // Load room data
  useEffect(() => {
    const loadRoom = async () => {
      try {
        const res = await api.get(`/room/${roomId}`);
        setRoom(res.data.room);
      } catch (err) {
        console.error("Failed to load room data:", err);
      }
    };
    loadRoom();
  }, [roomId]);

  // Join room when socket is ready
  useEffect(() => {
    if (!socket || !room) return;

    if (socket.connected) {
      console.log("Already connected:", socket.id);
      socket.emit("room:join", { roomId });
    } else {
      socket.once("connect", () => {
        console.log("Connected to socket", socket.id);

        socket.emit("room:join", { roomId });
      });
    }
    socket.once("chat:history", () => {
      setRoomJoined(true);
    });

    socket.on("connect_error", async (err) => {
      console.error("Socket connect_error:", err.message, err);
      if (
        err.message === "Authentication error" ||
        err.message === "token_expired"
      ) {
        try {
          console.log("Trying to refresh token...");
          await api.post("/users/refresh-token");
          console.log("Refresh successful, reconnecting socket...");
          socket.connect();
        } catch (refreshErr) {
          console.error("Socket refresh failed", refreshErr);
          // window.location.href = "/login";
        }
      } else {
        console.warn("Unhandled connect_error:", err.message);
      }
    });
    const onUserJoined = ({ user }) => {
      //log user
      //toast notify
      toast.info(`${user?.username} joined the room`);
    };
    const onUserLeft = ({ user }) => {
      //log user
      //toast notify
      toast.info(`${user?.username} left the room`);
    };
    socket.on("room:user-joined", onUserJoined);
    socket.on("room:user-leave", onUserLeft);
    return () => {
      socket.off("connect_error");
      socket.off("room:user-joined");
      socket.off("room:user-leave");
      socket.off("chat:history");
    };
  }, [socket, room, roomId]);
  const leaveRoom = () => {
    socket.emit("room:leave", { roomId });
    navigate("/dashboard");
  };
  if (!room) return <div>Loading room...</div>;

  return (
    <div className="flex h-screen">
      <div className="flex-1">
        <VideoPlayer videoUrl={room.videoUrl} roomId={roomId} />
      </div>
      <div className="w-96 border-l">
        {socket && roomJoined && <ChatBox roomId={roomId} />}
      </div>
      <button onClick={leaveRoom} className="btn btn-danger px-4">
        Leave Room
      </button>
    </div>
  );
};

export default Room;
