import React from "react";
import { useParams } from "react-router-dom";

const SubjectHome = () => {
  const { subject } = useParams();

  // Simulating subject-specific data for demo purposes
  const assignments = [
    { id: 1, title: "Assignment 1", dueDate: "2024-12-20", description: "Complete the sorting algorithms exercise." },
    { id: 2, title: "Assignment 2", dueDate: "2024-12-25", description: "Solve problems on data structures." },
  ];

  const notes = [
    { id: 1, title: "Lecture 1: Introduction to Algorithms", uploadedBy: "Prof. John Doe", uploadDate: "2024-12-10" },
    { id: 2, title: "Lecture 2: Linked Lists", uploadedBy: "Dr. Alice Smith", uploadDate: "2024-12-12" },
  ];

  const syllabus = "The syllabus will cover topics on algorithms, data structures, database management, and more. Refer to the attached document for a detailed breakdown.";

  const otherInfo = "For any queries, contact Prof. John Doe at johndoe@university.com.";

  return (
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        {/* Subject Header */}
        <h1 className="text-3xl font-extrabold text-purple-800">
          {subject.charAt(0).toUpperCase() + subject.slice(1)} Page
        </h1>
        <p className="mt-4 text-gray-600">
          Welcome to the {subject.charAt(0).toUpperCase() + subject.slice(1)} subject page. Here, you can access all the resources and assignments related to this subject.
        </p>

        {/* What's Next Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-purple-700">What's Next?</h2>
          <p className="text-gray-600 mt-2">
            Explore the syllabus, assignments, and other important resources related to the {subject} subject.
          </p>
        </div>

        {/* Subject Resource Cards */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Assignments Section */}
          <div className="bg-purple-100 p-6 rounded-lg shadow-lg border border-purple-300">
            <h2 className="text-2xl font-semibold text-purple-800">Assignments</h2>
            <ul className="mt-4 text-gray-600">
              {assignments.map((assignment) => (
                <li key={assignment.id} className="border-b py-2">
                  <h3 className="text-purple-700 font-semibold">{assignment.title}</h3>
                  <p className="text-sm">Due Date: {assignment.dueDate}</p>
                  <p className="text-sm">{assignment.description}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Notes Section */}
          <div className="bg-purple-100 p-6 rounded-lg shadow-lg border border-purple-300">
            <h2 className="text-2xl font-semibold text-purple-800">Notes</h2>
            <ul className="mt-4 text-gray-600">
              {notes.map((note) => (
                <li key={note.id} className="border-b py-2">
                  <h3 className="text-purple-700 font-semibold">{note.title}</h3>
                  <p className="text-sm">Uploaded by: {note.uploadedBy}</p>
                  <p className="text-sm">Date: {note.uploadDate}</p>
                </li>
              ))}
            </ul>
          </div>

          {/* Syllabus Section */}
          <div className="bg-purple-100 p-6 rounded-lg shadow-lg border border-purple-300">
            <h2 className="text-2xl font-semibold text-purple-800">Syllabus</h2>
            <p className="mt-4 text-gray-600">{syllabus}</p>
          </div>

          {/* Other Information Section */}
          <div className="bg-purple-100 p-6 rounded-lg shadow-lg border border-purple-300 col-span-2 lg:col-span-3">
            <h2 className="text-2xl font-semibold text-purple-800">Other Information</h2>
            <p className="mt-4 text-gray-600">{otherInfo}</p>
          </div>
        </div>

        {/* Explore Button */}
        <div className="mt-6 text-center">
          <button className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none">
            Explore {subject.charAt(0).toUpperCase() + subject.slice(1)} Resources
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubjectHome;
