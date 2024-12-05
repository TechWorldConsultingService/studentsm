import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; // To get the assignment ID from the URL

const AssignmentDetailPage = () => {
  const { assignmentId } = useParams(); // Access assignmentId from the URL
  const [assignment, setAssignment] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  // Mock assignments data
  const mockAssignments = [
    {
      assignment_id: 1,
      title: "Math Assignment 1",
      description: "Solve the algebra problems.",
      due_date: "2024-12-10",
      status: "assigned",
      submitted: false,
    },
    {
      assignment_id: 2,
      title: "English Essay",
      description: "Write an essay about your favorite book.",
      due_date: "2024-12-15",
      status: "assigned",
      submitted: true,
    },
  ];

  useEffect(() => {
    // Fetch the assignment based on the ID from the URL
    const selectedAssignment = mockAssignments.find(
      (assignment) => assignment.assignment_id === parseInt(assignmentId)
    );
    setAssignment(selectedAssignment);
  }, [assignmentId]);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      setMessage("Please select a file to submit.");
      return;
    }

    setIsSubmitting(true);
    // Simulate file upload
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage("Assignment submitted successfully!");
    }, 1500);
  };

  if (!assignment) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-purple-100 py-8">
      <div className="container mx-auto p-4 bg-white shadow-xl rounded-lg">
        <h1 className="text-4xl font-extrabold text-center text-purple-800 mb-8">Assignment Details</h1>
        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-300">
          <h2 className="text-2xl font-semibold text-purple-800">{assignment.title}</h2>
          <p className="text-gray-600 mb-4">{assignment.description}</p>
          <p className="text-gray-500 text-sm">Due Date: {assignment.due_date}</p>
          <p className="text-gray-500 text-sm">Status: {assignment.submitted ? "Submitted" : "Not Submitted"}</p>

          {assignment.submitted ? (
            <p className="text-green-500 mt-2">Assignment Already Submitted</p>
          ) : (
            <div className="mt-6">
              <label className="block text-gray-700">Upload Your Assignment</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-2 p-2 border rounded w-full"
              />
              {message && (
                <div className={`mt-2 text-center ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}>
                  {message}
                </div>
              )}
              <button
                onClick={handleSubmit}
                disabled={!selectedFile || isSubmitting}
                className="bg-blue-500 text-white py-2 px-4 rounded mt-4 disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit Assignment"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AssignmentDetailPage;
