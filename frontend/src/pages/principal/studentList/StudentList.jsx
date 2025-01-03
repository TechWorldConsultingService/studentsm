import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import AddStudentModal from "./AddStudentModal";
import EditStudentModal from "./EditStudentModal";

const StudentList = () => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);

  // Fetch students
  const fetchStudents = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8000/api/students/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setStudentList(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error fetching students:", error.message || error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [access, navigate]);

  const handleViewDetails = (studentInfo) => {
    setSelectedStudent(studentInfo);
    setShowModal(false);
    setIsEditMode(false);
  };

  const handleCloseDetails = () => {
    setSelectedStudent(null);
  };

  const handleShowAddModal = () => {
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleShowEditModal = (studentInfo) => {
    setIsEditMode(true); 
    setSelectedStudent(studentInfo);  
    setShowModal(true);  
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = (studentId) => {
    setStudentToDelete(studentId);
    setShowDeleteModal(true);
  };

  const handleDeleteStudent = async () => {
    console.log('studentToDelete:', studentToDelete);
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/students/${studentToDelete}/delete/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });

      setStudentList((prev) =>
        prev.filter((student) => student?.id !== studentToDelete)
      );

      toast.success("Student deleted successfully.");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Error deleting student:", error.response?.data?.detail || error.message);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Students</h1>

          <div className="mt-6">
            <button
              onClick={handleShowAddModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Add Student
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">
              Available Students
            </h2>
            <p className="mt-4 text-gray-600">Student list with their details.</p>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-gray-600">Loading students...</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-4 py-2 text-left">Class</th>
                    <th className="px-4 py-2 text-left">Student Name</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {studentList.map((student) => (
                    <tr key={student.phone} className="border-b hover:bg-purple-50">
                      <td className="px-4 py-2">{student.class_code}</td>
                      <td className="px-4 py-2">{student.user.first_name} {student.user.last_name}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleViewDetails(student)}
                          className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 mr-2"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleShowEditModal(student)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleConfirmDelete(student.id)}
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
        {selectedStudent && !isEditMode && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold text-purple-800">Student Details</h2>
              <div className="mt-4">
                <p className="text-gray-700">
                  <strong>Username:</strong> {selectedStudent.user.username}
                </p>
                <p className="text-gray-700">
                  <strong>Name:</strong> {selectedStudent.user.first_name} {selectedStudent.user.last_name}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {selectedStudent.user.email}
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> {selectedStudent.phone}
                </p>
                <p className="text-gray-700">
                  <strong>Role:</strong> {selectedStudent.user.role}
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> {selectedStudent.address}
                </p>
                <p className="text-gray-700">
                  <strong>Date of Birth:</strong> {selectedStudent.date_of_birth}
                </p>
                <p className="text-gray-700">
                  <strong>Parent's Name:</strong> {selectedStudent.parents}
                </p>
                <p className="text-gray-700">
                  <strong>Gender:</strong> {selectedStudent.gender}
                </p>
                <p className="text-gray-700">
                  <strong>Class Code:</strong> {selectedStudent.class_code}
                </p>
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold text-purple-800">
                Are you sure you want to delete this student?
              </h2>
              <div className="mt-4 text-center">
                <button
                  onClick={handleDeleteStudent}
                  className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 mr-4"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={handleCloseDeleteModal}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add or Edit Modal */}
        {showModal && (
          isEditMode ? (
            <EditStudentModal
              studentInfo={selectedStudent}
              handleCloseModal={handleCloseModal}
              fetchStudents={fetchStudents}
            />
          ) : (
            <AddStudentModal
              handleCloseModal={handleCloseModal}
              fetchStudents={fetchStudents}
            />
          )
        )}
      </div>
    </MainLayout>
  );
};

export default StudentList;
