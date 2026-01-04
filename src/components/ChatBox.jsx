import React, { useEffect, useState, useRef } from "react";
import { useSocket } from "../context/SocketContext";
import { toast } from "react-toastify";

const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const TypingDots = () => (
  <div className="flex items-center gap-1 px-3 py-1">
    <span
      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
      style={{ animationDelay: "0s" }}
    />
    <span
      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
      style={{ animationDelay: "0.15s" }}
    />
    <span
      className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
      style={{ animationDelay: "0.3s" }}
    />
  </div>
);

export default function ChatBox({ roomId, username, userId }) {
  const socket = useSocket();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typingUsers, setTypingUsers] = useState([]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (!socket) return;

    const normalizeIncoming = (msg) => {
      // support shapes: msg, { chat }, or older shapes
      const payload = msg.chat || msg;
      const sender = payload.sender || {
        username: payload.username || "Unknown",
        _id: payload.sender?._id || payload.sender?._id,
      };
      const text =
        typeof payload.message === "string"
          ? payload.message
          : payload.message && typeof payload.message.text === "string"
          ? payload.message.text
          : payload.text || "";
      const time =
        payload.createdAt ||
        payload.updatedAt ||
        payload.ts ||
        new Date().toISOString();
      const id =
        payload._id || `${time}-${Math.random().toString(36).slice(2, 7)}`;
      return { sender, text, time, _id: id };
    };

    const onReceive = (msg) => {
      const formatted = normalizeIncoming(msg.chat || msg);
      const tempId = msg.tempId;
      setMessages((prev) => {
        if (tempId) {
          const idx = prev.findIndex((m) => m._id === tempId);
          if (idx !== -1) {
            const updated = [...prev];
            updated[idx] = formatted;
            return updated;
          }
        }
        if (prev.some((m) => m._id === formatted._id)) return prev;
        return [...prev, formatted];
      });
      if (formatted.sender.username !== username) {
        toast.info(`${formatted.sender.username}: ${formatted.text}`, {
          icon: "💬",
        });
      }
    };
    const onHistory = (msgs) => {
      const formatted = (msgs || []).map((m) => normalizeIncoming(m));
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
  }, [messages, typingUsers]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    // optimistic UI: push locally with timestamp; server will send canonical saved message later
    const tempId = `local-${Date.now()}`;
    const optimistic = {
      sender: { username, _id: "me" },
      text: input.trim(),
      time: new Date().toISOString(),
      _id: tempId,
      optimistic: true,
    };
    setMessages((prev) => [...prev, optimistic]);
    socket.emit("chat:send", {
      roomId,
      message: { text: input.trim() },
      tempId,
    });
    setInput("");
  };

  const handleTyping = () => {
    socket.emit("chat:typing", { roomId });
  };

  return (
    <div className="flex flex-col h-full relative bg-transparent">
      {/* Messages area */}

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-transparent pb-18 md:pb-10">
        {messages.map((m, i) => {
          const mine = m.sender?._id === userId || m.sender?._id === "me";
          return (
            <div
              key={m._id || i}
              className={`flex ${mine ? "justify-end" : "justify-start"}`}
            >
              {/* avatar */}
              {!mine && (
                <div className="mr-2 flex-shrink-0">
                  <div className="w-8 h-8 bg-gray-400 rounded-full text-xs flex items-center justify-center text-white">
                    {m.sender?.username?.[0]?.toUpperCase() || "U"}
                  </div>
                </div>
              )}

              <div
                className={`max-w-[85%] md:max-w-[70%] break-words px-3 py-2 rounded-xl shadow-sm flex flex-col ${
                  mine ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`${
                    mine
                      ? "bg-[#0b8f3b] text-white rounded-br-none"
                      : "bg-white text-black rounded-bl-none"
                  } px-3 py-2 rounded-lg`}
                >
                  <div className="text-sm font-medium mb-1">
                    {mine ? "You" : m.sender?.username || "Unknown"}
                  </div>
                  <div className="whitespace-pre-wrap text-base">{m.text}</div>
                </div>
                <div className="text-xs mt-1 text-gray-400">
                  {formatTime(m.time)}
                </div>
              </div>

              {mine && (
                <div className="ml-2 flex-shrink-0">
                  <div className="w-8 h-8 bg-green-600 rounded-full text-xs flex items-center justify-center text-white">
                    Y
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {typingUsers.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-white text-black px-3 py-2 rounded-xl rounded-bl-none shadow-sm">
              <div className="flex items-center gap-2">
                <TypingDots />
                <div className="text-xs text-gray-500">
                  {typingUsers.map((u) => u.username).join(", ")} typing…
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Fixed input bar */}
      <form
        onSubmit={sendMessage}
        className="sticky bottom-0  bg-[#0b0b0b] p-3 border-t border-[#2b2b2b] z-20"
        // style={{
        //   paddingBottom: "calc(env(safe-area-inset-bottom, 16px) + 8px)",
        // }}
      >
        <div
          className="max-w-md mx-auto flex items-center gap-2 rounded-full px-3 py-2 shadow-lg pb-chatbox glass"
          // style={{ backgroundColor: "#111", backdropFilter: "blur(6px)" }}
        >
          <input
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              handleTyping();
            }}
            placeholder="Type a message..."
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder-gray-400 h-chatt-input"
          />
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 text-white rounded-full px-4 py-2 text-sm"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}
