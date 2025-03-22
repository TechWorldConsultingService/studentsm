import React from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const DeleteSyllabusModal = ({ syllabus, handleCloseModal, onSyllabusDeleted }) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleDelete = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/api/syllabus/${syllabus.id}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      toast.success("Syllabus deleted successfully.");
      handleCloseModal();
      onSyllabusDeleted();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error deleting syllabus.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h2 className="text-2xl mb-4 font-bold text-purple-800">
          Delete Syllabus
        </h2>
        <p className="mb-6">
          Are you sure you want to delete the syllabus for{" "}
          <strong>{syllabus.subject_name}</strong>?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={handleCloseModal}
            className="px-4 py-2 border border-purple-700 text-purple-700 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded-lg"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteSyllabusModal;
