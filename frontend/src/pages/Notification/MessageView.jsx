import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { FaUserCircle, FaPaperPlane } from "react-icons/fa";

const MessageView = () => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const formatDateTime = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleString();
  };

  const fetchMessages = async () => {
    if (!access) {
      toast.error("User not authenticated.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:8000/api/messages/user/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      setMessages(data);
    } catch (error) {
      toast.error("Failed to fetch messages");
      if (error.response?.status === 401) navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [access, navigate]);

  if (loading) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg font-semibold text-purple-600">Loading messages...</p>
        </div>
      </MainLayout>
    );
  }

  if (!messages.length) {
    return (
      <MainLayout>
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-gray-600">No messages found.</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="bg-purple-50 min-h-screen py-6 px-4 md:px-10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-4xl font-bold text-purple-700 mb-6 text-center">
            Message
          </h1>

          <div className="space-y-6">
            {[...messages].reverse().map((msg) => {
              const sender = msg.sender
                ? `${msg.sender.first_name} ${msg.sender.last_name} (${msg.sender.role})`
                : "Unknown Sender";

              return (
                <div
                  key={msg.id}
                  className="bg-white p-5 rounded-xl shadow-md border border-purple-200 transition hover:shadow-lg"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <FaUserCircle className="text-purple-500 text-xl" />
                      <span className="font-medium">From:</span> {sender}
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDateTime(msg.sent_at)}
                    </span>
                  </div>


                  {msg.subject && (
                    <div className="mb-2 text-sm">
                      <span className="font-semibold text-gray-700">Subject:</span>{" "}
                      <span className="text-gray-800">{msg.subject}</span>
                    </div>
                  )}

                  <div className="bg-purple-50 border border-purple-200 rounded-md p-4 text-gray-800 text-sm leading-relaxed whitespace-pre-line mt-3">
                    {msg.message || "No message content provided."}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default MessageView;
