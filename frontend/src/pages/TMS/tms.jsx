import React from 'react';
import ClassLayout from '../../layout/ClassLayout';

const TeachingManagementSystem = () => {
  return (
    <ClassLayout>
      <div className="p-6 bg-purple-50 ">
        <h1 className="text-3xl font-extrabold text-purple-800">Welcome to the Teaching Management System</h1>
        <p className="mt-4 text-gray-600">
          This is the home of your TMS. Select a classes from the sidebar to start.
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

            
          {/* Progress Section */}
          <div className="bg-purple-100 my-9 p-6 rounded-lg shadow-lg border border-purple-300">
            <h2 className="text-2xl font-semibold text-purple-800">Your Progress</h2>
            <div className="mt-4">


              {/* Replace with dynamic progress */}
              <div className="text-purple-700">Course Progress: 75%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-purple-700 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
          </div>

          {/* Recent Announcements Section */}
          <div className="bg-purple-100 p-6 rounded-lg shadow-lg border border-purple-300 col-span-2 lg:col-span-3">
            <h2 className="text-2xl font-semibold text-purple-800">Recent Announcements</h2>
            <ul className="mt-4 text-gray-600">
              {/* Replace with dynamic announcements */}
              <li className="py-2">Exam schedule has been updated, check the portal.</li>
              <li className="py-2">New reading material available for next class.</li>
            </ul>
          </div>

          </div>
        </div>
      </div>
    </ClassLayout>
  );
};

export default TeachingManagementSystem;
