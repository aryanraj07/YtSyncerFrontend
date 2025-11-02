import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { toast } from "react-toastify";

export default function ChatBox({ roomId, username }) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const onReceive = (msg) => {
      const formatted = {
        sender: msg.sender || { username: msg.username || "Unknown" },
        message: msg.message || { text: msg.text || "" },
      };

      setMessages((prev) => [...prev, formatted]);

      if (formatted.sender.username !== username) {
        toast.info(`${formatted.sender.username}: ${formatted.message.text}`, {
          icon: "💬",
        });
      }
    };

    const onHistory = (msgs) => {
      const formatted = (msgs || []).map((m) => ({
        sender: m.sender || { username: m.username || "Unknown" },
        message: m.message || { text: m.text || "" },
      }));
      setMessages(formatted);
    };

    const onTyping = ({ user }) => {
      if (!user || user.username === username) return;
      setTypingUsers((prev) => {
        if (!prev.find((u) => u._id === user._id)) return [...prev, user];
        return prev;
      });
      setTimeout(
        () => setTypingUsers((prev) => prev.filter((u) => u._id !== user._id)),
        3000
      );
    };

    socket.emit("room:join", { roomId });
    socket.on("chat:receive", onReceive);
    socket.on("chat:history", onHistory);
    socket.on("chat:typing", onTyping);

    return () => {
      socket.off("chat:receive", onReceive);
      socket.off("chat:history", onHistory);
      socket.off("chat:typing", onTyping);
    };
  }, [socket, roomId, username]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    socket.emit("chat:send", { roomId, message: { text: input.trim() } });
    setInput("");
  };

  const handleTyping = () => {
    socket.emit("chat:typing", { roomId });
  };

  return (
    <div className="border rounded-lg shadow-sm w-full max-w-md mx-auto flex flex-col h-[450px]">
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 rounded-md ${
              m.sender.username === username
                ? "bg-blue-600 text-white self-end text-right"
                : "bg-gray-200 text-black self-start text-left"
            }`}
          >
            <p className="text-sm font-semibold">
              {m.sender.username === username ? "You" : m.sender.username}
            </p>
            <p>{m.message.text}</p>
          </div>
        ))}

        {typingUsers.length > 0 && (
          <p className="text-xs text-gray-500 italic">
            {typingUsers.map((u) => u.username).join(", ")} typing...
          </p>
        )}
        <div ref={chatEndRef} />
      </div>

      <form
        onSubmit={sendMessage}
        className="border-t p-2 flex items-center gap-2"
      >
        <input
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            handleTyping();
          }}
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
