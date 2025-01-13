import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import toast from "react-hot-toast";

const newAssignmentSchema = Yup.object({
  subject: Yup.string().required("Subject is required"),
  assignment_name: Yup.string().required("Assignment Name is required"),
  description: Yup.string().required("Description is required"),
  due_date: Yup.date().required("Due Date is required").nullable(),
});

const NewAssignment = ({ closeModal }) => {
  const user = useSelector((state) => state.user);
  const { access } = user;
  const teacher_id = user?.id;
  const selectedClass = user?.selectedClass;
  const [subjects, setSubjects] = useState([]);

  useEffect(() => {
    if (access) {
      fetch(
        `http://localhost:8000/api/filter-subjects/?teacher=${teacher_id}&class_assigned=${selectedClass}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data?.subjects) {
            setSubjects(data.subjects);
          }
        })
        .catch((error) => {
          console.error("Error fetching subjects:", error);
          setSubjects([]);
        });
    } else {
      console.error("Teacher ID or class is undefined");
    }
  }, [access]);

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
        await axios.post(
          "http://localhost:8000/api/assignments/assign/",
          values,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: access ? `Bearer ${access}` : "",
            },
          }
        );

        toast.success("Assignment submitted successfully!");

        closeModal();
      } catch (error) {
        console.error("Error submitting assignment:", error.response || error);
        toast.error("Error submitting assignment:", error.response || error);
      }
    },
  });

  return (
    <div className="bg-purple-50 p-6">
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Class input */}
        <div className="flex flex-col">
          <label className="text-purple-700 font-semibold">Class</label>
          <input
            type="text"
            id="class_assigned"
            name="class_assigned"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.class_assigned}
            className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Subject select */}
        <div className="flex flex-col">
          <label className="text-purple-700 font-semibold">Subject</label>
          <select
            id="subject"
            name="subject"
            onChange={formik.handleChange}
            value={formik.values.subject}
            className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option disabled value="">Select Subject</option>
            {subjects.length > 0 ? (
              subjects.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.subject_name}
                </option>
              ))
            ) : (
              <option disabled value="">No subjects available</option>
            )}
          </select>
          {formik.touched.subject && formik.errors.subject && (
            <div className="text-red-500 text-sm">{formik.errors.subject}</div>
          )}
        </div>

        {/* Assignment Name input */}
        <div className="flex flex-col">
          <label className="text-purple-700 font-semibold">Assignment Name</label>
          <input
            type="text"
            id="assignment_name"
            name="assignment_name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.assignment_name}
            className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {formik.touched.assignment_name && formik.errors.assignment_name && (
            <div className="text-red-500 text-sm">{formik.errors.assignment_name}</div>
          )}
        </div>

        {/* Description textarea */}
        <div className="flex flex-col">
          <label className="text-purple-700 font-semibold">Description</label>
          <textarea
            id="description"
            name="description"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            rows="4"
          />
          {formik.touched.description && formik.errors.description && (
            <div className="text-red-500 text-sm">{formik.errors.description}</div>
          )}
        </div>

        {/* Due Date input */}
        <div className="flex flex-col">
          <label className="text-purple-700 font-semibold">Due Date</label>
          <input
            type="date"
            id="due_date"
            name="due_date"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.due_date}
            className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          {formik.touched.due_date && formik.errors.due_date && (
            <div className="text-red-500 text-sm">{formik.errors.due_date}</div>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6 text-center">
          <button
            type="submit"
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none"
          >
            Create Assignment
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewAssignment;
