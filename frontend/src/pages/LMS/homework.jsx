import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // For navigation to the assignment details page
import AssignmentItem from "./AssignmentItem";

const AssignmentPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

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
    setAssignments(mockAssignments);
  }, []);

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Separate the assignments into submitted and new
  const newAssignments = assignments.filter((assignment) => !assignment.submitted);
  const submittedAssignments = assignments.filter((assignment) => assignment.submitted);

  return (
    <div className=" bg-purple-100 py-8">
      <div className="container mx-auto p-4 bg-white shadow-xl rounded-lg">
        <h1 className="text-4xl font-extrabold text-center text-purple-800 mb-8 animate__animated animate__fadeIn">
          Your Assignments
        </h1>

        {assignments.length === 0 ? (
          <p className="text-center text-gray-600">No assignments available</p>
        ) : (
          <>
            <div className="space-y-6">
              {/* New Assignments */}
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">New Assignments</h2>
              {newAssignments.length === 0 ? (
                <p>No new assignments</p>
              ) : (
                newAssignments.map((assignment) => (
                  <div key={assignment.assignment_id} className="bg-white p-6 rounded-lg shadow-lg mb-4">
                    <h3 className="text-xl font-semibold text-purple-800">{assignment.title}</h3>
                    <p className="text-gray-600 mb-4">{assignment.description}</p>
                    <p className="text-gray-500 text-sm">Due Date: {assignment.due_date}</p>
                    <Link
                      to={`/assignment/${assignment.assignment_id}`}
                      className="text-blue-500 mt-4 inline-block"
                    >
                      View Assignment Details
                    </Link>
                    {/* Submit button for new assignments */}
                    <button
                      onClick={() => alert(`Submit ${assignment.title} assignment`)}
                      className="bg-blue-500 text-white p-2 rounded mt-4"
                    >
                      Submit Assignment
                    </button>
                  </div>
                ))
              )}

              {/* Submitted Assignments */}
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">Submitted Assignments</h2>
              {submittedAssignments.length === 0 ? (
                <p>No submitted assignments</p>
              ) : (
                submittedAssignments.map((assignment) => (
                  <div key={assignment.assignment_id} className="bg-white p-6 rounded-lg shadow-lg border border-gray-300 mb-4">
                    <h3 className="text-xl font-semibold text-purple-800">{assignment.title}</h3>
                    <p className="text-gray-600 mb-4">{assignment.description}</p>
                    <p className="text-gray-500 text-sm">Due Date: {assignment.due_date}</p>
                    <Link
                      to={`/assignment/${assignment.assignment_id}`}
                      className="text-blue-500 mt-4 inline-block"
                    >
                      View Assignment Details
                    </Link>
                    <p className="text-green-500 mt-2">Assignment Already Submitted</p>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssignmentPage;
