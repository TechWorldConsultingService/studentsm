import axios from "axios";
import * as Yup from "yup";
import { Modal } from "antd";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Loader } from "../../components/Spinner";

const discussionValidationSchema = Yup.object().shape({
  topic: Yup.string()
    .trim()
    .required("Topic is required.")
    .typeError("Topic must be a string."),
  content: Yup.string()
    .trim()
    .required("Content is required.")
    .min(20)
    .typeError("Content must be a string."),
});

export default function AddEditDiscussion({
  open,
  onClose,
  refresh,
  discussion,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { access } = useSelector(state => state.user);

  const formik = useFormik({
    initialValues: {
      topic: discussion?.topic || "",
      content: discussion?.content || "",
    },
    validationSchema: discussionValidationSchema,
    onSubmit: async values => {
      if (!access) {
        return toast.error("User is not authenticated. Please log in.");
      }

      try {
        setIsLoading(true);
        let method = "post";
        let url = "http://localhost:8000/api/forum/posts/";

        if (discussion) {
          method = "put";
          url = `http://localhost:8000/api/forum/posts/${discussion.id}/`;
        }

        await axios({
          method,
          url,
          data: values,
          headers: { Authorization: `Bearer ${access}` },
        });

        toast.success(
          `Discussion ${discussion ? "added" : "updated"} successfully.`
        );

        refresh();
        onClose();
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Authentication error. Please log in again.");
        } else {
          toast.error(
            "Error saving discussion: " +
              (error.response?.data?.detail || error.message)
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <Modal
      centered
      footer={null}
      onCancel={onClose}
      open={open}
      title={
        <div className="flex items-baseline gap-1">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">
            Add Discussion
          </h2>
        </div>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold" htmlFor="topic">
            Topic
          </label>
          <input
            id="topic"
            type="text"
            name="topic"
            onBlur={formik.handleBlur}
            placeholder="Enter topic"
            value={formik.values.topic}
            onChange={formik.handleChange}
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 ${
              formik.touched.content && formik.errors.content
                ? "border-red-500"
                : "border-gray-300"
            }`}
          />
          {formik.touched.topic && formik.errors.topic && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.topic}
            </div>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-semibold">
            Content
          </label>
          <textarea
            rows="4"
            id="content"
            name="content"
            placeholder="Enter content"
            onBlur={formik.handleBlur}
            onChange={formik.handleChange}
            value={formik.values.content}
            className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 ${
              formik.touched.content && formik.errors.content
                ? "border-red-500"
                : "border-gray-300"
            }`}
          ></textarea>
          {formik.touched.content && formik.errors.content && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.content}
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 mr-4"
            disabled={isLoading}
          >
            <div className="flex items-center gap-2">
              {isLoading ? <Loader /> : null} <span>Save</span>
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
