// SectionListModal.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import SectionModal from "./SectionModal";

const SectionListModal = ({ classId, handleCloseSectionListModal }) => {
  const { access } = useSelector((state) => state.user);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [editingSection, setEditingSection] = useState(null);

  const fetchSections = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(`http://localhost:8000/api/classes/${classId}/sections/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setSections(data);
    } catch (error) {
      toast.error("Error fetching sections");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSections();
  }, [classId]);

  const handleAddSection = () => {
    setEditingSection(null);
    setShowSectionModal(true);
  };

  const handleEditSection = (section) => {
    setEditingSection(section);
    setShowSectionModal(true);
  };

  const handleDeleteSection = async (sectionId) => {
    try {
      await axios.delete(`http://localhost:8000/api/classes/${classId}/sections/${sectionId}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      toast.success("Section deleted successfully");
      fetchSections();
    } catch (error) {
      toast.error("Error deleting section");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold text-purple-800">Sections</h2>
        <div className="mt-4">
          {loading ? (
            <p>Loading sections...</p>
          ) : (
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-4 py-2">Section Name</th>
                  <th className="px-4 py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sections.map((section) => (
                  <tr key={section.id} className="border-b">
                    <td className="px-4 py-2">{section.section_name}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleEditSection(section)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSection(section.id)}
                        className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <div className="mt-4">
          <button
            onClick={handleAddSection}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
          >
            Add Section
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            onClick={handleCloseSectionListModal}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Close
          </button>
        </div>
        {showSectionModal && (
          <SectionModal
            classId={classId}
            handleCloseSectionModal={() => setShowSectionModal(false)}
            fetchSections={fetchSections}
            initialSection={editingSection}
          />
        )}
      </div>
    </div>
  );
};

export default SectionListModal;
