import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import AddNoticeModal from "./AddNoticeModal";
import EditNoticeModal from "./EditNoticeModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const TeacherNotice = () => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedNotice, setSelectedNotice] = useState(null);

  const fetchNotices = async () => {
    if (!access) {
      toast.error("User not authenticated.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/messages/role-based/",
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );
      // Optionally, you can add filtering logic here if you only want to show certain notices.
      setNotices(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error fetching notices: " + (error.message || error));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [access, navigate]);

  const handleEdit = (notice) => {
    setSelectedNotice(notice);
    setShowEditModal(true);
  };

  const handleDelete = (notice) => {
    setSelectedNotice(notice);
    setShowDeleteModal(true);
  };

  const refreshAndCloseModals = () => {
    fetchNotices();
    setShowAddModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedNotice(null);
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 min-h-screen p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Notices</h1>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Send Notice
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">
              All Notices
            </h2>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-gray-600">
              Loading notices...
            </div>
          ) : notices.length > 0 ? (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-4 py-2 text-left">Date</th>
                    <th className="px-4 py-2 text-left">Receiver Role</th>
                    <th className="px-4 py-2 text-left">Class</th>
                    <th className="px-4 py-2 text-left">Notice</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {notices.map((notice) => (
                    <tr key={notice.id} className="border-b hover:bg-purple-50">
                      <td className="px-4 py-2">
                        {new Date(notice.sent_at)
                          .toISOString()
                          .split("T")[0]}
                      </td>
                      <td className="px-4 py-2">{notice.receiver_role}</td>
                      <td className="px-4 py-2">
                        {notice.class_field || "-"}
                      </td>
                      <td className="px-4 py-2">{notice.message}</td>
                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEdit(notice)}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(notice)}
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
              No notices found.
            </div>
          )}
        </div>

        {/* Add Notice Modal */}
        {showAddModal && (
          <AddNoticeModal
            onClose={() => setShowAddModal(false)}
            refreshNotices={refreshAndCloseModals}
          />
        )}

        {/* Edit Notice Modal */}
        {showEditModal && selectedNotice && (
          <EditNoticeModal
            noticeData={selectedNotice}
            onClose={() => setShowEditModal(false)}
            refreshNotices={refreshAndCloseModals}
          />
        )}

        {/* Delete Confirmation Modal */}
        {showDeleteModal && selectedNotice && (
          <ConfirmDeleteModal
            itemName="notice"
            onClose={() => setShowDeleteModal(false)}
            onConfirm={async () => {
              try {
                await axios.delete(
                  `http://localhost:8000/api/messages/${selectedNotice.id}/`,
                  {
                    headers: {
                      Authorization: `Bearer ${access}`,
                    },
                  }
                );
                toast.success("Notice deleted successfully.");
                refreshAndCloseModals();
              } catch (err) {
                toast.error("Failed to delete the notice.");
              }
            }}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default TeacherNotice;
