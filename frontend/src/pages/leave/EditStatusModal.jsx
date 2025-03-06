import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

const EditStatusModal = ({ isOpen, onClose, leaveRecord, onUpdateStatus }) => {
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    if (leaveRecord && (leaveRecord.status === "Approved" || leaveRecord.status === "Disapproved")) {
      setNewStatus(leaveRecord.status);
    } else {
      setNewStatus("");
    }
  }, [leaveRecord]);

  const handleClose = () => {
    setNewStatus("");
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newStatus) {
      toast.error("Please select a status.");
      return;
    }
    // Call parent function to update the status
    onUpdateStatus(leaveRecord.id, newStatus);
    handleClose();
  };

  if (!isOpen || !leaveRecord) return null;
  if (
    leaveRecord.status !== "Approved" &&
    leaveRecord.status !== "Disapproved"
  ) {
    // Only show this modal if record is currently Approved or Disapproved
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-11/12 md:w-1/2 p-6 rounded shadow-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 bg-purple-700 text-white px-2 py-1 rounded hover:bg-purple-800"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Edit Leave Status</h2>

        <p className="mb-4 text-gray-600">
          Change the status from <strong>{leaveRecord.status}</strong> to
          either <strong>Approved</strong> or <strong>Disapproved</strong>.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 text-purple-800">New Status:</label>
            <select
              className="border w-full rounded p-2"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
            >
              <option value="Approved">Approved</option>
              <option value="Disapproved">Disapproved</option>
            </select>
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
            >
              Update Status
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStatusModal;
