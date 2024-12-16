import React, { useState } from "react";
import { Link } from "react-router-dom";

const ClassNotes = () => {
  // Sample data for previous tips or notes
  const [tips, setTips] = useState([
    {
      id: 1,
      title: "Homework Reminder",
      description: "Ensure all homework is submitted on time.",
      date: "2024-12-16",
    },
    {
      id: 2,
      title: "Exam Preparation Tips",
      description: "Study chapters 1-3 for the upcoming exam.",
      date: "2024-12-18",
    },
  ]);

  // Add new tip
  const handleDelete = (id) => {
    setTips(tips.filter((tip) => tip.id !== id));
  };

  return (
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">Subject Notes</h1>
        <p className="mt-4 text-gray-600">
          Explore the notes and resources available for your subject here.
        </p>

        {/* Add New Tip Button */}
        <div className="mt-6 text-center">
          <Link
            to="/new-tip"
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none"
          >
            Add New Tip
          </Link>
        </div>

        {/* Display Previous Tips in a Table */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-purple-700">
            Previous Tips and Notes
          </h2>
          {tips.length > 0 ? (
            <table className="min-w-full mt-4">
              <thead>
                <tr className="bg-purple-100 text-purple-700">
                  <th className="px-6 py-3 border">Title</th>
                  <th className="px-6 py-3 border">Date</th>
                  <th className="px-6 py-3 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {tips.map((tip) => (
                  <tr key={tip.id} className="border-b hover:bg-gray-100">
                    <td className="px-6 py-4">{tip.title}</td>
                    <td className="px-6 py-4">{tip.date}</td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/view-tip/${tip.id}`}
                        className="text-purple-700 hover:underline"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 mt-4">No tips available.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClassNotes;
