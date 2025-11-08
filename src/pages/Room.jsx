import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axiosInstance";
import VideoPlayer from "../components/VideoPlayer";
import ChatBox from "../components/ChatBox";
import { useSocket } from "../context/SocketContext";
import { toast } from "react-toastify";
import InviteFriendsModal from "../components/Rooms/InviteFreindsModal";
import { useAuth } from "../context/AuthContext";

const Room = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [roomJoined, setRoomJoined] = useState(false);
  const socket = useSocket(); // ⬅️ consume from context
  const { auth } = useAuth();
  const [showInviteModal, setShowInviteModal] = useState(false);
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
  const [showChat, setShowChat] = useState(false);
  if (!room) return <div>Loading room...</div>;

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f] text-white">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-4 py-3 bg-[#181818] border-b border-[#2b2b2b] shadow-md">
        <h1 className="text-lg font-semibold tracking-wide flex items-center gap-2">
          🎬 {room?.name || "Watch Room"}
        </h1>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowChat((prev) => !prev)}
            className="md:hidden bg-[#2b2b2b] hover:bg-[#3a3a3a] px-3 py-1 rounded-lg text-sm transition"
          >
            💬 {showChat ? "Hide Chat" : "Show Chat"}
          </button>
          <button
            onClick={() => setShowInviteModal(true)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-lg text-sm font-medium transition"
          >
            Invite
          </button>
          <button
            onClick={leaveRoom}
            className="bg-red-600 hover:bg-red-700 px-4 py-1 rounded-lg text-sm font-medium transition"
          >
            Leave
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Chat Section */}
        <div
          className={`transition-all duration-300 bg-[#181818] border-r border-[#2b2b2b]
      ${showChat ? "w-80 md:w-96" : "hidden md:flex md:w-96"}
      flex flex-col h-[calc(100vh-60px)]`}
        >
          {socket && roomJoined && (
            <ChatBox
              username={auth?.user?.username}
              roomId={roomId}
              userId={auth?.user?._id}
            />
          )}
        </div>

        {/* Video Section */}
        <div className="flex-1 flex flex-col bg-black h-[calc(100vh-60px)]">
          <VideoPlayer videoUrl={room?.videoUrl} roomId={roomId} />

          {/* Overlay Title */}
          <div className="absolute bottom-3 left-4 bg-[#00000090] backdrop-blur-sm px-3 py-1 rounded-md text-sm text-gray-200">
            {room?.videoTitle || "Now Playing"}
          </div>
        </div>
      </div>
      {showInviteModal && (
        <InviteFriendsModal
          roomId={roomId}
          onClose={() => setShowInviteModal(false)}
        />
      )}
    </div>
  );
};

export default Room;
