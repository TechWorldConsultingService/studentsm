import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AddMessageModal from "./AddMessageModal";
import EditMessageModal from "./EditMessageModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";


const PrincipalMessage = () => {
  const { access, user } = useSelector((state) => state.user); 
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const fetchMessages = async () => {
    if (!access) {
      toast.error("User not authenticated.");
      return;
    }
    setLoading(true);
    try {
      // GET user messages
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
        toast.error("Error fetching messages: " + (error.message || error));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [access, navigate]);

  // Handlers
  const handleEdit = (message) => {
    setSelectedMessage(message);
    setShowEditModal(true);
  };

  const handleDelete = (message) => {
    setSelectedMessage(message);
    setShowDeleteModal(true);
  };

  // After successful edit or add
  const refreshAndCloseModals = () => {
    fetchMessages();
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedMessage(null);
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 min-h-screen p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Messages</h1>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Send New Message
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">
              Your Messages
            </h2>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-gray-600">Loading messages...</div>
          ) : messages.length > 0 ? (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-4 py-2 text-left">Sender</th>
                    <th className="px-4 py-2 text-left">Receiver</th>
                    <th className="px-4 py-2 text-left">Message</th>
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map((msg) => (
                    <tr key={msg.id} className="border-b hover:bg-purple-50">
                      <td className="px-4 py-2">
                        {msg.sender?.username || "Unknown"}
                      </td>
                      <td className="px-4 py-2">
                        {msg.receiver?.username || "Unknown"}
                      </td>
                      <td className="px-4 py-2">{msg.message}</td>
                      <td className="px-4 py-2">
                        {new Date(msg.sent_at).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">
                        {/* Only show Edit/Delete if current user is sender */}
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(msg)}
                              className="text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(msg)}
                              className="text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="mt-6 text-center text-gray-600">
              No messages found.
            </div>
          )}
        </div>

        {/* Add Modal */}
        {showAddModal && (
          <AddMessageModal
            onClose={() => setShowAddModal(false)}
            refreshMessages={refreshAndCloseModals}
          />
        )}

        {/* Edit Modal */}
        {showEditModal && selectedMessage && (
          <EditMessageModal
            messageData={selectedMessage}
            onClose={() => setShowEditModal(false)}
            refreshMessages={refreshAndCloseModals}
          />
        )}

        {/* Delete Confirmation */}
        {showDeleteModal && selectedMessage && (
          <ConfirmDeleteModal
            itemName="message"
            onClose={() => setShowDeleteModal(false)}
            onConfirm={async () => {
              try {
                await axios.delete(
                  `http://localhost:8000/api/messages/${selectedMessage.id}/`,
                  {
                    headers: {
                      Authorization: `Bearer ${access}`,
                    },
                  }
                );
                toast.success("Message deleted successfully.");
                refreshAndCloseModals();
              } catch (err) {
                toast.error("Failed to delete the message.");
              }
            }}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default PrincipalMessage;
