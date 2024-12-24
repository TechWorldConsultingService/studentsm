import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { Select } from "antd";

const EditClassModal = ({ classInfo, handleCloseModal, fetchClasses }) => {
  const { access } = useSelector((state) => state.user);

  const [updatedClass, setUpdatedClass] = useState({
    class_code: classInfo.class_code,
    class_name: classInfo.class_name,
    subjects: classInfo.subject_details || [], // Initialize with full subject details
  });

  const [allSubjects, setAllSubjects] = useState([]);

  useEffect(() => {
    // Fetch all subjects from the server to populate the dropdown
    const fetchSubjects = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/subjects/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
        setAllSubjects(response.data); // Store all subjects in the state
      } catch (error) {
        toast.error("Error fetching subjects.");
      }
    };

    fetchSubjects();
  }, [access]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedClass((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Update subjects when Select changes
  const handleSubjectsChange = (selectedSubjects) => {
    // Map the selected subject names to their full subject objects
    const updatedSubjects = selectedSubjects.map((subjectName) => {
      return allSubjects.find((subject) => subject.subject_name === subjectName);
    });

    setUpdatedClass((prevState) => ({
      ...prevState,
      subjects: updatedSubjects, // Store the full subject objects
    }));
  };

  const handleSave = async () => {
    if (
      !updatedClass.class_code ||
      !updatedClass.class_name ||
      !updatedClass.subjects.length
    ) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:8000/api/classes/${classInfo.class_code}/`,
        updatedClass, // Send updatedClass directly (with full subject details)
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Class updated successfully.");
        fetchClasses();
        handleCloseModal();
      }
    } catch (error) {
      toast.error(
        "Error updating class: " + (error.response?.data?.detail || error.message)
      );
    }
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
          <Select
            mode="multiple"
            name="subjects"
            placeholder="Select all subjects"
            className="border border-gray-300 p-2 rounded w-full"
            onChange={handleSubjectsChange}
            value={updatedClass.subjects.map((subject) => subject.subject_name)} // Display subject names in the dropdown
          >
            {/* Render all available subjects */}
            {allSubjects.map((item) => (
              <Select.Option key={item.id} value={item.subject_name}>
                {item.subject_name}
              </Select.Option>
            ))}
          </Select>
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
