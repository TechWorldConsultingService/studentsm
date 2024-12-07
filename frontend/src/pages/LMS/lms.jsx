import React from 'react';
import SubjectLayout from '../../layout/SubjectLayout';

const LearningManagementSystem = () => {
  return (
    <SubjectLayout>
      <div className="p-6 bg-purple-50 ">
        <h1 className="text-3xl font-extrabold text-purple-800">Welcome to the Learning Management System</h1>
        <p className="mt-4 text-gray-600">
          This is the home of your LMS. Select a subject from the sidebar to start.
        </p>

        <div className="mt-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
            <h2 className="text-xl font-semibold text-purple-700">Getting Started</h2>
            <p className="mt-2 text-gray-600">
              You can browse through various subjects, check assignments, and manage your learning.
            </p>

            <div className="mt-6">
              <h3 className="text-lg font-medium text-purple-700">Features</h3>
              <ul className="list-disc pl-6">
                <li className="text-gray-600">Browse and access subject content</li>
                <li className="text-gray-600">Track assignments and deadlines</li>
                <li className="text-gray-600">Submit assignments directly through the platform</li>
                <li className="text-gray-600">View syllabus and track progress</li>
              </ul>
            </div>

            <div className="mt-6 text-center">
              <button className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none">
                Explore Subjects
              </button>
            </div>
          </div>
        </div>
      </div>
    </SubjectLayout>
  );
};

export default LearningManagementSystem;
