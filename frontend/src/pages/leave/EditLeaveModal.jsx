// src/components/leaves/EditLeaveModal.js
import React, { useState, useEffect } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import toast from "react-hot-toast";

const EditLeaveModal = ({ isOpen, onClose, leaveRecord, onUpdateLeave }) => {
  const [dateValue, setDateValue] = useState("");
  const [messageValue, setMessageValue] = useState("");

  useEffect(() => {
    if (leaveRecord) {
      setDateValue(leaveRecord.leave_date || "");
      setMessageValue(leaveRecord.message || "");
    }
  }, [leaveRecord]);

  const handleClose = () => {
    setDateValue("");
    setMessageValue("");
    onClose();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!dateValue || !messageValue) {
      toast.error("Please fill all fields.");
      return;
    }
    onUpdateLeave(leaveRecord.id, dateValue, messageValue);
    handleClose();
  };

  if (!isOpen || !leaveRecord) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white w-11/12 md:w-1/2 p-6 rounded shadow-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 bg-purple-700 text-white px-2 py-1 rounded hover:bg-purple-800"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          Edit Leave (ID: {leaveRecord.id})
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-800 mb-1">Leave Date:</label>
            <DatePicker
              format="YYYY-MM-DD"
              value={dateValue ? moment(dateValue) : null}
              onChange={(date, dateString) => setDateValue(dateString)}
              disabledDate={(current) => current && current < moment().startOf("day")}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-purple-800 mb-1">Message:</label>
            <textarea
              className="w-full border rounded p-2"
              rows={4}
              value={messageValue}
              onChange={(e) => setMessageValue(e.target.value)}
            />
          </div>

          <div className="text-center">
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditLeaveModal;
