import React, { useState } from "react";
import { DatePicker } from "antd";
import moment from "moment";
import toast from "react-hot-toast";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { useSelector } from "react-redux";

const ApplyLeaveModal = ({ isOpen, onClose, onApplyLeave }) => {
  const { is_ad } = useSelector((state) => state.user);

  const [leaveDate, setLeaveDate] = useState("");
  const [message, setMessage] = useState("");

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
    onApplyLeave(leaveDate, message);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white w-11/12 md:w-1/2 p-6 rounded shadow-lg relative">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          Apply for Leave
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-purple-800 mb-1">Leave Date:</label>
            {is_ad ? (
              <DatePicker
                format="YYYY-MM-DD"
                onChange={(date, dateString) => setLeaveDate(dateString)}
                disabledDate={(current) =>
                  current && current < moment().startOf("day")
                }
                className="w-full"
              />
            ) : (
              <NepaliDatePicker
                value={leaveDate}
                onChange={(date) => setLeaveDate(date)}
                inputClassName="p-2 border border-purple-300 rounded w-full"
                dateFormat="YYYY-MM-DD"
                language="ne"
                placeholder="Select Date"
              />
            )}
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

          <div className=" flex space-x-5 justify-center">
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
            >
              Submit
            </button>
            <button
              onClick={handleClose}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ApplyLeaveModal;
