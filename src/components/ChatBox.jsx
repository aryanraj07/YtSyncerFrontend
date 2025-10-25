import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { toast } from "react-toastify";

export default function ChatBox({ roomId, username }) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const onReceive = (msg) => {
      setMessages((prev) => [...prev, msg]);
      if (msg.username !== username)
        toast.info(`${msg.username}: ${msg.text}`, { icon: "💬" });
    };

    const onHistory = (msgs) => setMessages(msgs || []);

    socket.emit("chat:join", roomId);
    socket.on("chat:receive", onReceive);
    socket.on("chat:history", onHistory);

    return () => {
      socket.off("chat:receive", onReceive);
      socket.off("chat:history", onHistory);
    };
  }, [socket, roomId, username]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = { text: input.trim(), username };
    socket.emit("chat:send", { roomId, message: msg });
    setMessages((prev) => [...prev, msg]);
    setInput("");
  };

  return (
    <div className="border rounded-lg shadow-sm w-full max-w-md mx-auto flex flex-col h-[400px] ">
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-md ${
              m.username === username
                ? "bg-blue-600 self-end text-right"
                : "bg-gray-700 self-start text-left"
            }`}
          >
            <p className="text-sm font-semibold">
              {m.username === username ? "You" : m.username}
            </p>
            <p className="text-gray-700">{m.text}</p>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="border-t p-2 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border rounded-md p-2 text-sm"
        />
        <button type="submit" className="btn btn-dark px-3 py-1">
          Send
        </button>
      </form>
    </div>
  );
}
