import React from "react";
import Modal from "./Modal";

const DeleteAssignmentModal = ({
  isOpen,
  onClose,
  assignment,
  fetchHomeworkList,
}) => {
  const handleDelete = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/teacher/assignments/${assignment.id}/`,
        {
          method: "DELETE",
        }
      );
      if (!res.ok) throw new Error("Failed to delete assignment");
      fetchHomeworkList();
      onClose();
    } catch (err) {
      console.error("Error deleting assignment:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-xl font-bold mb-4 text-red-600">
        Delete Assignment?
      </h2>
      <p className="mb-4">
        Are you sure you want to delete assignment:{" "}
        <strong>{assignment.assignment_name}</strong>?
      </p>
      <div className="flex justify-end space-x-4">
        <button
          onClick={onClose}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default DeleteAssignmentModal;
