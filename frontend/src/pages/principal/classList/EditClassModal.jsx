import React, { useState, useEffect } from "react";

const EditClassModal = ({ classInfo, handleCloseModal, fetchClasses }) => {
  const [updatedClass, setUpdatedClass] = useState({
    class_code: classInfo.class_code,
    class_name: classInfo.class_name,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedClass((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Add API call to update class here
    console.log("Updated Class:", updatedClass);
    // Assuming the update API is implemented
    fetchClasses();  // Trigger the refetch of classes
    handleCloseModal();  // Close the modal after saving
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold text-purple-800">Edit Class</h2>
        <div className="mt-4">
          <input
            type="text"
            className="border border-gray-300 p-2 rounded w-full mb-4"
            placeholder="Class Code"
            name="class_code"
            value={updatedClass.class_code}
            onChange={handleInputChange}
          />
          <input
            type="text"
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="Class Name"
            name="class_name"
            value={updatedClass.class_name}
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

export default EditClassModal;
