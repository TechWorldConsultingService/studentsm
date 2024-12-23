import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Select } from 'antd';

export const addClassSchema = Yup.object().shape({
  class_code: Yup.number()
    .required("Class Code is Required.")
    .typeError("Class Code must be a number."),
  class_name: Yup.string().required("Class Name is Required."),
  subjects: Yup.array()
    .min(1, "At least one subject must be selected.")
    .of(
      Yup.object().shape({
        subject_name: Yup.string().required(),
        subject_code: Yup.string().required(),
      })
    ),
});

const AddClassModal = ({ handleCloseModal, fetchClasses }) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [subjectList, setSubjectList] = useState([]);

  const formik = useFormik({
    initialValues: {
      class_code: "",
      class_name: "",
      subjects: [], // Start with no selected subjects
    },
    validationSchema: addClassSchema,
    onSubmit: async (values) => {
      await addClass(values);
    },
  });

  const addClass = async (values) => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      await axios.post("http://localhost:8000/api/classes/", values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      toast.success("Class Added Successfully.");
      fetchClasses();
      handleCloseModal();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error on adding class.", error.message || error);
      }
    }
  };

  const fetchSubjects = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      const { data } = await axios.get("http://localhost:8000/api/subjects/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setSubjectList(data);
    } catch (error) {
      toast.error("Error fetching subjects:", error.message || error);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [access, navigate]);

  const handleSubjectChange = (selectedValues) => {
    const selectedSubjects = selectedValues.map((subjectName) => {
      const subject = subjectList.find(
        (item) => item.subject_name === subjectName
      );
      return {
        subject_name: subject.subject_name,
        subject_code: subject.subject_code,
      };
    });
    formik.setFieldValue("subjects", selectedSubjects);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold text-purple-800">Add Class</h2>
        <form onSubmit={formik.handleSubmit} className="mt-4">
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Class Code"
              name="class_code"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.class_code}
            />
            {formik.touched.class_code && formik.errors.class_code && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.class_code}
              </div>
            )}
          </div>

          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Class Name"
              name="class_name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.class_name}
            />
            {formik.touched.class_name && formik.errors.class_name && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.class_name}
              </div>
            )}
          </div>

          <div className="mb-4 border border-gray-300 p-2 rounded w-full">
            <Select
              mode="multiple"
              name="subjects"
              placeholder="Select all subject"
              className="w-full"
              onChange={handleSubjectChange}
              onBlur={formik.handleBlur}
              value={formik.values.subjects.map(
                (subject) => subject.subject_name
              )}
            >             
              {subjectList.length > 0 &&
                subjectList.map((item) => (
                  <Select.Option key={item.id} value={item.subject_name}>
                    {item.subject_name}
                  </Select.Option>
                ))}
            </Select>
            {formik.touched.subjects && formik.errors.subjects && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.subjects}
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

export default AddClassModal;
