// src/components/ChatBox.jsx
import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { useSocket } from "../context/SocketContext";

export default function ChatBox({ roomId }) {
  const socket = useSocket();
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState("");

  // useEffect(() => {
  //   const fetchHistory = async () => {
  //     const res = await api.get(`/chat/${roomId}`);
  //     setMsgs(res.data.msgs || []);
  //   };
  //   fetchHistory();
  // }, [roomId]);

  useEffect(() => {
    if (!socket) return;
    const onReceive = (msg) => setMsgs((p) => [...p, msg]);
    const onTyping = ({ user }) => {
      setTyping(user.username);
      // after 2s remove indicator
      console.log("Bhai is typing");

      setTimeout(() => setTyping(null), 2000);
    };
    socket.on("chat:receive", onReceive);
    socket.on("chat:history", (history) => {
      setMsgs(history);
    });
    socket.on("chat:typing", onTyping);

    return () => {
      socket.off("chat:receive");
      socket.off("chat:history");
      socket.off("chat:typing");
    };
  }, [socket]);

  const send = () => {
    if (!text.trim() || !socket) return;

    socket.emit("chat:send", { roomId, message: text });
    setText("");
  };
  console.log(typing);

  return (
    <div className="p-3 flex flex-col h-full">
      <div className="flex-1 overflow-auto mb-2">
        {msgs.map((m) => (
          <div key={m._id || Math.random()} className="mb-2">
            <b>{m.sender?.username || "You"}</b>: {m.message}
          </div>
        ))}
        {typing && (
          <p>
            <i>{typing} is typing...</i>
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <input
          className="flex-1 p-2 border"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            socket.emit("chat:typing", { roomId });
          }}
        />
        <button
          onClick={send}
          className=" btn btn-primary px-4  "
          disabled={!text.trim() || !socket}
        >
          Send
        </button>
      </div>
    </div>
  );
}
