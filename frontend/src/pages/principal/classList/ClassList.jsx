import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import ClassModal from "./ClassModal";    
import SectionListModal from "./SectionListModal";

const ClassList = () => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showClassModal, setShowClassModal] = useState(false);
  const [classInfo, setClassInfo] = useState(null);
  const [selectedClassDetails, setSelectedClassDetails] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [classToDelete, setClassToDelete] = useState(null);
  const [showSectionListModal, setShowSectionListModal] = useState(false);
  const [selectedClassIdForSection, setSelectedClassIdForSection] = useState(null);

  const fetchClasses = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8000/api/classes/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setClassList(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error fetching classes: " + (error.message || error));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [access, navigate]);

  // Show add (classInfo = null)
  const handleShowAddClass = () => {
    setClassInfo(null);
    setShowClassModal(true);
  };

  // Show edit (classInfo = existing class)
  const handleShowEditClass = (classItem) => {
    setClassInfo(classItem);
    setShowClassModal(true);
  };

  const handleCloseClassModal = () => {
    setShowClassModal(false);
    setClassInfo(null);
  };

  // Delete
  const handleConfirmDelete = (classId) => {
    setClassToDelete(classId);
    setShowDeleteModal(true);
  };

  const handleDeleteClass = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/api/classes/${classToDelete}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setClassList((prev) => prev.filter((cls) => cls.id !== classToDelete));
      toast.success("Class deleted successfully.");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Error deleting class: " + (error.response?.data?.detail || error.message));
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setClassToDelete(null);
  };


  const handleViewDetails = (classItem) => {
    setSelectedClassDetails(classItem);
  };
  const handleCloseDetails = () => {
    setSelectedClassDetails(null);
  };

  const handleShowSections = (classId) => {
    setSelectedClassIdForSection(classId);
    setShowSectionListModal(true);
  };
  const handleCloseSectionListModal = () => {
    setShowSectionListModal(false);
    setSelectedClassIdForSection(null);
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Classes</h1>

          <div className="mt-6">
            <button
              onClick={handleShowAddClass}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Add Class
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">Available Classes</h2>
            <p className="mt-1 text-gray-600">List of all available classes.</p>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-gray-600">Loading...</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              {classList.length === 0 ? (
                <div className="text-gray-600">No classes found.</div>
              ) : (
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-purple-700 text-white">
                      <th className="px-4 py-2 text-left">Class Code</th>
                      <th className="px-4 py-2 text-left">Class Name</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {classList.map((classItem) => (
                      <tr
                        key={classItem.id}
                        className="border-b hover:bg-purple-50"
                      >
                        <td className="px-4 py-2">{classItem.class_code}</td>
                        <td className="px-4 py-2">{classItem.class_name}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleViewDetails(classItem)}
                            className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 mr-2"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleShowEditClass(classItem)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleConfirmDelete(classItem.id)}
                            className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 mr-2"
                          >
                            Delete
                          </button>
                          <button
                            onClick={() => handleShowSections(classItem.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                          >
                            Sections
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Class Modal (Add/Edit) */}
      {showClassModal && (
        <ClassModal
          classInfo={classInfo}         
          onClose={handleCloseClassModal}
          refreshClasses={fetchClasses}
        />
      )}

      {/* Class Details Modal */}
      {selectedClassDetails && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-2xl font-bold text-purple-800">Class Details</h2>
            <div className="mt-4">
              <p className="text-gray-700">
                <strong>Class Code:</strong> {selectedClassDetails.class_code}
              </p>
              <p className="text-gray-700">
                <strong>Class Name:</strong> {selectedClassDetails.class_name}
              </p>
              <p className="text-gray-700">
                <strong>Subjects:</strong>
              </p>
              {selectedClassDetails.subject_details?.map((subj) => (
                <p key={subj.subject_code} className="pl-6 text-gray-700">
                  {subj.subject_code} - {subj.subject_name}
                </p>
              ))}
              {selectedClassDetails.optional_subject_details &&
                selectedClassDetails.optional_subject_details.length > 0 && (
                  <>
                    <p className="text-gray-700 mt-2">
                      <strong>Optional Subjects:</strong>
                    </p>
                    {selectedClassDetails.optional_subject_details.map((subj) => (
                      <p key={subj.subject_code} className="pl-6 text-gray-700">
                        {subj.subject_code} - {subj.subject_name}
                      </p>
                    ))}
                  </>
              )}
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
              Are you sure you want to delete this class?
            </h2>
            <div className="mt-4 text-center">
              <button
                onClick={handleDeleteClass}
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

      {/* Section List Modal */}
      {showSectionListModal && (
        <SectionListModal
          classId={selectedClassIdForSection}
          handleCloseSectionListModal={handleCloseSectionListModal}
        />
      )}
    </MainLayout>
  );
};

export default ClassList;
