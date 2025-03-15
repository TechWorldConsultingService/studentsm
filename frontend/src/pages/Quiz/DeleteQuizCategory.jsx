import React from "react";
import axios from "axios";
import { Modal } from "antd";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

export default function DeleteQuizCategory({
  onClose,
  quizCategory,
  refreshQuizCategory,
}) {
  const { access } = useSelector(state => state.user);

  const handleDeleteQuizCategory = async () => {
    if (!access) {
      return toast.error("User is not authenticated. Please log in.");
    }

    try {
      await axios.delete(
        `http://localhost:8000/api/quizzes/${quizCategory.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      toast.success("Quize category deleted successfully.");
      refreshQuizCategory();
    } catch (error) {
      toast.error(
        "Error deleting quiz category: " +
          (error.response?.data?.detail || error.message)
      );
    }
  };

  return (
    <Modal
      centered
      footer={null}
      onCancel={onClose}
      open={!!quizCategory}
      title={
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          Are you sure you want to delete this quiz category:{" "}
          {quizCategory?.title}?
        </h2>
      }
    >
      <div className="mt-6 flex justify-center">
        <button
          type="submit"
          className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 mr-4"
          onClick={handleDeleteQuizCategory}
        >
          Yes, Delete
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
