import React, { useState, useEffect } from 'react';
import MainLayout from '../../layout/MainLayout';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newStudent, setNewStudent] = useState({
    student_id: '',
    student_name: '',
    email: '',
    phone: '',
    class: '',
  });

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      try {
        const sampleStudents = [
          {
            student_id: 'S101',
            student_name: 'John Doe',
            email: 'john.doe@example.com',
            phone: '123-456-7890',
            class: 'Introduction to Web Development',
          },
          {
            student_id: 'S102',
            student_name: 'Alice Smith',
            email: 'alice.smith@example.com',
            phone: '987-654-3210',
            class: 'Advanced Data Structures',
          },
        ];
        setStudents(sampleStudents);
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleViewDetails = (studentInfo) => {
    setSelectedStudent(studentInfo);
  };

  const handleCloseDetails = () => {
    setSelectedStudent(null);
  };

  const handleShowModal = (studentInfo = null) => {
    if (studentInfo) {
      setNewStudent(studentInfo);
    } else {
      setNewStudent({
        student_id: '',
        student_name: '',
        email: '',
        phone: '',
        class: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveStudent = () => {
    if (newStudent.student_id && newStudent.student_name) {
      if (newStudent.student_id) {
        setStudents((prev) =>
          prev.map((studentItem) =>
            studentItem.student_id === newStudent.student_id ? { ...newStudent } : studentItem
          )
        );
      } else {
        setStudents((prev) => [...prev, newStudent]);
      }
      setShowModal(false);
    } else {
      alert('Please provide student ID and student name.');
    }
  };

  const handleDeleteStudent = (studentId) => {
    setStudents((prev) => prev.filter((studentItem) => studentItem.student_id !== studentId));
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Students</h1>
          <p className="mt-4 text-gray-600">
            Manage the students and their enrolled classes here.
          </p>

          <div className="mt-6">
            <button
              onClick={() => handleShowModal()}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Add Student
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">Available Students</h2>
            <p className="text-gray-600 mt-2">
              Browse through the students and click on "Details" to learn more. You can also edit or delete student records.
            </p>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-gray-600">Loading students...</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-4 py-2 text-left">Student ID</th>
                    <th className="px-4 py-2 text-left">Student Name</th>
                    <th className="px-4 py-2 text-left">Class</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((studentItem) => (
                    <tr key={studentItem.student_id} className="border-b hover:bg-purple-50">
                      <td className="px-4 py-2">{studentItem.student_id}</td>
                      <td className="px-4 py-2">{studentItem.student_name}</td>
                      <td className="px-4 py-2">{studentItem.class}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleViewDetails(studentItem)}
                          className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 mr-2"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleShowModal(studentItem)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(studentItem.student_id)}
                          className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for student details */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold text-purple-800">Student Details</h2>
              <div className="mt-4">
                <p className="text-gray-700"><strong>Student ID:</strong> {selectedStudent.student_id}</p>
                <p className="text-gray-700"><strong>Student Name:</strong> {selectedStudent.student_name}</p>
                <p className="text-gray-700"><strong>Email:</strong> {selectedStudent.email}</p>
                <p className="text-gray-700"><strong>Phone:</strong> {selectedStudent.phone}</p>
                <p className="text-gray-700"><strong>Class:</strong> {selectedStudent.class}</p>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={handleCloseDetails}
                  className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Add/Edit Student */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold text-purple-800">{newStudent.student_id ? 'Edit' : 'Add'} Student</h2>
              <div className="mt-4">
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                  placeholder="Student ID"
                  value={newStudent.student_id}
                  onChange={(e) => setNewStudent({ ...newStudent, student_id: e.target.value })}
                />
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                  placeholder="Student Name"
                  value={newStudent.student_name}
                  onChange={(e) => setNewStudent({ ...newStudent, student_name: e.target.value })}
                />
                <input
                  type="email"
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                  placeholder="Email"
                  value={newStudent.email}
                  onChange={(e) => setNewStudent({ ...newStudent, email: e.target.value })}
                />
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                  placeholder="Phone"
                  value={newStudent.phone}
                  onChange={(e) => setNewStudent({ ...newStudent, phone: e.target.value })}
                />
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                  placeholder="Class"
                  value={newStudent.class}
                  onChange={(e) => setNewStudent({ ...newStudent, class: e.target.value })}
                />
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={handleSaveStudent}
                  className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 mr-2"
                >
                  Save
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default StudentList;
