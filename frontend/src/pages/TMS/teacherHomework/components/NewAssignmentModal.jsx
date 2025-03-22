import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "./Modal";

const newAssignmentSchema = Yup.object().shape({
  subject: Yup.string().required("Subject is required"),
  assignment_name: Yup.string().required("Assignment Name is required"),
  description: Yup.string().required("Description is required"),
  due_date: Yup.date().required("Due Date is required"),
});

const NewAssignmentModal = ({
  isOpen,
  onClose,
  access,
  subjectList = [],
  selectedClass,
  fetchHomeworkList,
}) => {
  const formik = useFormik({
    initialValues: {
      subject: "",
      class_assigned: selectedClass,
      assignment_name: "",
      description: "",
      due_date: "",
    },
    validationSchema: newAssignmentSchema,
    onSubmit: async (values) => {
      try {
        if (!access) {
          toast.error("Authentication token is missing.");
          return;
        }
        await axios.post("http://localhost:8000/api/assignments/assign/", values, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
        toast.success("Assignment created successfully!");
        fetchHomeworkList();
        onClose();
      } catch (err) {
        toast.error("Error creating assignment.");
      }
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h1 className="font-bold text-2xl text-purple-700 mb-4">
        Add New Homework
      </h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-purple-600">Class</label>
          <input
            type="text"
            name="class_assigned"
            value={formik.values.class_assigned}
            onChange={formik.handleChange}
            disabled
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Subject */}
        <div>
          <label className="block text-purple-600">Subject</label>
          <select
            name="subject"
            value={formik.values.subject}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          >
            <option value="">Select Subject</option>
            {subjectList.map((sub) => (
              <option key={sub.id} value={sub.subject_name}>
                {sub.subject_name}
              </option>
            ))}
          </select>
          {formik.touched.subject && formik.errors.subject && (
            <div className="text-red-500 text-sm">
              {formik.errors.subject}
            </div>
          )}
        </div>

        {/* Assignment Name */}
        <div>
          <label className="block text-purple-600">Homework Name</label>
          <input
            type="text"
            name="assignment_name"
            value={formik.values.assignment_name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
          {formik.touched.assignment_name && formik.errors.assignment_name && (
            <div className="text-red-500 text-sm">
              {formik.errors.assignment_name}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-purple-600">Description</label>
          <textarea
            name="description"
            rows={4}
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm">
              {formik.errors.description}
            </div>
          )}
        </div>

        {/* Due Date */}
        <div>
          <label className="block text-purple-600">Due Date</label>
          <input
            type="date"
            name="due_date"
            value={formik.values.due_date}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="mt-1 block w-full border border-gray-300 rounded p-2"
          />
          {formik.touched.due_date && formik.errors.due_date && (
            <div className="text-red-500 text-sm">
              {formik.errors.due_date}
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-center space-x-4">
        <button
            type="submit"
            className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
          >
            Create
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>

        </div>
      </form>
    </Modal>
  );
};

export default NewAssignmentModal;
