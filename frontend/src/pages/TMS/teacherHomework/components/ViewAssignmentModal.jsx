import React from "react";
import Modal from "./Modal";

const ViewAssignmentModal = ({ isOpen, onClose, assignment }) => {
  if (!assignment) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h3 className="text-2xl text-purple-800 font-bold mb-4">Assignment Details</h3>
      <div className="mb-2">
        <span className="font-semibold">Class:</span> {assignment.class_assigned}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Subject:</span> {assignment.subject}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Teacher:</span> {assignment.teacher}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Topic:</span> {assignment.assignment_name}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Description:</span>{" "}
        {assignment.description}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Due Date:</span> {assignment.due_date}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Assigned On:</span>{" "}
        {new Date(assignment.assigned_on).toISOString().split("T")[0]}
      </div>
      <div className="flex justify-center mt-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Close
        </button>
      </div>
    </Modal>
  );
};

export default ViewAssignmentModal;
