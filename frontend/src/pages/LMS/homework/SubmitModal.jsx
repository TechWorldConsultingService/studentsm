import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const SubmitModal = ({ assignment, access, onSubmit, onClose }) => {
  const [submissionFile, setSubmissionFile] = useState(null);
  const [writtenSubmission, setWrittenSubmission] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);

  if (!assignment) return null;

  useEffect(() => {
    const checkSubmissionStatus = async () => {
      if (!assignment) return null;
      try {
        const response = await axios.get(
          `http://localhost:8000/api/check-submission/${assignment.id}/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setHasSubmitted(response.data.submitted); // Set the submission status
      } catch (error) {
        toast.error("Failed to check submission status.");
      }
    };

    checkSubmissionStatus();
  }, [assignment, access]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit.");
      e.target.value = null;
      return;
    }
    setSubmissionFile(file);
  };

  const handleSubmit = async () => {
    if (!submissionFile && !writtenSubmission.trim()) {
      toast.warn("Please provide a submission (file or text).");
      return;
    }
    if (!window.confirm("Are you sure you want to submit?")) return;

    setLoading(true);
    const formData = new FormData();
    formData.append("assignment_id", assignment.id);
    formData.append("written_submission", writtenSubmission);
    if (submissionFile) formData.append("submission_file", submissionFile);

    try {
      await axios.post("http://localhost:8000/api/submit-assignment/", formData, {
        headers: {
          Authorization: `Bearer ${access}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Assignment submitted!");
      onSubmit({ file: submissionFile, text: writtenSubmission, assignment });
      onClose();
    } catch (error) {
      toast.error("Failed to submit assignment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-70 flex items-center justify-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          SUBMIT: {assignment.assignment_name}
        </h2>

        <div className="text-sm space-y-1 mb-4">
          <div>
            <strong>Class:</strong> {assignment.class_assigned}
          </div>
          <div>
            <strong>Subject:</strong> {assignment.subject}
          </div>
          <div>
            <strong>Due Date:</strong> {assignment.due_date}
          </div>
        </div>

        {hasSubmitted ? (
          <div className="text-green-500">You have already submitted this assignment.</div>
        ) : (
          <>
            {/* Written text area */}
            <label className="block font-semibold mb-2" htmlFor="written_submission">
              Write your response:
            </label>
            <textarea
              id="written_submission"
              rows={4}
              value={writtenSubmission}
              onChange={(e) => setWrittenSubmission(e.target.value)}
              className="w-full p-2 border border-purple-300 rounded mb-4"
              placeholder="Type your answer..."
            />

            {/* File upload */}
            <label className="block font-semibold mb-2" htmlFor="file_input">
              Or upload file:
            </label>
            <input
              id="file_input"
              type="file"
              onChange={handleFileChange}
              className="mb-4"
            />

            {loading && <p className="text-purple-600 mb-2">Submitting...</p>}

            <div className="flex justify-center space-x-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded"
              >
                {loading ? "Submitting..." : "Submit"}
              </button>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded mt-4"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default SubmitModal;
