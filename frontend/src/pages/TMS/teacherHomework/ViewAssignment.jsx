import React from "react";

const ViewAssignment = ({ assignment, closeModal }) => {
  return (
    <div>
      <h3 className="text-xl font-bold mb-4">Assignment Details</h3>
      <div className="mb-2">
        <span className="font-semibold">ID:</span> {assignment.id}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Subject:</span> {assignment.subject}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Topic:</span> {assignment.assignment_name}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Description:</span> {assignment.description}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Due Date:</span> {assignment.due_date}
      </div>
      <div className="mb-2">
        <span className="font-semibold">Assigned On:</span>{" "}
        {new Date(assignment.assigned_on).toISOString().split("T")[0]}
      </div>
      <div className="flex justify-end mt-4">
        <button
          onClick={closeModal}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ViewAssignment;
