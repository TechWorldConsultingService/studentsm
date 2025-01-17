import React, { useState } from "react";

const SubmitModal = ({ assignment, showModal, handleClose, onSubmit }) => {


  const [file, setFile] = useState(null);
  const [text, setText] = useState("");

  if (!assignment) {
    return null; // If there's no assignment, don't render the modal
  }

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleTextChange = (e) => {
    setText(e.target.value);
  };

  const handleSubmit = () => {
    if (file || text) {
      onSubmit({ file, text, assignment });
      handleClose();
    } else {
      alert("Please provide a submission (file or text).");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
    <div className="p-6 bg-white shadow-lg rounded-lg">
    <h2 className=" text-xl font-semibold text-purple-800 mb-4">
        Homework:{" "} {assignment.assignment_name}
      </h2>
      <div className="flex flex-col space-y-1">
      <span className="mb-1">
        <strong className="text-purple-800">Class:{" "}</strong> {assignment.class_assigned}
      </span>
      <span className="mb-1">
        <strong className="text-purple-800">Subject:</strong> {assignment.subject}
      </span>
      <span className="mb-1">
        <strong className="text-purple-800">Topic:{" "}</strong> {assignment.assignment_name}
      </span>
      <span className="mb-1">
        <strong className="text-purple-800">Description:{" "}</strong> {assignment.description}
      </span>
      <span className="mb-1">
        <strong className="text-purple-800">Due Date:{" "}</strong> {assignment.due_date}
      </span>
      <span className="mb-1">
        <strong className="text-purple-800">Assign Date:{" "}</strong>{new Date(assignment.assigned_on).toISOString().split("T")[0]}
      </span>

      <div className="mb-3 mt-3">
  <label htmlFor="text" className=" text-gray-700 mb-3">
    <strong className="text-purple-800">Write Your Response:</strong> 
  </label>
  <textarea
    id="text"
    className="mt-2  w-full border border-purple-500 focus:border-purple-800 focus:outline-none focus:ring-0 focus:shadow-md"
    value={text}
    onChange={handleTextChange}
    rows="4"
  />


      <div className="mb-4">
        <label htmlFor="file" className=" text-gray-700">
        <strong className="text-purple-800">OR Upload File:</strong> 
        </label>
        <input
          type="file"
          id="file"
          className="m-1  block w-full"
          onChange={handleFileChange}
        />
      </div>
      </div>
      </div>
      <div className="flex justify-center space-x-5 ">
      <button
        onClick={handleSubmit}
        className="bg-purple-600 text-white py-2 px-4 rounded mr-2"
      >
        Submit
      </button>
      <button
        onClick={handleClose}
        className="bg-gray-300 text-black py-2 px-4 rounded"
      >
        Cancel
      </button>
      </div>
      
    </div>
    </div>
  );
};

export default SubmitModal;
