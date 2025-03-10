import React from "react";

const ViewModal = ({ assignment, handleClose, submission }) => {
  if (!assignment) return null;

  return (
    <div
      className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50
                 transition-opacity animate-fadeIn"
    >
      <div
        className="p-6 bg-white shadow-lg rounded-lg w-11/12 sm:w-1/2 relative 
                   transition-transform transform animate-popIn"
      >
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 text-2xl text-purple-700 hover:text-purple-900"
        >
          &times;
        </button>
        <h2 className=" text-xl font-semibold text-purple-800 mb-4">
          Homework Details
        </h2>
        <div className="flex flex-col space-y-1">
          <span className="mb-1">
            <strong className="text-purple-800">Topic:</strong>{" "}
            {assignment.assignment_name}
          </span>
          <span className="mb-1">
            <strong className="text-purple-800">Class:</strong>{" "}
            {assignment.class_assigned}
          </span>
          <span className="mb-1">
            <strong className="text-purple-800">Subject:</strong>{" "}
            {assignment.subject}
          </span>
          <span className="mb-1">
            <strong className="text-purple-800">Description:</strong>{" "}
            {assignment.description}
          </span>
          <span className="mb-1">
            <strong className="text-purple-800">Due Date:</strong>{" "}
            {assignment.due_date}
          </span>
          <span className="mb-1">
            <strong className="text-purple-800">Assigned Date:</strong>{" "}
            {new Date(assignment.assigned_on).toISOString().split("T")[0]}
          </span>
          <span className="mb-1">
            <strong className="text-purple-800">Submission Status:</strong>{" "}
            {submission ? "Submitted" : "Not Submitted"}
          </span>
        </div>

        {/* Display any local "submission" data */}
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
                  Click to View/Download
                </a>
              </div>
            ) : (
              <div>
                <strong>Written Text:</strong>
                <p className="whitespace-pre-line mt-1 border border-gray-200 rounded p-2">
                  {submission.text}
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-6 w-full flex justify-center">
          <button
            onClick={handleClose}
            className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-800 transition-all duration-150"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewModal;
