import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

const EditMessageModal = ({ messageData, onClose, refreshMessages }) => {
  const { access } = useSelector((state) => state.user);

  const formik = useFormik({
    initialValues: {
      message: messageData.message || "",
    },
    validationSchema: Yup.object({
      message: Yup.string().required("Message is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await axios.put(
          `http://localhost:8000/api/messages/${messageData.id}/`,
          { message: values.message },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        toast.success("Message updated successfully!");
        refreshMessages();
      } catch (error) {
        toast.error("Failed to update message.");
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold mb-4 text-purple-800">
          Edit Message
        </h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Message
            </label>
            <textarea
              name="message"
              rows="4"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            ></textarea>
            {formik.touched.message && formik.errors.message && (
              <div className="text-red-500 text-sm">
                {formik.errors.message}
              </div>
            )}
          </div>

          <div className="text-center space-x-5">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              {formik.isSubmitting ? "Updating..." : "Update"}
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
      </div>
    </div>
  );
};

export default EditMessageModal;
