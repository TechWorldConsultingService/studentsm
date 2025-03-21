import React, { useState, useEffect } from 'react';
import MainLayout from '../../layout/MainLayout';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import AddCategoryModal from './AddCategoryModal';
import EditCategoryModal from './EditCategoryModal';

const CategoryList = () => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [categoryList, setCategoryList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  const fetchCategories = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    setLoading(true);

    try {
      const { data } = await axios.get("http://localhost:8000/api/fee-names/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setCategoryList(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error('Error fetching categories:', error.message || error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [access, navigate]);


  // Show Add & Edit
  const handleShowAddModal = () => {
    setIsEditMode(false);
    setSelectedCategory(null);
    setShowModal(true);
  };

  const handleShowEditModal = (category) => {
    setIsEditMode(true);
    setSelectedCategory(category);
    setShowModal(true);
  };

  // Close modal
  const handleCloseModal = () => setShowModal(false);

  // Delete
  const handleConfirmDelete = (categoryId) => {
    setCategoryToDelete(categoryId);
    setShowDeleteModal(true);
  };

  const handleDeleteCategory = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/api/fee-names/${categoryToDelete}/`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      setCategoryList((prev) => prev.filter((cat) => cat.id !== categoryToDelete));
      toast.success('Category deleted successfully');
      setShowDeleteModal(false);
    } catch (error) {
      toast.error('Error deleting category');
    }
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Categories (Fee Names)</h1>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleShowAddModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Add Category
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">Available Categories</h2>
            <p className="mt-4 text-gray-600">List of fee categories with their details.</p>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-gray-600">Loading...</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-4 py-2 text-left">S.N.</th>
                    <th className="px-4 py-2 text-left">Category Name</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categoryList.length > 0 ? (
                    categoryList.map((category,index) => (
                      <tr key={category.id} className="border-b hover:bg-purple-50">
                        <td className="px-4 py-2">{index+1}</td>
                        <td className="px-4 py-2">{category.name}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleShowEditModal(category)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleConfirmDelete(category.id)}
                            className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center text-gray-600 py-4">
                        No categories available.
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
                Are you sure you want to delete this category?
              </h2>
              <div className="mt-4 text-center">
                <button
                  onClick={handleDeleteCategory}
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
        {showModal && (
          isEditMode ? (
            <EditCategoryModal
              category={selectedCategory}
              handleCloseModal={handleCloseModal}
              fetchCategories={fetchCategories}
            />
          ) : (
            <AddCategoryModal
              handleCloseModal={handleCloseModal}
              fetchCategories={fetchCategories}
            />
          )
        )}
      </div>
    </MainLayout>
  );
};

export default CategoryList;
