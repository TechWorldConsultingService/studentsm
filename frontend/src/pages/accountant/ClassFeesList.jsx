import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

import AddClassFeeModal from "./AddClassFeeModal";
import EditClassFeeModal from "./EditClassFeeModal";


const ClassFeesList = () => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [classes, setClasses] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [classFees, setClassFees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [feeToDelete, setFeeToDelete] = useState(null);

  // 1. Fetch all classes
  const fetchClasses = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      const { data } = await axios.get("http://localhost:8000/api/classes/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setClasses(data);
      if (data.length > 0) {
        setSelectedClassId(data[0].id);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error fetching classes:", error.message || error);
      }
    }
  };

  // 2. Fetch fees for the selected class
  const fetchClassFees = async (classId) => {
    if (!access) return;
    if (!classId) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/fee-categories/${classId}/`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          }
        }
      );
      setClassFees(data);
    } catch (error) {
      toast.error("Error fetching fees for class");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [access]);

  useEffect(() => {
    if (selectedClassId) {
      fetchClassFees(selectedClassId);
    }
  }, [selectedClassId]);

  // Handlers
  const handleShowAddModal = () => {
    setIsEditMode(false);
    setSelectedFee(null);
    setShowModal(true);
  };

  const handleShowEditModal = (fee) => {
    setIsEditMode(true);
    setSelectedFee(fee);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  // Delete
  const handleConfirmDelete = (categoryId) => {
    setFeeToDelete(categoryId);
    setShowDeleteModal(true);
  };

  const handleDeleteFee = async () => {
    if (!access || !selectedClassId || !feeToDelete) {
      toast.error("Missing authentication or selection.");
      return;
    }
    try {
      await axios.delete(
        `http://localhost:8000/api/fee-categories/${selectedClassId}/${feeToDelete}/`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      toast.success("Fee deleted successfully");
      setClassFees((prev) => prev.filter((item) => item.fee_category_name !== feeToDelete));
    } catch (error) {
      toast.error("Error deleting fee");
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Class Fees</h1>

           {/* Add Fee Button */}
           <div className="mt-6">
            <button
              onClick={handleShowAddModal}
              disabled={!selectedClassId}
              className={`${
                selectedClassId ? "bg-purple-700 hover:bg-purple-800" : "bg-gray-400"
              } text-white px-6 py-2 rounded-lg`}
            >
              Add Fee
            </button>
          </div>


          {/* Choose a Class */}
          <div className="mt-4">
            <label className="block text-gray-700 mb-2">Select Class:</label>
            <select
              className="border border-gray-300 p-2 rounded w-full md:w-1/2"
              value={selectedClassId || ""}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="">Select Class</option>
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_name} ({cls.class_code})
                  </option>
                ))
              ) : (
                <option value="">No classes available</option>
              )}
            </select>
          </div>

         
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">Fees for Selected Class</h2>
            <p className="mt-4 text-gray-600">
              Showing fees for class ID:{" "}
              <span className="font-bold">{selectedClassId || "None"}</span>
            </p>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-gray-600">Loading...</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-4 py-2 text-left">Category ID</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {classFees && classFees.length > 0 ? (
                    classFees.map((item) => (
                      <tr
                        key={item.fee_category_name}
                        className="border-b hover:bg-purple-50"
                      >
                        <td className="px-4 py-2">{item.fee_category_name}</td>
                        <td className="px-4 py-2">{item.amount}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleShowEditModal(item)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleConfirmDelete(item.fee_category_name)}
                            className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="3"
                        className="text-center text-gray-600 py-4"
                      >
                        No fees available for this class.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold text-purple-800">
                Are you sure you want to delete this fee?
              </h2>
              <div className="mt-4 text-center">
                <button
                  onClick={handleDeleteFee}
                  className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 mr-4"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={handleCloseDeleteModal}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && !isEditMode && (
          <AddClassFeeModal
            classId={selectedClassId}
            handleCloseModal={handleCloseModal}
            fetchClassFees={fetchClassFees}
          />
        )}
        {showModal && isEditMode && (
          <EditClassFeeModal
            classId={selectedClassId}
            fee={selectedFee}
            handleCloseModal={handleCloseModal}
            fetchClassFees={fetchClassFees}
          />
        )}
      </div>
    </MainLayout>
  );
};

export default ClassFeesList;
