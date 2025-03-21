import React from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";



const DeleteNotesModal = ({ note, onClose, fetchNotesList }) => {
    const { access } = useSelector((state) => state.user);
  
    const handleDelete = async () => {
      try {
        await axios.delete(`http://localhost:8000/api/notes/${note.id}/`, {
          headers: { Authorization: `Bearer ${access}` },
        });
        toast.success("Note deleted successfully!");
        fetchNotesList();
        onClose();
      } catch (error) {
        toast.error("Failed to delete note. Please try again.");
      }
    };
  
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
          <h2 className="text-xl font-bold text-red-700">Confirm Deletion</h2>
          <p className="mt-3 text-gray-700">
            Are you sure you want to delete the note <strong>{note.title}</strong>? This action cannot be undone.
          </p>
  
          <div className="mt-6 flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  };
  
  export default DeleteNotesModal;  