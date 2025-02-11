import React, { useState, useEffect } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8000/ws/chat/general/");
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };
    setSocket(ws);

    return () => ws.close();
  }, []);

  const sendMessage = () => {
    if (socket && message.trim() !== "") {
      socket.send(JSON.stringify({ message, receiver: "someuser" }));
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Chat</h2>
      <div style={{ height: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index}><b>{msg.sender}:</b> {msg.message}</div>
        ))}
      </div>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
