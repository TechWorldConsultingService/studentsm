import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import AddClassModal from "./AddClassModal";
import EditClassModal from "./EditClassModal";

const ClassList = () => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [classList, setClassList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch classes when the component mounts
  const fetchClasses = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8000/api/classes/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setClassList(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error fetching classes:", error.message || error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [access, navigate]);

  const handleViewDetails = (classInfo) => {
    setSelectedClass(classInfo);
  };

  const handleCloseDetails = () => {
    setSelectedClass(null);
  };

  // Open modal for adding a class
  const handleShowAddModal = () => {
    setIsEditMode(false); // This is for Add mode
    setShowModal(true);
  };

  // Open modal for editing a class
  const handleShowEditModal = (classInfo) => {
    setIsEditMode(true);
    setSelectedClass(classInfo);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDeleteClass = (classCode) => {
    setClassList((prev) =>
      prev.filter((classItem) => classItem.class_code !== classCode)
    );
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Classes</h1>

          <div className="mt-6">
            <button
              onClick={handleShowAddModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Add Class
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">
              Available Classes
            </h2>
            <p className="mt-4 text-gray-600">Class with their details.</p>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-gray-600">
              Loading classes...
            </div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-4 py-2 text-left">Class Code</th>
                    <th className="px-4 py-2 text-left">Class Name</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classList.map((classItem) => (
                    <tr
                      key={classItem.class_code}
                      className="border-b hover:bg-purple-50"
                    >
                      <td className="px-4 py-2">{classItem.class_code}</td>
                      <td className="px-4 py-2">{classItem.class_name}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleViewDetails(classItem)}
                          className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 mr-2"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleShowEditModal(classItem)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteClass(classItem.class_code)
                          }
                          className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for class details */}
        {selectedClass && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold text-purple-800">
                Class Details
              </h2>
              <div className="mt-4">
                <p className="text-gray-700">
                  <strong>Class Code:</strong> {selectedClass.class_code}
                </p>
                <p className="text-gray-700">
                  <strong>Class Name:</strong> {selectedClass.class_name}
                </p>

                <p className="text-gray-700">
                  <strong>Subject List:</strong> Subject code along with subject name:
                  <br />
                  {selectedClass.subject_details.map((subject) => (
                    <span key={subject.subject_code} className="mx-24">
                      {subject.subject_code} &nbsp; &nbsp; {subject.subject_name}
                      <br />
                    </span>
                  ))}
                </p>

              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={handleCloseDetails}
                  className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add or Edit Modal */}
        {showModal &&
          (isEditMode ? (
            <EditClassModal
              classInfo={selectedClass}
              handleCloseModal={handleCloseModal}
              fetchClasses={fetchClasses} // Pass fetchClasses to Edit Modal
            />
          ) : (
            <AddClassModal
              handleCloseModal={handleCloseModal}
              fetchClasses={fetchClasses} // Pass fetchClasses to Add Modal
            />
          ))}
      </div>
    </MainLayout>
  );
};

export default ClassList;
