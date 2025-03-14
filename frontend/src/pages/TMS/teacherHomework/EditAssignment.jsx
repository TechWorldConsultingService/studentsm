import React, { useState } from "react";

const EditAssignment = ({ assignment, closeModal, fetchHomeworkList }) => {
  const [formData, setFormData] = useState({
    subject: assignment.subject,
    assignment_name: assignment.assignment_name,
    description: assignment.description,
    due_date: assignment.due_date,
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Update the assignment via API
    fetch(`http://localhost:8000/api/teacher/assignments/${assignment.id}/`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        }
        throw new Error("Failed to update assignment");
      })
      .then((data) => {
        fetchHomeworkList(); // Refresh list
        closeModal();
      })
      .catch((error) => {
        console.error("Error updating assignment:", error);
        // Optionally display error feedback here
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-gray-700">Subject:</label>
        <input
          type="text"
          name="subject"
          value={formData.subject}
          onChange={handleChange}
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Topic:</label>
        <input
          type="text"
          name="assignment_name"
          value={formData.assignment_name}
          onChange={handleChange}
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Description:</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">Due Date:</label>
        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          className="mt-1 p-2 border rounded w-full"
        />
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={closeModal}
          className="mr-4 px-4 py-2 bg-gray-400 text-white rounded"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default EditAssignment;
