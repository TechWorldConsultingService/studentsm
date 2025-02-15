import React, { useState, useEffect } from "react";
import MainLayout from "../../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import AddAccountentModal from "./AddAccountentModal";
import EditAccountentModal from "./EditAccountentModal";

const AccountentList = () => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [accountentList, setAccountentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAccountent, setSelectedAccountent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [accountentToDelete, setAccountentToDelete] = useState(null);

  // Fetch accountants
  const fetchAccountents = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8000/api/accountents/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setAccountentList(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error fetching accountants.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountents();
    // eslint-disable-next-line
  }, [access, navigate]);

  const handleViewDetails = (accountentInfo) => {
    setSelectedAccountent(accountentInfo);
    setShowModal(false);
    setIsEditMode(false);
  };

  const handleCloseDetails = () => {
    setSelectedAccountent(null);
  };

  const handleShowAddModal = () => {
    setIsEditMode(false);
    setShowModal(true);
  };

  const handleShowEditModal = (accountentInfo) => {
    setIsEditMode(true);
    setSelectedAccountent(accountentInfo);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleConfirmDelete = (accountentId) => {
    setAccountentToDelete(accountentId);
    setShowDeleteModal(true);
  };

  const handleDeleteAccountent = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      await axios.delete(
        `http://localhost:8000/api/accountents/${accountentToDelete}/delete/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      setAccountentList((prev) =>
        prev.filter((acct) => acct.id !== accountentToDelete)
      );
      toast.success("Accountant deleted successfully.");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error("Error deleting accountant.");
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Accountants</h1>

          <div className="mt-6">
            <button
              onClick={handleShowAddModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Add Accountant
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">
              Available Accountants
            </h2>
            <p className="mt-4 text-gray-600">
              List of accountants with their details.
            </p>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-gray-600">Loading...</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-4 py-2 text-left">Accountant Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {accountentList.length > 0 ? (
                    accountentList.map((acct) => (
                      <tr
                        key={acct.id}
                        className="border-b hover:bg-purple-50"
                      >
                        <td className="px-4 py-2">
                          {acct.user?.first_name} {acct.user?.last_name}
                        </td>
                        <td className="px-4 py-2">{acct.user?.email}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleViewDetails(acct)}
                            className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 mr-2"
                          >
                            View Details
                          </button>
                          <button
                            onClick={() => handleShowEditModal(acct)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleConfirmDelete(acct.id)}
                            className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="px-4 py-2 text-gray-600">
                        No accountants found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Details Modal */}
        {selectedAccountent && !isEditMode && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold text-purple-800">
                Accountant Details
              </h2>
              <div className="mt-4">
                <p className="text-gray-700">
                  <strong>Username:</strong> {selectedAccountent.user?.username}
                </p>
                <p className="text-gray-700">
                  <strong>Name:</strong>{" "}
                  {selectedAccountent.user?.first_name}{" "}
                  {selectedAccountent.user?.last_name}
                </p>
                <p className="text-gray-700">
                  <strong>Email:</strong> {selectedAccountent.user?.email}
                </p>
                <p className="text-gray-700">
                  <strong>Phone:</strong> {selectedAccountent.phone}
                </p>
                <p className="text-gray-700">
                  <strong>Address:</strong> {selectedAccountent.address}
                </p>
                <p className="text-gray-700">
                  <strong>Gender:</strong> {selectedAccountent.gender}
                </p>
                <p className="text-gray-700">
                  <strong>Date of Joining:</strong>{" "}
                  {selectedAccountent.date_of_joining}
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

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold text-purple-800">
                Confirm Deletion
              </h2>
              <p className="mt-4 text-gray-700">
                Are you sure you want to delete this accountant?
              </p>
              <div className="mt-6 text-center">
                <button
                  onClick={handleDeleteAccountent}
                  className="bg-red-700 text-white px-6 py-2 rounded-lg hover:bg-red-800 mr-4"
                >
                  Yes, Delete
                </button>
                <button
                  onClick={handleCloseDeleteModal}
                  className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
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
            <EditAccountentModal
              accountentInfo={selectedAccountent}
              handleCloseModal={handleCloseModal}
              fetchAccountents={fetchAccountents}
            />
          ) : (
            <AddAccountentModal
              handleCloseModal={handleCloseModal}
              fetchAccountents={fetchAccountents}
            />
          ))}
      </div>
    </MainLayout>
  );
};

export default AccountentList;
