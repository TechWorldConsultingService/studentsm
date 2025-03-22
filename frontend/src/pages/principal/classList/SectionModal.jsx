import React, { useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const SectionModal = ({
  classId,
  handleCloseSectionModal,
  fetchSections,
  initialSection,
}) => {
  const { access } = useSelector((state) => state.user);

  const isEdit = Boolean(initialSection && initialSection.id);
  const [sectionName, setSectionName] = useState(
    isEdit ? initialSection.section_name : ""
  );

  const handleSave = async () => {
    if (!sectionName.trim()) {
      toast.error("Section name cannot be empty.");
      return;
    }
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    try {
      if (isEdit) {
        // UPDATE (PUT)
        await axios.put(
          `http://localhost:8000/api/classes/${classId}/sections/${initialSection.id}/`,
          { section_name: sectionName },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        toast.success("Section updated successfully.");
      } else {
        // CREATE (POST)
        await axios.post(
          `http://localhost:8000/api/classes/${classId}/sections/`,
          { section_name: sectionName },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        toast.success("Section created successfully.");
      }
      fetchSections();
      handleCloseSectionModal();
    } catch (error) {
      toast.error("Error saving section: " + (error.message || error));
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          {isEdit ? "Edit Section" : "Add Section"}
        </h2>
        <input
          type="text"
          value={sectionName}
          onChange={(e) => setSectionName(e.target.value)}
          placeholder="Enter section name"
          className="border border-gray-300 p-2 rounded w-full"
        />
        <div className="mt-6 flex justify-center">
          <button
            onClick={handleSave}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 mr-4"
          >
            {isEdit ? "Update" : "Save"}
          </button>
          <button
            onClick={handleCloseSectionModal}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SectionModal;
