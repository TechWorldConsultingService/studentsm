import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const NewAssignment = () => {
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  console.log(user)
  const teacher_id = user?.id;
  const selectedClass = user?.selectedClass; // Use selectedClass from Redux
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  // const [selectedClass, setSelectedClass] = useState("");

  useEffect(() => {
    console.log("Teacher ID:", teacher_id);
    console.log("Selected Class:", selectedClass);
    if (teacher_id && selectedClass) {
      // const classAssigned = parseInt(selectedClass, 10);
      console.log("Class Assigned (Parsed):", selectedClass);
      fetch(`http://localhost:8000/api/filter-subjects/?teacher=${teacher_id}&class_assigned=${selectedClass}`)
        .then((response) => response.json())
        .then((data) => {
          if (data?.subjects) {
            setSubjects(data.subjects); // Update state with subjects array
          } else {
            console.error("Unexpected response format:", data); 
            setSubjects([]); // Fallback to empty array
          }
        })
        .catch((error) => {
          console.error("Error fetching subjects:", error);
          setSubjects([]); // Handle errors by setting subjects to an empty array
        });
    } else {
      console.error("Teacher ID or class is undefined");
    }
  }, [teacher_id, selectedClass]);
  
  const formik = useFormik({
    initialValues: {
      subject: "",
      class_assigned: selectedClass || "",
      assignment_name: "",
      description: "",
      due_date: "",
    },
    validationSchema: Yup.object({
      subject: Yup.string().required("Subject is required"),
      assignment_name: Yup.string().required("Assignment Name is required"),
      description: Yup.string().required("Description is required"),
      due_date: Yup.date().required("Due Date is required").nullable(),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        const response = await axios.post("http://localhost:8000/api/assignments/assign/", values);
        toast.success("Assignment submitted successfully!");
        navigate(-1); // Navigate back
      } catch (error) {
        console.error("Error submitting assignment:", error);
        toast.error("Failed to submit the assignment.");
      } finally {
        setLoading(false);
      }
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

                {Array.isArray(subjects) && subjects.length > 0 ? (
                  subjects.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.name}
                    </option>
                  ))
                ) : (
                  <option disabled value="">
                    No subjects available
                  </option>
                )}
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
