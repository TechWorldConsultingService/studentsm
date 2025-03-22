import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { Button, Modal } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Loader } from "../../../components/Spinner";

const commentValidationSchema = Yup.object().shape({
  content: Yup.string()
    .trim()
    .required("Content is required.")
    .typeError("Content must be a string."),
});

export default function EditComment({
  refresh,
  editReply,
  discussion,
  onClose = () => {},
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { access } = useSelector(state => state.user);

  const formik = useFormik({
    initialValues: { content: editReply?.content || "" },
    enableReinitialize: true,
    validationSchema: commentValidationSchema,
    onSubmit: async values => {
      if (!access) {
        return toast.error("User is not authenticated. Please log in.");
      }

      try {
        setIsLoading(true);

        await axios.put(
          `http://localhost:8000/api/forum/posts/${discussion.id}/comments/`,
          { ...values, parent: editReply.id },
          {
            headers: { Authorization: `Bearer ${access}` },
          }
        );

        toast.success("Comment updated successfully.");

        refresh();
        onClose();
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Authentication error. Please log in again.");
        } else {
          toast.error(
            "Error saving comment: " +
              (error.response?.data?.detail || error.message)
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleCancel = () => {
    formik.resetForm();
    onClose();
  };

  return (
    <Modal
      centered
      footer={null}
      onCancel={onClose}
      open={!!editReply}
      title={
        <div className="flex items-baseline gap-1">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">
            Edit Comment
          </h2>
        </div>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <textarea
          rows="3"
          id="content"
          name="content"
          placeholder="Add a comment"
          value={formik.values.content}
          onChange={formik.handleChange}
          className={`w-full border p-2 rounded focus:outline-1  ${
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

        <div className="flex justify-end gap-2">
          <Button
            color="purple"
            variant="solid"
            htmlType="submit"
            disabled={isLoading}
          >
            <div className="flex items-center gap-2">
              {isLoading ? <Loader /> : null} <span>Save</span>
            </div>
          </Button>
          <Button onClick={handleCancel} className="bg-gray-500 text-white ">
            Cancel
          </Button>
        </div>
      </form>
    </Modal>
  );
}
