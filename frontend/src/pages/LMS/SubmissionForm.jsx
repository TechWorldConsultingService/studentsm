import React, { useState } from "react";

const SubmissionFormPage = () => {
  const [assignment] = useState({
    title: "Math Assignment 1",
    description: "Solve the algebra problems.",
    due_date: "2024-12-10",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage("Please select a file to submit.");
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setMessage("Assignment submitted successfully!");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-purple-100 py-8">
      <div className="container mx-auto p-4 bg-white shadow-2xl rounded-lg">
        <h1 className="text-4xl font-extrabold text-center text-purple-800 mb-8">
          Submit Your Assignment
        </h1>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-purple-800">{assignment.title}</h2>
          <p className="text-gray-600">{assignment.description}</p>
          <p className="text-gray-500 text-sm">Due Date: {assignment.due_date}</p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="block text-gray-700 font-semibold">Upload Your Assignment</label>
              <input
                type="file"
                onChange={handleFileChange}
                className="mt-2 p-3 border border-gray-300 rounded w-full hover:border-purple-500"
              />
            </div>

            {message && (
              <div
                className={`mt-2 text-center ${message.includes("successfully") ? "text-green-500" : "text-red-500"}`}
              >
                {message}
              </div>
            )}

            <div className="mt-4 flex justify-center">
              <button
                type="submit"
                className="bg-purple-800 text-white py-3 px-6 rounded-lg hover:bg-purple-700 disabled:opacity-50"
                disabled={!selectedFile || isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit Assignment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SubmissionFormPage;
