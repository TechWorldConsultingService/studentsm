import React, { useState } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

//validation schema
const newHomeworkSchema = Yup.object().shape({
  subject: Yup.string().required("Subject should select."),
  assignment_name: Yup.string().required("Topics is required."),
  description: Yup.string()
    .required("Description is required.")
    .min(12, "Description of homework must be more then 12 chacters."),
  due_date: Yup.date().required("Due Date is required.").nullable(),
});

const NewAssignment = () => {
  const nagivate = useNavigate();

  const { subjects } = useSelector((state) => state.user);
  const subjectList = subjects.map((item) => item.subject_name);

  const formik = useFormik({
    initialValues: {
      subject: "",
      assignment_name: "",
      description: "",
      due_date: "",
    },
    validationSchema: newHomeworkSchema,
    onSubmit: (values) => {
      console.log("New Assignment Submitted:", values);
      toast.success("Assignment submitted successfully!");

      nagivate(-1);
    },
  });

  return (
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">
          Create New Assignment
        </h1>

        <form onSubmit={formik.handleSubmit} className="mt-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:space-x-4 sm:space-y-0 space-y-4">
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-purple-700 font-semibold">Subject</label>
              <select
                id="subject"
                name="subject"
                onChange={formik.handleChange}
                value={formik.values.subject}
                className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option disabled value="">
                  Select Subject
                </option>
                {subjectList.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>

              {formik.touched.subject && formik.errors.subject && (
                <div className="text-red-500 text-sm">
                  {formik.errors.subject}
                </div>
              )}
            </div>

            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-purple-700 font-semibold">Topics</label>
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
                <div className="text-red-500 text-sm">
                  {formik.errors.assignment_name}
                </div>
              )}
            </div>
          </div>

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
              <div className="text-red-500 text-sm">
                {formik.errors.description}
              </div>
            )}
          </div>

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
              <div className="text-red-500 text-sm">
                {formik.errors.due_date}
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none"
            >
              Submit Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAssignment;
