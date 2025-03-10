import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";


const SubmitModal = ({ assignment, handleClose, onSubmit, access }) => {
  const [submissionFile, setSubmissionFile] = useState(null);
  const [writtenSubmission, setWrittenSubmission] = useState("");
  const [loading, setLoading] = useState(false);

  if (!assignment) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      e.target.value = null; 
      return;
    }
    setSubmissionFile(file);
  };

  const handleTextChange = (e) => {
    setWrittenSubmission(e.target.value);
  };

  const handleSubmit = async () => {
    if (!submissionFile && !writtenSubmission.trim()) {
      toast.warn("Please provide a submission (file or written text).");
      return;
    }

    if (!window.confirm("Are you sure you want to submit this assignment?")) {
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("assignment_id", assignment.id);
    formData.append("written_submission", writtenSubmission);

    if (submissionFile) {
      formData.append("submission_file", submissionFile);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/submit-assignment/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Assignment submitted successfully!");
        onSubmit({
          file: submissionFile,
          text: writtenSubmission,
          assignment,
        });
        handleClose();
      }
    } catch (error) {
      toast.error(error?.response?.data?.detail || "Failed to submit assignment.");
    } finally {
      setLoading(false);
    }
  };

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
        <h2 className="text-xl font-semibold text-purple-800 mb-4">
          Submit Homework: {assignment.assignment_name}
        </h2>
        <div className="flex flex-col space-y-1">
          <span className="mb-1">
            <strong className="text-purple-800">Class:</strong>{" "}
            {assignment.class_assigned}
          </span>
          <span className="mb-1">
            <strong className="text-purple-800">Subject:</strong>{" "}
            {assignment.subject}
          </span>
          <span className="mb-1">
            <strong className="text-purple-800">Topic:</strong>{" "}
            {assignment.assignment_name}
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
            <strong className="text-purple-800">Assign Date:</strong>{" "}
            {new Date(assignment.assigned_on).toISOString().split("T")[0]}
          </span>

          {/* Written Text Submission */}
          <label htmlFor="written_submission" className="mt-3 font-semibold">
            Write Your Response:
          </label>
          <textarea
            id="written_submission"
            className="mt-1 w-full border border-purple-400 focus:border-purple-600 focus:outline-none focus:ring-0 focus:shadow-md p-2"
            value={writtenSubmission}
            onChange={handleTextChange}
            rows="4"
            placeholder="Type your homework answer here..."
          />

          {/* File Upload Submission */}
          <label htmlFor="submission_file" className="mt-3 font-semibold">
            OR Upload File:
          </label>
          <input
            type="file"
            id="submission_file"
            className="mt-1 block w-full border-none"
            onChange={handleFileChange}
          />
        </div>

        {loading && (
          <p className="text-purple-700 mt-2 font-medium">
            Submitting, please wait...
          </p>
        )}

        <div className="flex justify-center space-x-5 mt-4">
          <button
            onClick={handleSubmit}
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-800 transition-all duration-150"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button
            onClick={handleClose}
            className="bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 transition-all duration-150"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
