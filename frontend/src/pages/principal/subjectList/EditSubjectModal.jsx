import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";


const EditSubjectModal = ({ subject, handleCloseModal, fetchSubjects }) => {

    const { access } = useSelector((state) => state.user);
  const [updatedSubject, setUpdatedSubject] = useState({
    subject_code: subject.subject_code,
    subject_name: subject.subject_name,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedSubject((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!updatedSubject.subject_code || !updatedSubject.subject_name) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8000/api/subjects/${subject.id}/`,
        updatedSubject,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`, 
          },
        }
      );

      if (response.status === 200) {
        toast.success("Subject updated successfully.");
        fetchSubjects(); 
        handleCloseModal();
      }
    } catch (error) {
      toast.error("Error updating subject: " + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold text-purple-800">Edit Subject</h2>
        <div className="mt-4">
          <input
            type="text"
            className="border border-gray-300 p-2 rounded w-full mb-4"
            placeholder="Subject Code"
            name="subject_code"
            value={updatedSubject.subject_code}
            onChange={handleInputChange}
          />
          <input
            type="text"
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="Subject Name"
            name="subject_name"
            value={updatedSubject.subject_name}
            onChange={handleInputChange}
          />
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={handleSave}
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
  );
};

export default EditSubjectModal;
