import React, { useState } from "react";

const ExamTeacher = () => {
  // Sample student data with marks
  const [students, setStudents] = useState([
    { id: 1, name: "John Doe", theoryMarks: 85, practicalMarks: 90 },
    { id: 2, name: "Jane Smith", theoryMarks: 75, practicalMarks: 80 },
    { id: 3, name: "Samuel Adams", theoryMarks: 95, practicalMarks: 92 },
  ]);

  // State to manage the editing of marks and the selected student
  const [isEditing, setIsEditing] = useState(false);
  const [isViewing, setIsViewing] = useState(false); // For View mode
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [theoryMarks, setTheoryMarks] = useState("");
  const [practicalMarks, setPracticalMarks] = useState("");

  // Handle the editing of marks for a specific student
  const handleEditMarks = (student) => {
    setIsEditing(true);
    setIsViewing(false); // Disable View mode when editing
    setSelectedStudent(student);
    setTheoryMarks(student.theoryMarks);
    setPracticalMarks(student.practicalMarks);
  };

  // Handle viewing of marks (View mode)
  const handleViewMarks = (student) => {
    setIsViewing(true);
    setIsEditing(false); // Disable Edit mode when viewing
    setSelectedStudent(student);
    setTheoryMarks(student.theoryMarks);
    setPracticalMarks(student.practicalMarks);
  };

  // Handle saving the marks after editing
  const handleSaveMarks = () => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === selectedStudent.id
          ? { ...student, theoryMarks, practicalMarks }
          : student
      )
    );
    setIsEditing(false);
    setTheoryMarks("");
    setPracticalMarks("");
    setSelectedStudent(null);  // Clear selected student after saving
  };

  // Handle clearing the marks for the selected student
  const handleClearMarks = () => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === selectedStudent.id
          ? { ...student, theoryMarks: 0, practicalMarks: 0 }
          : student
      )
    );
    setIsEditing(false);
    setTheoryMarks("");
    setPracticalMarks("");
    setSelectedStudent(null);  // Clear selected student after clearing
  };

  return (
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">Exam Marks Management</h1>
        <p className="mt-4 text-gray-600">Manage marks for students in the exam.</p>

        {/* Table displaying student marks */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-purple-700">Students and Marks</h2>
          <table className="min-w-full mt-4">
            <thead>
              <tr className="bg-purple-100 text-purple-700">
                <th className="px-6 py-3 border">Student Name</th>
                <th className="px-6 py-3 border">Theory Marks</th>
                <th className="px-6 py-3 border">Practical Marks</th>
                <th className="px-6 py-3 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">{student.theoryMarks}</td>
                  <td className="px-6 py-4">{student.practicalMarks}</td>
                  <td className="px-6 py-4">
                    {/* Edit Button for Each Student */}
                    <button
                      onClick={() => handleEditMarks(student)}
                      className="text-purple-700 hover:underline mr-2"
                    >
                      Edit
                    </button>
                    {/* View Button for Each Student */}
                    <button
                      onClick={() => handleViewMarks(student)}
                      className="text-purple-700 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Modal for editing marks (Only for the selected student) */}
        {isEditing && selectedStudent && (
          <div className="mt-6 p-6 bg-white border border-purple-300 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-purple-700">
              Edit Marks for {selectedStudent.name}
            </h2>
            <div className="mt-4">
              <label className="block text-gray-600">Theory Marks</label>
              <input
                type="number"
                value={theoryMarks}
                onChange={(e) => setTheoryMarks(e.target.value)}
                className="mt-2 p-2 border rounded-md"
              />
              <label className="block text-gray-600 mt-4">Practical Marks</label>
              <input
                type="number"
                value={practicalMarks}
                onChange={(e) => setPracticalMarks(e.target.value)}
                className="mt-2 p-2 border rounded-md"
              />
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handleClearMarks}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
              >
                Clear Marks
              </button>
              <button
                onClick={handleSaveMarks}
                className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
              >
                Save Marks
              </button>
            </div>
          </div>
        )}

        {/* View Mode */}
        {isViewing && selectedStudent && (
          <div className="mt-6 p-6 bg-white border border-purple-300 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-purple-700">
              View Marks for {selectedStudent.name}
            </h2>
            <div className="mt-4">
              <p className="text-gray-600">Theory Marks: {theoryMarks}</p>
              <p className="text-gray-600">Practical Marks: {practicalMarks}</p>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => setIsViewing(false)}
                className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
              >
                Close View
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamTeacher;
