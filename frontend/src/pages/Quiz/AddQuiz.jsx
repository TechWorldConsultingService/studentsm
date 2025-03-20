import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";

import ViewQuizzes from "./ViewQuizzes";
import MainLayout from "../../layout/MainLayout";
import DeleteQuizCategory from "./DeleteQuizCategory";
import AddEditQuizCategory from "./AddEditQuizCategory";
import AddEditQuizQuestion from "./AddEditQuizQuestion";

export default function AddQuiz() {
  const navigate = useNavigate();
  const { access } = useSelector(state => state.user);

  const [loading, setLoading] = useState(false);
  const [quizCategoryList, setQuizCategoryList] = useState([]);
  const [selectedQuizCategory, setSelectedQuizCategory] = useState(null);
  const [quizCategoryToDelete, setQuizCategoryToDelete] = useState(null);
  const [showQuizCategoryModal, setShowQuizeCategoryModal] = useState(false);
  const [addQuizQuestionCategory, setAddQuizQuestionCategory] = useState(null);

  const fetchQuizCategories = async () => {
    if (!access) {
      return toast.error("User is not authenticated. Please log in.");
    }
    setLoading(true);

    try {
      const { data } = await axios.get("http://localhost:8000/api/quizzes/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setQuizCategoryList(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error(
          "Error fetching quiz category: " + (error.message || error)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizCategories();
  }, []);

  const handleShowQuizCategoryModal = () => {
    setShowQuizeCategoryModal(true);
  };

  const closeQuizzesModal = () => {
    setQuizCategoryToDelete(null);
    setSelectedQuizCategory(null);
    setAddQuizQuestionCategory(null);
    setShowQuizeCategoryModal(false);
  };

  const handleConfirmDelete = quizCategory => {
    setQuizCategoryToDelete(quizCategory);
  };

  const handleViewQuizzes = quizItem => {
    setSelectedQuizCategory(quizItem);
  };

  const handleAddQuizeQuestions = quizItem => {
    setAddQuizQuestionCategory(quizItem);
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Quiz</h1>

          <div className="mt-6">
            <button
              onClick={handleShowQuizCategoryModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Add Quiz Category
            </button>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-gray-600">Loading...</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              {quizCategoryList.length === 0 ? (
                <div className="text-gray-600">No quiz found.</div>
              ) : (
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-purple-700 text-white">
                      <th className="px-4 py-2 text-left">Title</th>
                      <th className="px-4 py-2 text-left">Highest Score</th>
                      <th className="px-4 py-2 text-left">Highest Scorer</th>
                      <th className="px-4 py-2 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizCategoryList.map(quizItem => (
                      <tr
                        key={quizItem.id}
                        className="border-b hover:bg-purple-50"
                      >
                        <td className="px-4 py-2">{quizItem.title}</td>
                        <td className="px-4 py-2">
                          {quizItem.highes_socre || "N/A"}
                        </td>

                        <td className="px-4 py-2">
                          {quizItem.highes_socrer || "N/A"}
                        </td>

                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleAddQuizeQuestions(quizItem)}
                            className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 mr-2"
                          >
                            Add Quiz Question
                          </button>
                          <button
                            onClick={() => handleViewQuizzes(quizItem)}
                            className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 mr-2"
                          >
                            View Quizzes
                          </button>
                          <button
                            onClick={() => handleConfirmDelete(quizItem)}
                            className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 mr-2"
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
          )}
        </div>
      </div>

      {showQuizCategoryModal && (
        <AddEditQuizCategory
          onClose={closeQuizzesModal}
          open={showQuizCategoryModal}
          refreshQuizCategory={fetchQuizCategories}
        />
      )}

      {addQuizQuestionCategory && (
        <AddEditQuizQuestion
          onClose={closeQuizzesModal}
          addQuizQuestionCategory={addQuizQuestionCategory}
        />
      )}

      <ViewQuizzes
        onClose={closeQuizzesModal}
        refreshQuizCategory={fetchQuizCategories}
        selectedQuizCategory={selectedQuizCategory}
      />

      <DeleteQuizCategory
        onClose={closeQuizzesModal}
        quizCategory={quizCategoryToDelete}
        refreshQuizCategory={fetchQuizCategories}

      />
    </MainLayout>
  );
}
