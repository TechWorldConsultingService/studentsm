import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";

// Validation Schema for Formik
const EditExamDetailSchema = Yup.object().shape({
  exam: Yup.string()
    .required("Exam is required")
    .notOneOf([null, ""], "Please select a valid exam"),

  class_assigned: Yup.string()
    .required("Class is required")
    .notOneOf([null, ""], "Please select a valid class"),

  subject: Yup.string()
    .required("Subject is required")
    .notOneOf([null, ""], "Please select a valid subject"),

  full_marks: Yup.number()
    .required("Full marks are required")
    .positive("Full marks must be a positive number")
    .integer("Full marks must be an integer")
    .min(1, "Full marks must be at least 1"),

  pass_marks: Yup.number()
    .required("Pass marks are required")
    .positive("Pass marks must be a positive number")
    .integer("Pass marks must be an integer")
    .max(Yup.ref("full_marks"), "Pass marks cannot exceed full marks"),

  exam_date: Yup.date()
    .required("Exam date is required")
    .min(new Date(), "Exam date cannot be in the past")
    .typeError("Please provide a valid date"),

  exam_time: Yup.string()
    .required("Exam time is required")
    .matches(
      /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/,
      "Please enter a valid time in HH:mm:ss format"
    ),
});

const EditExamDetailModal = ({
  examDetail,
  exams,
  classes,
  onSave,
  onCancel,
}) => {
  const { access, is_ad } = useSelector((state) => state.user);
  const [selectedClassCode, setSelectedClassCode] = useState("");
  const [subjects, setSubjects] = useState([]);

  const formik = useFormik({
    initialValues: {
      exam: exams.id || "",
      subject: examDetail?.subject?.id || "",
      class_assigned: examDetail?.class_details?.id || "",
      full_marks: examDetail?.full_marks || "",
      pass_marks: examDetail?.pass_marks || "",
      exam_date: examDetail?.exam_date || "",
      exam_time: examDetail?.exam_time || "",
    },
    validationSchema: EditExamDetailSchema,
    onSubmit: async (values) => {
      await onSave(values);
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (formik.values.class_assigned) {
      setSelectedClassCode(formik.values.class_assigned);
    }
  }, [formik.values.class_assigned]);

  useEffect(() => {
    const fetchSubjects = async () => {
      if (selectedClassCode) {
        try {
          const response = await axios.get(
            `http://localhost:8000/api/classes/${selectedClassCode}/`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access}`,
              },
            }
          );
          setSubjects(response.data.subject_details);
        } catch (error) {
          console.error("Error fetching subjects:", error);
        }
      }
    };
    fetchSubjects();
  }, [selectedClassCode, access]);

  const handleChangeClass = (e) => {
    const { value } = e.target;
    formik.setFieldValue("class_assigned", value);
    setSelectedClassCode(value);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-full md:w-1/2 lg:w-1/3 overflow-auto">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">
          Edit Exam Detail
        </h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Select Exam */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Exam
            </label>
            <select
              id="exam"
              name="exam"
              value={formik.values.exam}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="p-2 border border-purple-300 rounded w-full"
            >
              <option value="">Select an exam</option>{" "}
              <option key={exams.id} value={exams.id}>
                {exams.name}
              </option>
            </select>
            {formik.touched.exam && formik.errors.exam && (
              <div className="text-red-500 text-sm">{formik.errors.exam}</div>
            )}
          </div>

          {/* Class Assigned */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Class Assigned
            </label>
            <select
              id="class_assigned"
              name="class_assigned"
              value={formik.values.class_assigned}
              onChange={handleChangeClass}
              onBlur={formik.handleBlur}
              className="p-2 border border-purple-300 rounded w-full"
            >
              <option value="">Select Class</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.class_name}
                </option>
              ))}
            </select>
            {formik.touched.class_assigned && formik.errors.class_assigned && (
              <div className="text-red-500 text-sm">
                {formik.errors.class_assigned}
              </div>
            )}
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              value={formik.values.subject}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="p-2 border border-purple-300 rounded w-full"
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
            {formik.touched.subject && formik.errors.subject && (
              <div className="text-red-500 text-sm">
                {formik.errors.subject}
              </div>
            )}
          </div>

          {/* Full Marks */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="full_marks"
            >
              Full Marks
            </label>
            <input
              type="number"
              id="full_marks"
              name="full_marks"
              value={formik.values.full_marks}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="p-2 border border-purple-300 rounded w-full"
            />
            {formik.touched.full_marks && formik.errors.full_marks && (
              <div className="text-red-500 text-sm">
                {formik.errors.full_marks}
              </div>
            )}
          </div>

          {/* Pass Marks */}
          <div className="mb-4">
            <label
              className="block text-gray-700 font-semibold mb-2"
              htmlFor="pass_marks"
            >
              Pass Marks
            </label>
            <input
              type="number"
              id="pass_marks"
              name="pass_marks"
              value={formik.values.pass_marks}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="p-2 border border-purple-300 rounded w-full"
            />
            {formik.touched.pass_marks && formik.errors.pass_marks && (
              <div className="text-red-500 text-sm">
                {formik.errors.pass_marks}
              </div>
            )}
          </div>

          {/* Exam Date */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Exam Date {is_ad ? "(AD)" : "(BS)"}
            </label>
            {is_ad ? (
              <input
                type="date"
                id="exam_date"
                name="exam_date"
                value={formik.values.exam_date}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="p-2 border border-purple-300 rounded w-full"
              />
            ) : (
              <NepaliDatePicker
                value={formik.values.exam_date}
                onChange={(date) => formik.setFieldValue("exam_date", date)}
                onBlur={() => formik.setFieldTouched("exam_date", true)}
                inputClassName="p-2 border border-purple-300 rounded w-full"
                dateFormat="YYYY-MM-DD"
                language="ne"
                placeholder="Select Date"
              />
            )}

            {formik.touched.exam_date && formik.errors.exam_date && (
              <div className="text-red-500 text-sm">
                {formik.errors.exam_date}
              </div>
            )}
          </div>

          {/* Exam time*/}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Exam Time
            </label>
            <input
              type="time"
              id="exam_time"
              name="exam_time"
              value={formik.values.exam_time}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="p-2 border border-purple-300 rounded w-full"
            />
            {formik.touched.exam_date && formik.errors.exam_date && (
              <div className="text-red-500 text-sm">
                {formik.errors.exam_date}
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="text-sm text-gray-500 px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-sm bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditExamDetailModal;
