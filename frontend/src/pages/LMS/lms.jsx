import React from 'react';
import { useParams } from 'react-router-dom';
import SubjectLayout from '../../layout/SubjectLayout';

const LearningManagementSystem = () => {
  const { subject } = useParams();

  // Check if 'subject' is available, else provide a default value
  const subjectName = subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : "Subject";

  return (
    <SubjectLayout>
      <div className="p-6 bg-purple-50">
        {/* Welcome section */}
        <h1 className="text-3xl font-extrabold text-purple-800">
          Welcome to the Learning Management System
        </h1>
        <p className="mt-4 text-gray-600">
          This is the home of your LMS. Explore the subject "{subjectName}" and manage your learning resources.
        </p>

        {/* General info about LMS */}
        <div className="mt-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
            <h2 className="text-xl font-semibold text-purple-700">Getting Started with {subjectName}</h2>
            <p className="mt-2 text-gray-600">
              Explore various sections such as assignments, notes, syllabus, and track your learning progress.
            </p>

            {/* Features list */}
            <div className="mt-6">
              <h3 className="text-lg font-medium text-purple-700">Features</h3>
              <ul className="list-disc pl-6">
                <li className="text-gray-600">Browse and access subject content</li>
                <li className="text-gray-600">Track assignments and deadlines</li>
                <li className="text-gray-600">Submit assignments directly through the platform</li>
                <li className="text-gray-600">View syllabus and track progress</li>
              </ul>
            </div>

          </div>
        </div>

        {/* Subject specific sections */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Assignments Section */}
          <div className="bg-purple-100 p-6 rounded-lg shadow-lg border border-purple-300">
            <h2 className="text-2xl font-semibold text-purple-800">Assignments</h2>
            <p className="mt-4 text-gray-600">
              Check the available assignments for {subjectName} and their deadlines.
            </p>
            {/* Replace with dynamic assignment data */}
            <ul className="mt-4">
              <li className="py-2 text-gray-700">Assignment 1: Due on 2024-12-20</li>
              <li className="py-2 text-gray-700">Assignment 2: Due on 2024-12-25</li>
            </ul>
          </div>

          {/* Notes Section */}
          <div className="bg-purple-100 p-6 rounded-lg shadow-lg border border-purple-300">
            <h2 className="text-2xl font-semibold text-purple-800">Notes</h2>
            <p className="mt-4 text-gray-600">
              Access your lecture notes and study materials for {subjectName}.
            </p>
            {/* Replace with dynamic notes data */}
            <ul className="mt-4">
              <li className="py-2 text-gray-700">Lecture 1: Introduction to {subjectName}</li>
              <li className="py-2 text-gray-700">Lecture 2: Deep Dive into {subjectName}</li>
            </ul>
          </div>

          {/* Progress Section */}
          <div className="bg-purple-100 p-6 rounded-lg shadow-lg border border-purple-300">
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
    </SubjectLayout>
  );
};

export default LearningManagementSystem;
