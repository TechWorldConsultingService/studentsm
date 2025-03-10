import React from "react";

const AssignmentCard = ({ assignment, actionText, onActionClick }) => {
  const { class_assigned, subject, assignment_name, description, due_date, assigned_on } = assignment;

  // Format assigned_on to YYYY-MM-DD
  const assignedDate = new Date(assigned_on).toISOString().split("T")[0];

  return (
    <div className="p-6 rounded-lg shadow-lg mb-4 border border-gray-300">
      <div className="flex flex-col space-y-2">
        <span>
          <strong className="text-purple-800 mr-2">Class:</strong>
          {class_assigned}
        </span>
        <span>
          <strong className="text-purple-800 mr-2">Subject:</strong>
          {subject}
        </span>
        <span>
          <strong className="text-purple-800 mr-2">Topic:</strong>
          {assignment_name}
        </span>
        <span>
          <strong className="text-purple-800 mr-2">Description:</strong>
          <span className="italic">{description}</span>
        </span>
        <span className="text-gray-500">Due: {due_date}</span>
        <span className="text-gray-500">Assign Date: {assignedDate}</span>
      </div>

      <button
        className="mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-800 transition-all duration-150"
        onClick={() => onActionClick(assignment)}
      >
        {actionText}
      </button>
    </div>
  );
};

export default AssignmentCard;
