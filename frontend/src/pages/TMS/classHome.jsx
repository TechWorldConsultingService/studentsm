import React, { useState } from "react";
import { Link } from "react-router-dom";

const ClassHome = () => {
  const [classData] = useState({
    name: "Math 101",
    teacher: "Mr. John Doe",
    assignments: [
      { id: 1, title: "Algebra Homework", status: "Pending" },
      { id: 2, title: "Geometry Assignment", status: "In Progress" },
    ],
    syllabus: {
      subject: "Math",
      teacher_name: "Mr. John Doe",
      topics: "Algebra, Geometry, Trigonometry",
      completed_topics: "Algebra",
      completion_percentage: 50,
    },
    notes: [
      { id: 1, text: "Focus on algebraic expressions this week." },
      { id: 2, text: "Remember to revise geometry formulas." },
    ],
  });

  return (
    <div className="w-full p-4 bg-purple-50">
      {/* Class Overview */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300 mb-6">
        <h1 className="text-3xl font-extrabold text-purple-800">
          {classData.name} - Class Home
        </h1>
        <p className="mt-4 text-gray-600">
          Welcome to the {classData.name} class. Here, you will find all the resources related to this class including assignments, notes, syllabus, and more.
        </p>
      </div>

      {/* Assignments Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300 mb-6">
        <h2 className="text-2xl font-semibold text-purple-700">Assignments/Homework</h2>
        <div className="space-y-4 mt-4">
          {classData.assignments.map((assignment) => (
            <div key={assignment.id} className="p-4 bg-gray-50 rounded-lg">
              <p className="font-medium text-purple-700">{assignment.title}</p>
              <p className="text-gray-600">Status: {assignment.status}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/assignments"
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
          >
            View All Assignments
          </Link>
        </div>
      </div>

      {/* Notes Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300 mb-6">
        <h2 className="text-2xl font-semibold text-purple-700">Class Notes</h2>
        <div className="space-y-4 mt-4">
          {classData.notes.map((note) => (
            <div key={note.id} className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-600">{note.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/notes"
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
          >
            View All Notes
          </Link>
        </div>
      </div>

      {/* Syllabus Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300 mb-6">
        <h2 className="text-2xl font-semibold text-purple-700">Syllabus</h2>
        <div className="space-y-4 mt-4">
          <p className="text-gray-600">
            <strong>Subject: </strong>{classData.syllabus.subject}
          </p>
          <p className="text-gray-600">
            <strong>Teacher: </strong>{classData.syllabus.teacher_name}
          </p>
          <p className="text-gray-600">
            <strong>Topics: </strong>{classData.syllabus.topics}
          </p>
          <p className="text-gray-600">
            <strong>Completed Topics: </strong>{classData.syllabus.completed_topics}
          </p>
          <p className="text-gray-600">
            <strong>Completion Percentage: </strong>{classData.syllabus.completion_percentage}%
          </p>
        </div>
        <div className="mt-4 text-center">
          <Link
            to="/syllabus"
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
          >
            View Syllabus
          </Link>
        </div>
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h2 className="text-2xl font-semibold text-purple-700">Upcoming Events</h2>
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-purple-700">Mid-Term Exam</p>
            <p className="text-gray-600">Date: 15th January 2024</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-purple-700">Geometry Quiz</p>
            <p className="text-gray-600">Date: 20th January 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClassHome;
