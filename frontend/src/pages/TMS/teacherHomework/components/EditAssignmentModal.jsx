import React, { useState } from "react";
import Modal from "./Modal";

const EditAssignmentModal = ({
  isOpen,
  onClose,
  assignment,
  fetchHomeworkList,
}) => {
  const [formData, setFormData] = useState({
    subject: assignment.subject,
    assignment_name: assignment.assignment_name,
    description: assignment.description,
    due_date: assignment.due_date,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `http://localhost:8000/api/teacher/assignments/${assignment.id}/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      if (!res.ok) throw new Error("Failed to update assignment");
      await res.json();
      fetchHomeworkList();
      onClose();
    } catch (err) {
      console.error("Error updating assignment:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl text-purple-800 font-bold mb-4">Edit Assignment</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-gray-600">Subject:</label>
          <input
            type="text"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="text-gray-600">Topic:</label>
          <input
            type="text"
            name="assignment_name"
            value={formData.assignment_name}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="text-gray-600">Description:</label>
          <textarea
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>
        <div>
          <label className="text-gray-600">Due Date:</label>
          <input
            type="date"
            name="due_date"
            value={formData.due_date}
            onChange={handleChange}
            className="mt-1 p-2 border rounded w-full"
          />
        </div>
        <div className="flex justify-center mt-4 space-x-3">
        <button type="submit" className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded">
            Save Changes
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>

        </div>
      </form>
    </Modal>
  );
};

export default EditAssignmentModal;
