import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import AddTeacherModal from "./AddTeacherModal";
import EditTeacherModal from "./EditTeacherModal";

const TeacherList = () => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [teacherList, setTeacherList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [teacherToDelete, setTeacherToDelete] = useState(null);

  // Fetch teachers
  const fetchTeachers = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8000/api/teachers/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setTeacherList(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error fetching teachers:", error.message || error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [access, navigate]);

  const handleViewDetails = (teacherInfo) => {
    setSelectedTeacher(teacherInfo);
    setShowModal(false);
    setIsEditMode(false);
  };

  const handleCloseDetails = () => {
    setSelectedTeacher(null);
  };

  const handleShowAddModal = () => {
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleShowEditModal = (teacherInfo) => {
    setIsEditMode(true);
    setSelectedTeacher(teacherInfo);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = (teacherId) => {
    setTeacherToDelete(teacherId);
    setShowDeleteModal(true);
  };

  const handleDeleteTeacher = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    try {
      await axios.delete(
        `http://localhost:8000/api/teachers/${teacherToDelete}/delete/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      setTeacherList((prev) =>
        prev.filter((teacher) => teacher?.id !== teacherToDelete)
      );

      toast.success("Teacher deleted successfully.");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(
        "Error deleting teacher:",
        error.response?.data?.detail || error.message
      );
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Teachers</h1>

          <div className="mt-6">
            <button
              onClick={handleShowAddModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Add Teacher
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">
              Available Teachers
            </h2>
            <p className="mt-4 text-gray-600">
              Teacher list with their details.
            </p>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-gray-600">
              Loading...
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-4 py-2 text-left">Teacher Name</th>
                    <th className="px-4 py-2 text-left">Class Teacher</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teacherList.length > 0 ? (
                    teacherList.map((teacher) => (
                      <tr
                        key={teacher.id}
                        className="border-b hover:bg-purple-50"
                      >
                        <td className="px-4 py-2">
                          {teacher.user.first_name} {teacher.user.last_name}
                        </td>
                        <td className="px-4 py-2">
                          {teacher.class_teacher ? teacher.class_teacher : "-"}
                        </td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleViewDetails(teacher)}
                            className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 mr-2"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleShowEditModal(teacher)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleConfirmDelete(teacher.id)}
                            className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <span className="text-gray-600">Teacher is not added to show. </span>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for teacher details */}
        {selectedTeacher && !isEditMode && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold text-purple-800">
                Teacher Details
              </h2>
              <div className="mt-4">
                <p className="text-gray-700">
                  <strong>Username:</strong> {selectedTeacher.user.username}
                </p>
                <p className="text-gray-700">
                  <strong>Name:</strong> {selectedTeacher.user.first_name}{" "}
                  {selectedTeacher.user.last_name}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {selectedTeacher.user.email}
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> {selectedTeacher.phone}
                </p>
                <p className="text-gray-700">
                  <strong>Role:</strong> {selectedTeacher.user.role}
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> {selectedTeacher.address}
                </p>
                <p className="text-gray-700">
                  <strong>Gender:</strong> {selectedTeacher.gender}
                </p>

                    <p className="text-gray-700">
                    <strong>Class Teacher:</strong> {selectedTeacher.class_teacher ? (selectedTeacher.class_teacher," class"  ): "-" }
                  </p>
                 
                <p className="flex flex-col">
                <strong> Subject Code/Name:  </strong> 
                {selectedTeacher.subject_details.length > 0 ? (
                  selectedTeacher.subject_details.map((item) => (
                    <span key={item.id} >
                      {item.subject_code}/ {item.subject_name}
                    </span>
                  ))
                ) : (
                  <span>Please assign subject for teacher.</span>
                )}
                </p>

                <p className="flex flex-col">
                <strong> Class Code/Name:  </strong> 
                {selectedTeacher.class_details.length > 0 ? (
                  selectedTeacher.class_details.map((item) => (
                    <span key={item.id} >
                      {item.class_code}/ {item.class_name}
                    </span>
                  ))
                ) : (
                  <span>Please assign class for  teacher.</span>
                )}
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
                Are you sure you want to delete this teacher?
              </h2>
              <div className="mt-4 text-center">
                <button
                  onClick={handleDeleteTeacher}
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
        {showModal &&
          (isEditMode ? (
            <EditTeacherModal
              teacherInfo={selectedTeacher}
              handleCloseModal={handleCloseModal}
              fetchTeachers={fetchTeachers}
            />
          ) : (
            <AddTeacherModal
              handleCloseModal={handleCloseModal}
              fetchTeachers={fetchTeachers}
            />
          ))}
      </div>
    </MainLayout>
  );
};

export default TeacherList;
