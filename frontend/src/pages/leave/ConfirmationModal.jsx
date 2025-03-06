// src/components/leaves/ConfirmationModal.js
import React from "react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, actionName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white w-11/12 md:w-1/2 p-6 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 bg-purple-700 text-white px-2 py-1 rounded hover:bg-purple-800"
        >
          ✕
        </button>
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          {`Are you sure you want to ${actionName} this request?`}
        </h2>
        <div className="text-center">
          <button
            onClick={onConfirm}
            className={`${
              actionName === "Approve"
                ? "bg-green-700 hover:bg-green-800"
                : "bg-red-700 hover:bg-red-800"
            } text-white px-6 py-2 rounded-lg mr-4`}
          >
            Yes, {actionName}
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
