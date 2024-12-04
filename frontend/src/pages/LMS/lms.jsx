import React from 'react';
import SubjectLayout from '../../layout/SubjectLayout';

const LearningManagementSystem = () => {
  return (
    <SubjectLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome to the Learning Management System</h1>
        <p className="mt-4 text-gray-600">
          This is the home of your LMS. Select a subject from the sidebar to start.
        </p>
      </div>
    </SubjectLayout>
  );
};

export default LearningManagementSystem;
