import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import NoticeModal from "./NoticeModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const NoticeList = () => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
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
        { headers: { Authorization: `Bearer ${access}` } }
      );
      setNotices(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error(
          "Error fetching notices: " + (error.message || error.toString())
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, [access]);

  const openAddModal = () => {
    setSelectedNotice(null);
    setShowModal(true);
  };


  const openEditModal = (notice) => {
    setSelectedNotice(notice); 
    setShowModal(true);
  };


  const handleDelete = (notice) => {
    setSelectedNotice(notice);
    setShowDeleteModal(true);
  };

  const refreshAndCloseModals = () => {
    fetchNotices();
    setShowModal(false);
    setShowDeleteModal(false);
    setSelectedNotice(null);
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 min-h-screen p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Notices</h1>

          {/* Add Notice Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={openAddModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Send Notice
            </button>
          </div>

          {/* Notices Table */}
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
                    <th className="px-4 py-2 text-left">Subject</th>
                    <th className="px-4 py-2 text-left">Message</th>
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
                        {notice.class_field && notice.class_field.length > 0
                          ? notice.class_field.join(", ")
                          : "-"}
                      </td>

                      <td className="px-4 py-2">{notice.subject}</td>
                      <td className="px-4 py-2">{notice.message}</td>

                      <td className="px-4 py-2">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => openEditModal(notice)}
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

        <NoticeModal
          noticeData={selectedNotice}  
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          refreshNotices={refreshAndCloseModals}
        />

        {/* Confirm Delete Modal */}
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

export default NoticeList;
