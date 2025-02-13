import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const SubmitModal = ({ assignment, showModal, handleClose, onSubmit }) => {
  const { access } = useSelector((state) => state.user);
  const [submission_file, setSubmission_file] = useState(null);
  const [written_submission, setWritten_submission] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!assignment) {
    return null; // If there's no assignment, don't render the modal
  }

  const handleFileChange = (e) => {
    setSubmission_file(e.target.files[0]);
  };

  const handleTextChange = (e) => {
    setWritten_submission(e.target.value);
  };

  const handleSubmit = async () => {
    if (submission_file || written_submission) {
      setLoading(true);
      setError(""); // Clear any previous error

      // Create a FormData object to handle both file and text submission
      const formData = new FormData();
      formData.append("assignment_id", assignment.id);
      formData.append("written_submission", written_submission);

      // Append the file if it exists
      if (submission_file) {
        formData.append("submission_file", submission_file);
      }

      try {
        // Make the API request to submit the assignment
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

        // Check for success response
        if (response.status === 200) {
          alert("Assignment submitted successfully!");
          onSubmit({ submission_file, written_submission, assignment });
          handleClose();
        } else {
          throw new Error("Something went wrong!");
        }
      } catch (error) {
        setError(error.message || "Failed to submit assignment.");
      } finally {
        setLoading(false);
      }
    } else {
      alert("Please provide a submission (submission_file or written_submission).");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="p-6 bg-white shadow-lg rounded-lg">
        <h2 className=" text-xl font-semibold text-purple-800 mb-4">
          Homework: {assignment.assignment_name}
        </h2>
        <div className="flex flex-col space-y-1">
          <span className="mb-1">
            <strong className="text-purple-800">Class: </strong> {assignment.class_assigned}
          </span>
          <span className="mb-1">
            <strong className="text-purple-800">Subject:</strong> {assignment.subject}
          </span>
          <span className="mb-1">
            <strong className="text-purple-800">Topic: </strong> {assignment.assignment_name}
          </span>
          <span className="mb-1">
            <strong className="text-purple-800">Description: </strong> {assignment.description}
          </span>
          <span className="mb-1">
            <strong className="text-purple-800">Due Date: </strong> {assignment.due_date}
          </span>
          <span className="mb-1">
            <strong className="text-purple-800">Assign Date: </strong>
            {new Date(assignment.assigned_on).toISOString().split("T")[0]}
          </span>

          <div className="mb-3 mt-3">
            <label htmlFor="text" className=" text-gray-700 mb-3">
              <strong className="text-purple-800">Write Your Response:</strong>
            </label>
            <textarea
              id="written_submission"
              className="mt-2  w-full border border-purple-500 focus:border-purple-800 focus:outline-none focus:ring-0 focus:shadow-md"
              value={written_submission}
              onChange={handleTextChange}
              rows="4"
            />

            <div className="mb-4">
              <label htmlFor="file" className=" text-gray-700">
                <strong className="text-purple-800">OR Upload File:</strong>
              </label>
              <input
                type="file"
                id="submission_file"
                className="m-1  block w-full"
                onChange={handleFileChange}
              />
            </div>
          </div>
        </div>

        {/* Show loading or error */}
        {loading && <p>Submitting...</p>}
        <div className="flex justify-center space-x-5">
          <button
            onClick={handleSubmit}
            className="bg-purple-600 text-white py-2 px-4 rounded mr-2"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Submit"}
          </button>
          <button
            onClick={handleClose}
            className="bg-gray-300 text-black py-2 px-4 rounded"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitModal;
