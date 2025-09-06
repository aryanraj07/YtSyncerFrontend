import React, { useEffect, useState } from "react";
import { socket } from "../socket/socket";
const Chat = () => {
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    // Listen for incoming messages
    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, []);
  const sendMessage = () => {
    socket.emit("send_message", { text: "Hello world!" });
  };
  return (
    <div>
      <button onClick={sendMessage}>Send</button>
      <ul>
        {messages.map((m, i) => (
          <li key={i}>{m.text}</li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
