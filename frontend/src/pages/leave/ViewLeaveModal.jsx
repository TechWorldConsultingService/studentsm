// src/components/leaves/ViewLeaveModal.js
import React from "react";
import { format } from "date-fns";

const ViewLeaveModal = ({ isOpen, onClose, leaveRecord }) => {
  if (!isOpen || !leaveRecord) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40">
      <div className="bg-white w-11/12 md:w-1/2 p-6 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-purple-700 text-white px-2 py-1 rounded hover:bg-purple-800"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-purple-800">Leave Details</h2>
        <div className="mt-4 space-y-2">
          <p>
            <strong>Applicant Name:</strong> {leaveRecord.applicant_name}
          </p>
          <p>
            <strong>Role:</strong> {leaveRecord.applicant_type}
          </p>
          <p>
            <strong>Applied On:</strong>{" "}
            {leaveRecord.applied_on
              ? format(new Date(leaveRecord.applied_on), "yyyy-MM-dd")
              : "N/A"}
          </p>
          <p>
            <strong>Leave Date:</strong>{" "}
            {leaveRecord.leave_date
              ? format(new Date(leaveRecord.leave_date), "yyyy-MM-dd")
              : "N/A"}
          </p>
          <p>
            <strong>Message:</strong> {leaveRecord.message}
          </p>
          <p>
            <strong>Status:</strong> {leaveRecord.status}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ViewLeaveModal;
