import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { useSelector } from "react-redux";
import axios from "axios";
import { format } from "date-fns";
import moment from "moment";
import { RiDeleteBin5Line } from "react-icons/ri";
import toast from "react-hot-toast";

const MyLeaves = () => {
  const { access } = useSelector((state) => state.user);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Leaves
  const [leaveData, setLeaveData] = useState([]);
  const [newRequests, setNewRequests] = useState([]);
  const [updatedRequests, setUpdatedRequests] = useState([]);

  // Apply modal
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [applyLeaveDate, setApplyLeaveDate] = useState("");
  const [applyMessage, setApplyMessage] = useState("");

  // Edit modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editLeaveDate, setEditLeaveDate] = useState("");
  const [editMessage, setEditMessage] = useState("");

  // View modal
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [viewRecord, setViewRecord] = useState(null);

  const fetchMyLeaves = async () => {
    if (!access) {
      setErrorMessage("User is not authenticated.");
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        "http://localhost:8000/api/leave-applications/",
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );
      const pending = data.filter((l) => l.status === "Pending");
      const reviewed = data
        .filter((l) => ["Approved", "Disapproved"].includes(l.status))
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      setLeaveData(data);
      setNewRequests(pending);
      setUpdatedRequests(reviewed);
    } catch (err) {
      setErrorMessage("Error fetching leaves.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMyLeaves();
  }, [access]);

  // APPLY
  const openApplyModal = () => {
    setApplyLeaveDate("");
    setApplyMessage("");
    setApplyModalOpen(true);
  };
  const handleApplySubmit = async () => {
    if (!applyLeaveDate || !applyMessage) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8000/api/leave-applications/create/",
        { leave_date: applyLeaveDate, message: applyMessage },
        { headers: { Authorization: `Bearer ${access}` } }
      );
      toast.success("Leave applied successfully!");
      setApplyModalOpen(false);
      fetchMyLeaves();
    } catch (err) {
      toast.error("Error applying for leave.");
    }
  };

  // EDIT
  const openEditModal = (record) => {
    setEditId(record.id);
    setEditLeaveDate(record.leave_date);
    setEditMessage(record.message);
    setEditModalOpen(true);
  };
  const handleEditSubmit = async () => {
    if (!editLeaveDate || !editMessage) {
      toast.error("Please fill in all fields.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8000/api/leave-applications/${editId}/`,
        { leave_date: editLeaveDate, message: editMessage },
        { headers: { Authorization: `Bearer ${access}` } }
      );
      toast.success("Leave updated successfully!");
      setEditModalOpen(false);
      fetchMyLeaves();
    } catch (err) {
      toast.error("Error updating leave.");
    }
  };

  // VIEW
  const openViewModal = (record) => {
    setViewRecord(record);
    setViewModalOpen(true);
  };

  // DELETE
  const handleDelete = async (id) => {
    const confirmDel = window.confirm("Are you sure you want to delete?");
    if (!confirmDel) return;
    try {
      await axios.delete(`http://localhost:8000/api/leave-applications/${id}/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      toast.success("Leave deleted.");
      fetchMyLeaves();
    } catch (err) {
      toast.error("Error deleting leave.");
    }
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h1 className="text-3xl font-extrabold text-purple-800">My Leaves</h1>
          {errorMessage && <p className="mt-2 text-red-500">{errorMessage}</p>}
          {isLoading ? (
            <p className="mt-4 text-gray-600">Loading...</p>
          ) : (
            <>
              <div className="flex justify-end">
                <button
                  onClick={openApplyModal}
                  className="mt-4 bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
                >
                  Apply for Leave
                </button>
              </div>

              {/* Pending Requests */}
              <h4 className="text-purple-800 font-semibold text-lg mt-4">
                New Requests (Pending)
              </h4>
              {newRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white shadow mt-2">
                    <thead className="bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="p-3 text-sm text-left">Applied On</th>
                        <th className="p-3 text-sm text-left">Leave Date</th>
                        <th className="p-3 text-sm text-left">Message</th>
                        <th className="p-3 text-sm text-left">Status</th>
                        <th className="p-3 text-sm text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newRequests.map((req) => (
                        <tr key={req.id} className="border-b last:border-0">
                          <td className="p-3 text-sm">
                            {format(new Date(req.applied_on), "dd MMM yyyy")}
                          </td>
                          <td className="p-3 text-sm">
                            {format(new Date(req.leave_date), "dd MMM yyyy")}
                          </td>
                          <td className="p-3 text-sm">{req.message}</td>
                          <td className="p-3 text-sm">{req.status}</td>
                          <td className="p-3 text-sm">
                            <button
                              onClick={() => openViewModal(req)}
                              className="text-blue-600 underline mr-3"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openEditModal(req)}
                              className="bg-purple-700 text-white px-2 py-1 rounded mr-2"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(req.id)}
                              className="bg-red-700 text-white px-2 py-1 rounded"
                            >
                              <RiDeleteBin5Line />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-2 text-gray-600">No pending requests.</p>
              )}

              {/* Reviewed Requests */}
              <h4 className="text-purple-800 font-semibold text-lg mt-6">
                Reviewed Requests
              </h4>
              {updatedRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white shadow mt-2">
                    <thead className="bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="p-3 text-sm text-left">Leave Date</th>
                        <th className="p-3 text-sm text-left">Reviewed On</th>
                        <th className="p-3 text-sm text-left">Message</th>
                        <th className="p-3 text-sm text-left">Status</th>
                        <th className="p-3 text-sm text-left">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {updatedRequests.map((req) => (
                        <tr key={req.id} className="border-b last:border-0">
                          <td className="p-3 text-sm">
                            {format(new Date(req.leave_date), "dd MMM yyyy")}
                          </td>
                          <td className="p-3 text-sm">
                            {format(new Date(req.updated_at), "dd MMM yyyy")}
                          </td>
                          <td className="p-3 text-sm">{req.message}</td>
                          <td className="p-3 text-sm">{req.status}</td>
                          <td className="p-3 text-sm">
                            <button
                              onClick={() => openViewModal(req)}
                              className="text-blue-600 underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-2 text-gray-600">No reviewed requests.</p>
              )}
            </>
          )}
        </div>
      </div>

      {/* Apply Modal */}
      {applyModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-11/12 md:w-1/2 p-6 relative">
            <button
              onClick={() => setApplyModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-purple-800 mb-4">Apply for Leave</h2>
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block font-semibold text-sm mb-1">Leave Date</label>
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={applyLeaveDate}
                  min={moment().format("YYYY-MM-DD")}
                  onChange={(e) => setApplyLeaveDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-semibold text-sm mb-1">Message</label>
                <textarea
                  className="w-full border p-2 rounded"
                  rows="3"
                  value={applyMessage}
                  onChange={(e) => setApplyMessage(e.target.value)}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleApplySubmit}
                  className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-11/12 md:w-1/2 p-6 relative">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-purple-800 mb-4">Edit Leave</h2>
            <div className="flex flex-col space-y-4">
              <div>
                <label className="block font-semibold text-sm mb-1">Leave Date</label>
                <input
                  type="date"
                  className="w-full border p-2 rounded"
                  value={editLeaveDate}
                  min={moment().format("YYYY-MM-DD")}
                  onChange={(e) => setEditLeaveDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block font-semibold text-sm mb-1">Message</label>
                <textarea
                  className="w-full border p-2 rounded"
                  rows="3"
                  value={editMessage}
                  onChange={(e) => setEditMessage(e.target.value)}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button
                  onClick={handleEditSubmit}
                  className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
                >
                  Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModalOpen && viewRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg w-11/12 md:w-1/2 p-6 relative">
            <button
              onClick={() => setViewModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              ✕
            </button>
            <h2 className="text-xl font-bold text-purple-800 mb-4">Leave Details</h2>
            <p>
              <strong>Applied On:</strong>{" "}
              {format(new Date(viewRecord.applied_on), "dd MMM yyyy")}
            </p>
            <p>
              <strong>Leave Date:</strong>{" "}
              {format(new Date(viewRecord.leave_date), "dd MMM yyyy")}
            </p>
            <p>
              <strong>Message:</strong> {viewRecord.message}
            </p>
            <p>
              <strong>Status:</strong> {viewRecord.status}
            </p>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default MyLeaves;
