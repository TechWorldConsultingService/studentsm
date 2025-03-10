import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddNewNote = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle tip submission (in a real application, you'd save this data to a backend or state)
    console.log("New Tip Added:", { title, description, date });

    // Reset the form fields
    setTitle("");
    setDescription("");
    setDate("");

    // Redirect to the notes page
    navigate("/notes");
  };

  return (
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">Add New Tip</h1>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold" htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows="4"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold" htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mt-6 text-center">
            <button type="submit" className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none">
              Submit Tip
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewNote;
