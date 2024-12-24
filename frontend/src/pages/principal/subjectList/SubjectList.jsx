import React, { useState, useEffect } from 'react';
import MainLayout from '../../../layout/MainLayout';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import AddSubjectModal from './AddSubjectModal';
import EditSubjectModal from './EditSubjectModal';

const SubjectList = () => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [subjectList, setSubjectsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // New state for delete confirmation modal
  const [subjectToDelete, setSubjectToDelete] = useState(null); // Store subject to delete

  // Fetch subjects
  const fetchSubjects = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8000/api/subjects/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setSubjectsList(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error('Error fetching subjects:', error.message || error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [access, navigate]);

  const handleViewDetails = (subject) => setSelectedSubject(subject);

  const handleCloseDetails = () => setSelectedSubject(null);

  const handleShowAddModal = () => {
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleShowEditModal = (subject) => {
    setIsEditMode(true);
    setSelectedSubject(subject);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  const handleConfirmDelete = (subjectId) => {
    setSubjectToDelete(subjectId); // Store the subject to delete
    setShowDeleteModal(true); // Show the confirmation modal
  };

  const handleDeleteSubject = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/api/subjects/${subjectToDelete}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      setSubjectsList((prev) => prev.filter((subject) => subject.id !== subjectToDelete));
      toast.success('Subject deleted successfully');
      setShowDeleteModal(false); // Close the confirmation modal
    } catch (error) {
      toast.error('Error deleting subject');
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false); // Close the confirmation modal without deleting
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Subjects</h1>

          <div className="mt-6">
            <button
              onClick={handleShowAddModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Add Subject
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">Available Subjects</h2>
            <p className="mt-4 text-gray-600">Subjects with their details.</p>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-gray-600">Loading subjects...</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-4 py-2 text-left">Subject Code</th>
                    <th className="px-4 py-2 text-left">Subject Name</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectList.map((subject) => (
                    <tr key={subject.subject_code} className="border-b hover:bg-purple-50">
                      <td className="px-4 py-2">{subject.subject_code}</td>
                      <td className="px-4 py-2">{subject.subject_name}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleViewDetails(subject)}
                          className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 mr-2"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleShowEditModal(subject)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleConfirmDelete(subject.id)} // Show delete confirmation modal
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

        {/* Subject Details Modal */}
        {selectedSubject && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold text-purple-800">Subject Details</h2>
              <div className="mt-4">
                <p className="text-gray-700"><strong>Subject Code:</strong> {selectedSubject.subject_code}</p>
                <p className="text-gray-700"><strong>Subject Name:</strong> {selectedSubject.subject_name}</p>
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
                Are you sure you want to delete this subject?
              </h2>
              <div className="mt-4 text-center">
                <button
                  onClick={handleDeleteSubject}
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
            <EditSubjectModal
              subject={selectedSubject}
              handleCloseModal={handleCloseModal}
              fetchSubjects={fetchSubjects}
            />
          ) : (
            <AddSubjectModal
              handleCloseModal={handleCloseModal}
              fetchSubjects={fetchSubjects}
            />
          )
        )}
      </div>
    </MainLayout>
  );
};

export default SubjectList;
