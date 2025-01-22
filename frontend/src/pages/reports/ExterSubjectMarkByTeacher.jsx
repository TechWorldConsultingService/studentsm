import React, { useState } from "react";
import EnterMarks from "./EnterMarksTeacherModal";
import MainLayout from "../../layout/MainLayout";

const ExterSubjectMarkByTeacher = () => {
  const [students, setStudents] = useState([
    { id: 1, name: "Akash Singh", theoryMarks: 85, practicalMarks: 90 },
    { id: 2, name: "Tilak Don", theoryMarks: 75, practicalMarks: 80 },
    { id: 3, name: "Shujan Bhusal", theoryMarks: 95, practicalMarks: 92 },
  ]);

  const [subjects, setSubjects] = useState([
    { name: "Math", fullMarks: 100, passMarks: 35 },
    { name: "Science", fullMarks: 100, passMarks: 35 },
  ]);

  const [selectedSubject, setSelectedSubject] = useState("Math");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const openAddMarksModal = () => {
    setSelectedStudent(null);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openEditMarksModal = (student) => {
    setSelectedStudent(student);
    setIsEditing(true);
    setIsModalOpen(true);
  };

  const openViewMarksModal = (student) => {
    setSelectedStudent(student);
    setIsEditing(false);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStudent(null);
  };

  const handleSaveMarks = (studentId, theoryMarks, practicalMarks) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? { ...student, theoryMarks, practicalMarks }
          : student
      )
    );
    closeModal();
  };

  const handleCancel = () => {
    closeModal();
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Exam Marks</h1>
          <p className="mt-4 text-gray-600">Marks for students in the exam.</p>

          {/* Add Marks Button */}
          <div className="mt-6 text-right">
            <button
              onClick={openAddMarksModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none"
            >
              Add Marks
            </button>
          </div>

          {/* Table displaying student marks */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">Students and Marks</h2>
            <table className="min-w-full mt-4 table-auto">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-4 py-2 text-left">Student Name</th>
                  <th className="px-4 py-2 text-left">Theory Marks</th>
                  <th className="px-4 py-2 text-left">Practical Marks</th>
                  <th className="px-4 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id} className="border-b hover:bg-purple-50">
                    <td className="px-4 py-2">{student.name}</td>
                    <td className="px-4 py-2">{student.theoryMarks}</td>
                    <td className="px-4 py-2">{student.practicalMarks}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => openViewMarksModal(student)}
                        className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 mr-2"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditMarksModal(student)}
                        className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* EnterMarks Modal (Add/Edit) */}
        {isModalOpen && (
          <EnterMarks
            students={students}
            subjects={subjects}
            selectedSubject={selectedSubject}
            onSaveMarks={handleSaveMarks}
            onCancel={handleCancel}
            selectedStudent={selectedStudent}
            isEditing={isEditing}
          />
        )}

        {/* View Marks Modal */}
        {selectedStudent && !isEditing && (
          <div className="fixed inset-0 bg-gray-700 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-purple-300">
              <h2 className="text-2xl font-semibold text-purple-700 mb-4">
                View Marks for {selectedStudent.name}
              </h2>
              <div className="mt-4">
                <p className="text-gray-600">Theory Marks: {selectedStudent.theoryMarks}</p>
                <p className="text-gray-600">Practical Marks: {selectedStudent.practicalMarks}</p>
              </div>

              <div className="mt-6 flex justify-end gap-4">
                <button
                  onClick={closeModal}
                  className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ExterSubjectMarkByTeacher;
