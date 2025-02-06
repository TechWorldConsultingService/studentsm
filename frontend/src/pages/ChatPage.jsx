import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoMdSend } from "react-icons/io";

const ChatPage = () => {
  const { id } = useParams(); // Get chat ID from URL
  const navigate = useNavigate();

  const [messages, setMessages] = useState([
    { sender: "Alice", content: "Hey, how are you?", time: "10:00 AM" },
    { sender: "You", content: "I'm good, thanks! How about you?", time: "10:02 AM" },
    { sender: "Alice", content: "Doing great, let's catch up soon!", time: "10:05 AM" }
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([
        ...messages,
        { sender: "You", content: newMessage, time: new Date().toLocaleTimeString() }
      ]);
      setNewMessage("");
    }
  };

  return (
    <div className="chat-page flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="chat-header flex items-center gap-3 bg-blue-600 text-white p-4 shadow-lg">
        <button
          onClick={() => navigate(-1)}
          className="back-btn text-2xl focus:outline-none"
        >
          <IoIosArrowBack />
        </button>
        <h2 className="text-xl font-semibold">Chat with User {id}</h2>
      </div>

      {/* Chat Messages */}
      <div className="chat-window flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message flex ${
              message.sender === "You" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`message-content relative px-5 py-3 rounded-2xl shadow-md max-w-xs ${
                message.sender === "You"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <p>{message.content}</p>
              <span className="absolute bottom-0 right-2 text-xs text-gray-600">
                {message.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input Area */}
      <div className="message-input flex items-center bg-white p-4 border-t shadow-inner">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSendMessage}
          className="ml-4 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <IoMdSend className="text-xl" />
        </button>
      </div>
    </div>
  );
};

export default ChatPage;
