import React, { useState } from "react";

const AssignmentItem = ({ assignment, selectedFile, handleFileChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate file submission (you can connect it to a backend later)
    setTimeout(() => {
      setIsSubmitting(false);
      alert("Assignment submitted successfully!");
    }, 1000);
  };

  return (
    <div className="bg-white shadow-md p-4 mb-4 rounded-lg">
      <h2 className="text-xl font-semibold">{assignment.title}</h2>
      <p className="text-gray-600">{assignment.description}</p>
      <p className="text-gray-400">Due: {assignment.due_date}</p>

      {assignment.submitted ? (
        <p className="text-green-500 mt-2">Assignment Already Submitted</p>
      ) : (
        <div className="mt-4">
          <input
            type="file"
            onChange={handleFileChange}
            className="mb-2 p-2 border rounded"
          />
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || isSubmitting}
            className="bg-blue-500 text-white p-2 rounded mt-2 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit Assignment"}
          </button>
        </div>
      )}
    </div>
  );
};

export default AssignmentItem;
