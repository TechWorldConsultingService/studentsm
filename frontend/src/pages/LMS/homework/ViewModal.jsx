import React from "react";

const ViewModal = ({ assignment, handleClose, submission }) => {
  console.log(assignment)
  if (!assignment) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
    <div className="p-6 bg-white shadow-lg rounded-lg">
      <h2 className=" text-xl font-semibold text-purple-800 mb-4">
        Homework:{" "} {assignment.assignment_name}
      </h2>
      <div className="flex flex-col space-y-1">
      <span className="mb-1">
        <strong className="text-purple-800">Class:{" "}</strong> {assignment.class_assigned}
      </span>
      <span className="mb-1">
        <strong className="text-purple-800">Subject:</strong> {assignment.subject}
      </span>
      <span className="mb-1">
        <strong className="text-purple-800">Topic:{" "}</strong> {assignment.assignment_name}
      </span>
      <span className="mb-1">
        <strong className="text-purple-800">Description:{" "}</strong> {assignment.description}
      </span>
      <span className="mb-1">
        <strong className="text-purple-800">Due Date:{" "}</strong> {assignment.due_date}
      </span>
      <span className="mb-1">
        <strong className="text-purple-800">Assign Date:{" "}</strong>{new Date(assignment.assigned_on).toISOString().split("T")[0]}
      </span>

      <span className="mb-1">
        <strong className="text-purple-800">Submission Status:</strong>{" "}
        {submission ? "Submitted" : "Not Submitted"}
      </span>
      </div>
     

      {/* Displaying submission details if available */}
      {submission && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-purple-800 mb-2">
            Your Submission:
          </h3>
          {submission.file ? (
            <div>
              <strong>File:</strong>{" "}
              <a
                href={submission.file}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-600 underline"
              >
                Download File
              </a>
            </div>
          ) : (
            <div>
              <strong>Text:</strong>
              <p className="whitespace-pre-line">{submission.text}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-4 w-full flex justify-center">
        <button
          onClick={handleClose}
          className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-800"
        >
          Close
        </button>
      </div>
    </div>
    </div>
  );
};

export default ViewModal;
