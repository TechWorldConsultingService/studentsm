import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; 
import ClassLayout from "../../../layout/ClassLayout";

const AssignmentSubmissionsPage = () => {
  const { assignmentId } = useParams();
  const navigate = useNavigate();

  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:8000/api/assignments/${assignmentId}/submissions/`)
      .then((res) => res.json())
      .then((data) => {
        setSubmissions(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching submissions:", err);
        setLoading(false);
      });
  }, [assignmentId]);

  if (loading) {
    return (
      <ClassLayout>
        <div className="p-6 text-center">Loading submissions...</div>
      </ClassLayout>
    );
  }

  const submitted = submissions.filter((s) => s.status === "Submitted");
  const notSubmitted = submissions.filter((s) => s.status !== "Submitted");

  return (
    <ClassLayout>
      <div className="bg-purple-50 p-6 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800 mb-6">
            Submissions for Assignment #{assignmentId}
          </h1>

          {/* Buttons */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg"
            >
              &larr; Back
            </button>
          </div>

          {/* Submitted */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">
              Submitted ({submitted.length})
            </h2>
            {submitted.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {submitted.map((sub) => (
                  <div
                    key={sub.id}
                    className="border border-purple-200 rounded-md p-4 shadow-sm"
                  >
                    <p className="font-semibold">{sub.student_name}</p>
                    <p className="text-sm text-gray-600">
                      Submitted On: {sub.submissionDate}
                    </p>
                    <button
                      className="mt-2 text-white bg-purple-700 hover:bg-purple-800 px-3 py-1 rounded"
                      onClick={() => {
                        console.log("Review submission #", sub.id);
                      }}
                    >
                      Review Submission
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">No students have submitted yet.</p>
            )}
          </div>

          {/* Not Submitted */}
          <div>
            <h2 className="text-xl font-semibold text-purple-700 mb-4">
              Not Submitted ({notSubmitted.length})
            </h2>
            {notSubmitted.length > 0 ? (
              <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                {notSubmitted.map((sub) => (
                  <div
                    key={sub.id}
                    className="border border-red-200 rounded-md p-4 shadow-sm"
                  >
                    <p className="font-semibold">{sub.student_name}</p>
                    <p className="text-sm text-red-500">Not Submitted</p>
                    <button
                      className="mt-2 text-white bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                      onClick={() => {
                        console.log("Remind student #", sub.id);
                      }}
                    >
                      Send Reminder
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-600">All students have submitted.</p>
            )}
          </div>
        </div>
      </div>
    </ClassLayout>
  );
};

export default AssignmentSubmissionsPage;
