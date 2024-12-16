import React, { useState } from "react";
import { useParams } from "react-router-dom";

const ClassSyllabus = () => {
  const { subject } = useParams();
  const [isCompleted, setIsCompleted] = useState(false); // Checkbox for completion
  const [syllabusData, setSyllabusData] = useState({
    subject_name: "Math",
    teacher_name: "Mr. Smith",
    class_name: "10th Grade",
    topics: "Algebra, Geometry, Trigonometry",
    completed_topics: "Algebra",
    completion_percentage: 50,
  });

  // Ensure subject is available, and fallback to 'Default Subject' if it's not.
  const subjectName = subject ? subject.charAt(0).toUpperCase() + subject.slice(1) : 'Default Subject';

  // Handle marking the subject as completed
  const handleCompletionChange = (e) => {
    setIsCompleted(e.target.checked);
    setSyllabusData((prevData) => ({
      ...prevData,
      completion_percentage: e.target.checked ? 100 : 50,
    }));
  };

  // Handle editing the syllabus (just showing form here, in a real app, you might open a modal or a different page)
  const handleEditSyllabus = () => {
    alert("Edit syllabus clicked!");
    // You can add logic here to show an editable form
  };

  return (
    <div className="w-full p-4 bg-purple-50">
      {syllabusData ? (
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-center text-purple-800 mb-8 animate__animated animate__fadeIn">
            Syllabus for {subjectName}
          </h2>

          {/* Display Syllabus */}
          <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
            <p className="text-gray-600 mt-2">
              <strong className="text-purple-700">Teacher: </strong>
              {syllabusData.teacher_name}
            </p>
            <p className="text-gray-600 mt-2">
              <strong className="text-purple-700">Class: </strong>
              {syllabusData.class_name}
            </p>

            <div className="mt-4">
              <h4 className="text-lg font-medium text-purple-700">Topics</h4>
              <p className="text-gray-600">{syllabusData.topics}</p>
            </div>

            <div className="mt-4">
              <h4 className="text-lg font-medium text-purple-700">
                Completed Topics
              </h4>
              <p className="text-gray-600">{syllabusData.completed_topics}</p>
            </div>

            <div className="mt-4">
              <h4 className="text-lg font-medium text-purple-700">
                Completion Percentage
              </h4>
              <p className="text-gray-600">{syllabusData.completion_percentage}%</p>
            </div>

            {/* Checkbox for Marking as Completed */}
            <div className="mt-4 flex items-center">
              <input
                type="checkbox"
                checked={isCompleted}
                onChange={handleCompletionChange}
                className="mr-2"
              />
              <span className="text-gray-600">Mark as Completed</span>
            </div>

            <div className="mt-4">
              <p className="text-sm text-gray-500">
                <strong>Created At:</strong> {new Date().toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-500">
                <strong>Updated At:</strong> {new Date().toLocaleDateString()}
              </p>
            </div>

            {/* Edit Button */}
            <div className="mt-6 text-center">
              <button
                onClick={handleEditSyllabus}
                className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none"
              >
                Edit Syllabus
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No syllabus found for this subject.</p>
      )}

      {/* Button for Adding New Syllabus */}
      {!syllabusData && (
        <div className="mt-6 text-center">
          <button
            onClick={() => {
              // Logic to handle adding syllabus (perhaps show a form)
              console.log("Add new syllabus");
            }}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none"
          >
            Add Syllabus
          </button>
        </div>
      )}
    </div>
  );
};

export default ClassSyllabus;
