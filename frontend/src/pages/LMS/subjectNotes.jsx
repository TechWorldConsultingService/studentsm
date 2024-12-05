import React from "react";
import SubjectLayout from "../../layout/SubjectLayout";

const SubjectNotes = () => {
  return (
      <div className="bg-purple-50 p-6 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">
            Subject Notes
          </h1>
          <p className="mt-4 text-gray-600">
            Explore the notes and resources available for your subject here.
          </p>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">What You Will Find</h2>
            <p className="text-gray-600 mt-2">
              Browse through lecture notes, reference materials, and study guides for better understanding of the subject.
            </p>
          </div>

          <div className="mt-6 text-center">
            <button className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none">
              View Notes
            </button>
          </div>
        </div>
      </div>
  );
};

export default SubjectNotes;
