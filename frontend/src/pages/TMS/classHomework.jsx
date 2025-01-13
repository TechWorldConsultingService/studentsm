import React, { useState } from 'react';
import NewAssignment from './NewAssignment'; // Import the NewAssignment component

const ClassHomework = () => {
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  const previousAssignments = [
    { id: 1, subject: 'Math', topics: 'Algebra', description: 'Complete exercises 1-10', dueDate: '2024-12-20' },
    { id: 2, subject: 'History', topics: 'WWII', description: 'Read chapters 5-8', dueDate: '2024-12-22' },
  ];

  const runningAssignments = [
    { id: 1, subject: 'Science', topics: 'Physics', description: 'Lab report on gravity', dueDate: '2024-12-18' },
  ];

  // Toggle modal visibility
  const toggleModal = () => setIsModalOpen(!isModalOpen);

  return (
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">Class Homework</h1>

        {/* New Assignment Button */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleModal}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none"
          >
            Create New Assignment
          </button>
        </div>

        {/* Running Assignments Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-purple-700">Running Assignments</h2>
          {runningAssignments.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {runningAssignments.map((assignment) => (
                <li key={assignment.id} className="p-4 border rounded-lg shadow-md hover:shadow-lg">
                  <strong className="block text-purple-800">{assignment.subject}</strong>
                  <span className="text-gray-600">{assignment.topics}</span>
                  <p className="italic text-gray-700 mt-2">{assignment.description}</p>
                  <span className="text-gray-500 block mt-2">Due: {assignment.dueDate}</span>
                  <a href={`/submissions/${assignment.id}`} className="text-purple-700 hover:underline mt-2 block">
                    View Submissions
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No running assignments.</p>
          )}
        </div>

        {/* Previously Given Assignments Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-purple-700">Previously Given Assignments</h2>
          {previousAssignments.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {previousAssignments.map((assignment) => (
                <li key={assignment.id} className="p-4 border rounded-lg shadow-md hover:shadow-lg">
                  <strong className="block text-purple-800">{assignment.subject}</strong>
                  <span className="text-gray-600">{assignment.topics}</span>
                  <p className="italic text-gray-700 mt-2">{assignment.description}</p>
                  <span className="text-gray-500 block mt-2">Due: {assignment.dueDate}</span>
                  <a href={`/submissions/${assignment.id}`} className="text-purple-700 hover:underline mt-2 block">
                    View Submissions
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No previously given assignments.</p>
          )}
        </div>

        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 relative">
              {/* Close Button */}
              <button
                onClick={toggleModal}
                className="absolute top-2 right-2 text-purple-700 hover:text-purple-900"
              >
                X
              </button>

              {/* New Assignment Form */}
              <NewAssignment closeModal={toggleModal} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassHomework;
