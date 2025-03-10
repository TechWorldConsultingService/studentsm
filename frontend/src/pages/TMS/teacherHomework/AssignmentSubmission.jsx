import React from "react";

const AssignmentSubmissions = ({ assignmentId, closeModal }) => {
  // Sample data for submissions
  const submissions = [
    {
      id: 1,
      student: "John Doe",
      status: "Submitted",
      submissionDate: "2024-12-15",
    },
    {
      id: 2,
      student: "Jane Smith",
      status: "Submitted",
      submissionDate: "2024-12-16",
    },
    {
      id: 3,
      student: "Alice Brown",
      status: "Not Submitted",
      submissionDate: "-",
    },
  ];

  return (
    <div className="bg-purple-50 p-6 min-w-[300px]">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800 mb-4">
          Submissions for Assignment {assignmentId}
        </h1>

        {/* Submission Table */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-purple-700">
            Student Submissions
          </h2>
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full table-auto">
              <thead>
                <tr>
                  <th className="border-b-2 border-purple-300 p-4 text-left text-purple-700">
                    Student
                  </th>
                  <th className="border-b-2 border-purple-300 p-4 text-left text-purple-700">
                    Status
                  </th>
                  <th className="border-b-2 border-purple-300 p-4 text-left text-purple-700">
                    Submission Date
                  </th>
                  <th className="border-b-2 border-purple-300 p-4 text-left text-purple-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {submissions.map((submission) => (
                  <tr key={submission.id}>
                    <td className="border-b border-purple-300 p-4">
                      {submission.student}
                    </td>
                    <td className="border-b border-purple-300 p-4">
                      {submission.status}
                    </td>
                    <td className="border-b border-purple-300 p-4">
                      {submission.submissionDate}
                    </td>
                    <td className="border-b border-purple-300 p-4">
                      <button className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 focus:outline-none">
                        Review
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Close Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={closeModal}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignmentSubmissions;
