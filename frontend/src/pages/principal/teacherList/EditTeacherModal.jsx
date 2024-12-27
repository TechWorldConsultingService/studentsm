import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const EditTeacherModal = ({ teacher, handleCloseModal, fetchTeachers }) => {
  const { access } = useSelector((state) => state.user);
  const [updatedTeacher, setUpdatedTeacher] = useState({
    teacher_code: teacher.teacher_code,
    teacher_name: teacher.teacher_name,
  });

  useEffect(() => {
    setUpdatedTeacher({
      teacher_code: teacher.teacher_code,
      teacher_name: teacher.teacher_name,
    });
  }, [teacher]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedTeacher((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!updatedTeacher.teacher_code || !updatedTeacher.teacher_name) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8000/api/teachers/${teacher.id}/`,
        updatedTeacher,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Teacher updated successfully.");
        fetchTeachers(); // Refresh the teachers list
        handleCloseModal();
      }
    } catch (error) {
      toast.error("Error updating teacher: " + (error.response?.data?.detail || error.message));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold text-purple-800">Edit Teacher</h2>
        <div className="mt-4">
          <input
            type="text"
            className="border border-gray-300 p-2 rounded w-full mb-4"
            placeholder="Teacher Code"
            name="teacher_code"
            value={updatedTeacher.teacher_code}
            onChange={handleInputChange}
          />
          <input
            type="text"
            className="border border-gray-300 p-2 rounded w-full"
            placeholder="Teacher Name"
            name="teacher_name"
            value={updatedTeacher.teacher_name}
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

export default EditTeacherModal;
