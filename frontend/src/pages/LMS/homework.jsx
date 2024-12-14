import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const AssignmentPage = () => {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem("token");
        console.log(token)
        if (!token) {
          setError("You must be logged in to view assignments.");
          setLoading(false);
          return;
        }

        const response = await axios.get("http://localhost:8000/api/student/assignments/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setAssignments(response.data);
      } catch (err) {
        setError(
          err.response?.data?.error || "An error occurred while fetching assignments."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const AssignmentCard = ({ assignment, isSubmitted }) => (
    <div
      key={assignment.assignment_id}
      className={`p-6 rounded-lg shadow-lg mb-4 ${
        isSubmitted ? "border border-gray-300" : "bg-white"
      }`}
    >
      <h3 className="text-xl font-semibold text-purple-800">{assignment.title}</h3>
      <p className="text-gray-600 mb-4">{assignment.description}</p>
      <p className="text-gray-500 text-sm">Due Date: {assignment.due_date}</p>
      <Link
        to={`/assignment/${assignment.assignment_id}`}
        className="text-blue-500 mt-4 inline-block"
      >
        View Assignment Details
      </Link>
      {isSubmitted ? (
        <p className="text-green-500 mt-2">Assignment Already Submitted</p>
      ) : (
        <button
          onClick={() => alert(`Submit ${assignment.title} assignment`)}
          className="bg-blue-500 text-white p-2 rounded mt-4"
        >
          Submit Assignment
        </button>
      )}
    </div>
  );

  if (loading) {
    return <p className="text-center text-gray-600">Loading assignments...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (assignments.length === 0) {
    return <p className="text-center text-gray-600">No assignments available</p>;
  }

  const newAssignments = assignments.filter((assignment) => !assignment.submitted);
  const submittedAssignments = assignments.filter((assignment) => assignment.submitted);

  return (
    <div className="bg-purple-100 py-8">
      <div className="container mx-auto p-4 bg-white shadow-xl rounded-lg">
        <h1 className="text-4xl font-extrabold text-center text-purple-800 mb-8">
          Your Assignments
        </h1>

        <div className="space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-purple-800 mb-4">New Assignments</h2>
            {newAssignments.length === 0 ? (
              <p className="text-gray-600">No new assignments</p>
            ) : (
              newAssignments.map((assignment) => (
                <AssignmentCard assignment={assignment} isSubmitted={false} />
              ))
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-800 mb-4">Submitted Assignments</h2>
            {submittedAssignments.length === 0 ? (
              <p className="text-gray-600">No submitted assignments</p>
            ) : (
              submittedAssignments.map((assignment) => (
                <AssignmentCard assignment={assignment} isSubmitted={true} />
              ))
            )}
          </section>
        </div>
      </div>
    </div>
  );
};

export default AssignmentPage;
