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
    { id: 1, title: "Lecture 1: Introduction to Algorithms", uploadedBy: "Prof. Tilak P.", uploadDate: "2024-12-10" },
    { id: 2, title: "Lecture 2: Linked Lists", uploadedBy: "Dr. Aakash Singh", uploadDate: "2024-12-12" },
  ];


  const otherInfo = "For any queries, contact Prof. Akash Singh at satyamxaviers@school.com.";

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



          {/* Other Information Section */}
          <div className="bg-purple-100 p-6 rounded-lg shadow-lg border border-purple-300 col-span-2 lg:col-span-3">
            <h2 className="text-lg font-semibold text-purple-800">New Announcement/Information</h2>
            <p className="mt-4 text-gray-600">{otherInfo}</p>
          </div>
        </div>


      </div>
    </div>
  );
};

export default SubjectHome;
