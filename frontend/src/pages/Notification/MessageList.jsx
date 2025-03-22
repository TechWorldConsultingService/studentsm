import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import MessageModal from "./MessageModal";

const MessageList = () => {
  const { access, user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const fetchMessages = async () => {
    if (!access) {
      toast.error("User not authenticated.");
      return;
    }
    setLoading(true);

    try {
      const { data } = await axios.get("http://localhost:8000/api/messages/personal/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setMessages(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error fetching messages: " + (error.message || error.toString()));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [access]);

  const sortedMessages = [...messages].sort(
    (a, b) => new Date(b.sent_at) - new Date(a.sent_at)
  );


  const openAddForm = () => {
    setShowAddModal(true);
  };

  const refreshAndCloseModals = () => {
    fetchMessages();
    setShowAddModal(false);
  };


  const renderTime = (isoString) => {
    if (!isoString) return "N/A";
    const dateObj = new Date(isoString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };


  return (
    <MainLayout>
      <div className="bg-purple-50 min-h-screen p-4 md:p-6">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg border border-purple-300 p-4 md:p-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-extrabold text-purple-800">Messages</h1>
            <button
              onClick={openAddForm}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Send New Message
            </button>
          </div>

          {loading ? (
            <div className="text-center text-gray-600 mt-6">Loading messages...</div>
          ) : sortedMessages.length === 0 ? (
            <div className="text-center text-gray-600 mt-6">No messages found.</div>
          ) : (
            <div className="flow-root mt-6">
              <ul role="list" className="-mb-8">
                {sortedMessages.map((msg, index) => {
                  const senderName = msg?.sender
                    ? `${msg.sender.first_name} ${msg.sender.last_name}`
                    : "Unknown Sender";
                  const receiverName = msg?.receiver
                    ? `${msg.receiver.first_name} ${msg.receiver.last_name} (${msg.receiver.username})`
                    : "Unknown Receiver";
                  const isMeSender = msg.sender && msg.sender.id === user?.id;
                  const isLastItem = index === sortedMessages.length - 1;

                  return (
                    <li key={msg.id}>
                      <div className="relative pb-8">
                        {!isLastItem && (
                          <span
                            className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-300"
                            aria-hidden="true"
                          />
                        )}

                        <div className="relative flex items-start space-x-3">
                          <div>
                            <span className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center ring-8 ring-white text-white font-bold text-sm uppercase">
                              {senderName.charAt(0) || "U"}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1 rounded-lg bg-purple-50 px-4 py-3 hover:bg-purple-100 transition-colors duration-200">
                            <div className="flex justify-between items-center mb-1">
                              <p className="text-sm font-semibold text-purple-800">
                                {isMeSender ? "Me" : senderName}{" "}
                                <span className="ml-2 text-xs text-gray-500 font-normal">
                                  → {receiverName}
                                </span>
                              </p>
                              <p className="text-xs text-gray-500">{renderTime(msg.sent_at)}</p>
                            </div>
                            <p className="text-gray-700 ">
                              Subject:  {msg.subject || "No subject provided."}
                            </p>

                            <p className="text-gray-700 pt-2 text-sm whitespace-pre-line">
                              {msg.message || "No message provided."}
                            </p>

                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </div>

        {showAddModal && (
          <MessageModal
            onClose={() => setShowAddModal(false)}
            refreshMessages={refreshAndCloseModals}
          />
        )}

      </div>
    </MainLayout>
  );
};

export default MessageList;
