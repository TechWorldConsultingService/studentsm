// src/components/leaves/ApplyLeaveModal.js
import React, { useState } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import toast from "react-hot-toast";

const ApplyLeaveModal = ({ isOpen, onClose, onApplyLeave }) => {
  const [leaveDate, setLeaveDate] = useState("");
  const [message, setMessage] = useState("");

  // If the modal closes, reset local state:
  const handleClose = () => {
    setLeaveDate("");
    setMessage("");
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!leaveDate || !message) {
      toast.error("Please fill all fields.");
      return;
    }
    // Call parent function to actually do the API request
    onApplyLeave(leaveDate, message);
    handleClose(); // close modal
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white w-11/12 md:w-1/2 p-6 rounded shadow-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 bg-purple-700 text-white px-2 py-1 rounded hover:bg-purple-800"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Apply for Leave</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-800 mb-1">Leave Date:</label>
            <DatePicker
              format="YYYY-MM-DD"
              onChange={(date, dateString) => setLeaveDate(dateString)}
              disabledDate={(current) => current && current < moment().startOf("day")}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-purple-800 mb-1">Message:</label>
            <textarea
              className="w-full border rounded p-2"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Reason for leave..."
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;
