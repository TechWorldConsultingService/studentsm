import React from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export const addSubjectSchema = Yup.object().shape({
  subject_code: Yup.string().required("Subject Code is Required."),
  subject_name: Yup.string().required("Subject Name is Required."),
  is_credit: Yup.boolean().required("Is Credit is Required."),
  credit_hours: Yup.number()
    .transform((value, originalValue) => (originalValue === "" ? undefined : value))
    .when("is_credit", (is_credit, schema) =>
      is_credit
        ? schema
            .required("Credit Hours are required when subject is credit.")
            .min(0, "Credit Hours must be a positive number.")
        : schema.notRequired()
    ),
  is_optional: Yup.boolean().required("Is Optional is Required."),
});

const AddSubjectModal = ({ handleCloseModal, fetchSubjects }) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      subject_code: "",
      subject_name: "",
      is_credit: false,
      credit_hours: "",
      is_optional: false,
    },
    validationSchema: addSubjectSchema,
    onSubmit: async (values) => {
      await addSubject(values);
    },
  });

  const addSubject = async (values) => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      await axios.post("http://localhost:8000/api/subjects/", values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      toast.success("Subject Added Successfully.");
      fetchSubjects();
      handleCloseModal();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error on adding subject. " + (error.message || error));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Add Subject</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          {/* Subject Code */}
          <div>
            <label className="block text-gray-700 font-semibold" htmlFor="subject_code">
              Subject Code:
            </label>
            <input
              id="subject_code"
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Subject Code"
              name="subject_code"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.subject_code}
            />
            {formik.touched.subject_code && formik.errors.subject_code && (
              <div className="p-1 text-red-500 text-sm">{formik.errors.subject_code}</div>
            )}
          </div>

          {/* Subject Name */}
          <div>
            <label className="block text-gray-700 font-semibold" htmlFor="subject_name">
              Subject Name:
            </label>
            <input
              id="subject_name"
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Subject Name"
              name="subject_name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.subject_name}
            />
            {formik.touched.subject_name && formik.errors.subject_name && (
              <div className="p-1 text-red-500 text-sm">{formik.errors.subject_name}</div>
            )}
          </div>

          {/* Is Credit Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-semibold">Is Credit:</span>
            <label htmlFor="is_credit" className="relative inline-flex items-center cursor-pointer">
              <input
                id="is_credit"
                type="checkbox"
                name="is_credit"
                className="sr-only peer"
                checked={formik.values.is_credit}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full
                peer-focus:ring-4 peer-focus:ring-purple-700 dark:peer-focus:ring-purple-800 
                peer-checked:bg-purple-700 
                peer-checked:after:translate-x-full 
                after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all" />
            </label>
          </div>
          {formik.touched.is_credit && formik.errors.is_credit && (
            <div className="p-1 text-red-500 text-sm">{formik.errors.is_credit}</div>
          )}

          {/* Credit Hours (conditionally rendered) */}
          {formik.values.is_credit && (
            <div>
              <label className="block text-gray-700 font-semibold" htmlFor="credit_hours">
                Credit Hours:
              </label>
              <input
                id="credit_hours"
                type="number"
                className="border border-gray-300 p-2 rounded w-full"
                placeholder="Cradit Hours"
                name="credit_hours"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.credit_hours}
                step="0.01"
              />
              {formik.touched.credit_hours && formik.errors.credit_hours && (
                <div className="p-1 text-red-500 text-sm">{formik.errors.credit_hours}</div>
              )}
            </div>
          )}

          {/* Is Optional Toggle */}
          <div className="flex items-center justify-between">
            <span className="text-gray-700 font-semibold">Is Optional:</span>
            <label htmlFor="is_optional" className="relative inline-flex items-center cursor-pointer">
              <input
                id="is_optional"
                type="checkbox"
                name="is_optional"
                className="sr-only peer"
                checked={formik.values.is_optional}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full
                peer-focus:ring-4 peer-focus:ring-purple-700 dark:peer-focus:ring-purple-800 
                peer-checked:bg-purple-700 
                peer-checked:after:translate-x-full 
                after:content-[''] after:absolute after:top-0.5 after:left-[2px] 
                after:bg-white after:border-gray-300 after:border after:rounded-full 
                after:h-5 after:w-5 after:transition-all" />
            </label>
          </div>
          {formik.touched.is_optional && formik.errors.is_optional && (
            <div className="p-1 text-red-500 text-sm">{formik.errors.is_optional}</div>
          )}

          {/* Buttons */}
          <div className="mt-6 text-center space-x-4">
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Save
            </button>
            <button
              type="button"
              onClick={handleCloseModal}
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

export default AddSubjectModal;
