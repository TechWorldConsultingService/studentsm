import React from "react";

const DeleteAssignment = ({ assignment, closeModal, fetchHomeworkList }) => {
  const handleDelete = () => {
    // Delete the assignment via API
    fetch(`http://localhost:8000/api/teacher/assignments/${assignment.id}/`, {
      method: "DELETE",
    })
      .then((res) => {
        if (res.ok) {
          fetchHomeworkList(); // Refresh list
          closeModal();
        } else {
          throw new Error("Delete failed");
        }
      })
      .catch((error) => {
        console.error("Error deleting assignment:", error);
        // Optionally display error feedback here
      });
  };

  return (
    <div>
      <p className="mb-4">
        Are you sure you want to delete the assignment:{" "}
        <strong>{assignment.assignment_name}</strong>?
      </p>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={closeModal}
          className="mr-4 px-4 py-2 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleDelete}
          className="px-4 py-2 bg-red-600 text-white rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default DeleteAssignment;
