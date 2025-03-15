import React from "react";
import axios from "axios";
import * as Yup from "yup";
import { Modal } from "antd";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const quizeCategorySchema = Yup.object().shape({
  title: Yup.string()
    .required("Quiz category title is required.")
    .typeError("Quiz category title must be a string."),
});

export default function AddEditQuizCategory({
  quizCategory,
  onClose,
  refreshQuizCategory,
  open,
}) {
  const { access } = useSelector(state => state.user);

  const isEdit = Boolean(quizCategory && quizCategory.id);

  const formik = useFormik({
    initialValues: {
      title: quizCategory?.title || "",
    },
    validationSchema: quizeCategorySchema,
    onSubmit: async values => {
      if (!access) {
        return toast.error("User is not authenticated. Please log in.");
      }
      try {
        if (isEdit) {
          // EDIT
          await axios.put(
            `http://localhost:8000/api/quizzes/${quizCategory.id}/`,
            values,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access}`,
              },
            }
          );
          toast.success("Quiz Category updated successfully.");
        } else {
          // ADD
          await axios.post("http://localhost:8000/api/quizzes/", values, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          });
          toast.success("Quiz category added successfully.");
        }
        refreshQuizCategory();
        onClose();
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Authentication error. Please log in again.");
        } else {
          toast.error(
            "Error saving quiz category: " +
              (error.response?.data?.detail || error.message)
          );
        }
      }
    },
  });

  return (
    <Modal
      centered
      open={open}
      footer={null}
      onCancel={onClose}
      title={
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          {isEdit ? "Edit Quiz Category" : "Add Quiz Category"}{" "}
        </h2>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold" htmlFor="title">
            Category Title
          </label>
          <input
            id="title"
            type="text"
            name="title"
            onBlur={formik.handleBlur}
            value={formik.values.title}
            placeholder="Enter title"
            onChange={formik.handleChange}
            className="border border-gray-300 p-2 rounded w-full mt-1"
          />
          {formik.touched.title && formik.errors.title && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.title}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 mr-4"
          >
            <div className="flex items-center gap-1">
              {formik.isSubmitting ? <span className="sms-loader" /> : null}
              {isEdit ? "Update" : "Save"}
            </div>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
