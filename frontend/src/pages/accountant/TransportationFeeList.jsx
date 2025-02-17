import React, { useState, useEffect } from 'react';
import MainLayout from '../../layout/MainLayout';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import AddTransportationModal from './AddTransportationModal';
import EditTransportationModal from './EditTransportationModal';

const TransportationFeeList = () => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // State
  const [transportationList, setTransportationList] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedTransportation, setSelectedTransportation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // Delete confirmation modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [transportationToDelete, setTransportationToDelete] = useState(null);

  // Fetch data from API
  const fetchTransportationFees = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8000/api/transportation-fees/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setTransportationList(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error('Error fetching transportation fees:', error.message || error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransportationFees();
    // eslint-disable-next-line
  }, [access, navigate]);

  // Handlers
  const handleShowAddModal = () => {
    setIsEditMode(false);
    setSelectedTransportation(null);
    setShowModal(true);
  };

  const handleShowEditModal = (transportation) => {
    setIsEditMode(true);
    setSelectedTransportation(transportation);
    setShowModal(true);
  };

  const handleCloseModal = () => setShowModal(false);

  // View details (optional if you want a separate modal/view)
  const handleViewDetails = (transportation) => {
    setSelectedTransportation(transportation);
  };

  const handleCloseDetails = () => {
    setSelectedTransportation(null);
  };

  // Delete
  const handleConfirmDelete = (id) => {
    setTransportationToDelete(id);
    setShowDeleteModal(true);
  };

  const handleDeleteTransportation = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/api/transportation-fees/${transportationToDelete}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      toast.success('Transportation Fee deleted successfully');
      setTransportationList((prev) => prev.filter((item) => item.id !== transportationToDelete));
    } catch (error) {
      toast.error('Error deleting transportation fee');
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  // Render
  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Transportation Fees</h1>

          {/* Add Transportation Button */}
          <div className="mt-6">
            <button
              onClick={handleShowAddModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Add Transportation Fee
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">All Transportation Fees</h2>
            <p className="mt-4 text-gray-600">
              Below is the list of transportation fees (place & amount).
            </p>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-gray-600">Loading...</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Place</th>
                    <th className="px-4 py-2 text-left">Amount</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transportationList.length > 0 ? (
                    transportationList.map((item) => (
                      <tr key={item.id} className="border-b hover:bg-purple-50">
                        <td className="px-4 py-2">{item.id}</td>
                        <td className="px-4 py-2">{item.place}</td>
                        <td className="px-4 py-2">{item.amount}</td>
                        <td className="px-4 py-2">
                          {/* View */}
                          <button
                            onClick={() => handleViewDetails(item)}
                            className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 mr-2"
                          >
                            View
                          </button>
                          {/* Edit */}
                          <button
                            onClick={() => handleShowEditModal(item)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                          >
                            Edit
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => handleConfirmDelete(item.id)}
                            className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-gray-600 py-4">
                        No transportation fees available.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* View Details Modal (Optional) */}
        {selectedTransportation && !isEditMode && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold text-purple-800">Transportation Details</h2>
              <div className="mt-4">
                <p className="text-gray-700"><strong>ID:</strong> {selectedTransportation.id}</p>
                <p className="text-gray-700"><strong>Place:</strong> {selectedTransportation.place}</p>
                <p className="text-gray-700"><strong>Amount:</strong> {selectedTransportation.amount}</p>
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold text-purple-800">
                Are you sure you want to delete this transportation fee?
              </h2>
              <div className="mt-4 text-center">
                <button
                  onClick={handleDeleteTransportation}
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

        {/* Add or Edit Modal */}
        {showModal && (
          isEditMode ? (
            <EditTransportationModal
              transportation={selectedTransportation}
              handleCloseModal={handleCloseModal}
              fetchTransportationFees={fetchTransportationFees}
            />
          ) : (
            <AddTransportationModal
              handleCloseModal={handleCloseModal}
              fetchTransportationFees={fetchTransportationFees}
            />
          )
        )}
      </div>
    </MainLayout>
  );
};

export default TransportationFeeList;
