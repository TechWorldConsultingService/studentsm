import React from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

export const addSubjectSchema = Yup.object().shape({
  subject_code: Yup.number()
  .required("Subject Code is Required.")
  .typeError("Subject Code must be a number."),
  subject_name: Yup.string().required("Subject Name is Required."),
});

const AddSubjectModal = ({ handleCloseModal, fetchSubjects }) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      subject_code: "",
      subject_name: "",
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
        toast.error("Error on adding subject.", error.message || error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold text-purple-800">Add Subject</h2>
        <form onSubmit={formik.handleSubmit} className="mt-4">
          <div className=" mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Subject Code"
              name="subject_code"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.subject_code}
            />
            {formik.touched.subject_code && formik.errors.subject_code && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.subject_code}
              </div>
            )}
          </div>

          <div className=" mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Subject Name"
              name="subject_name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.subject_name}
            />
            {formik.touched.subject_name && formik.errors.subject_name && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.subject_name}
              </div>
            )}
          </div>

          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 mr-2"
            >
              Save
            </button>
            <button
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
