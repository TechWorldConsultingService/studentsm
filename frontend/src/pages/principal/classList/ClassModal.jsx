import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { Select } from "antd";
import * as Yup from "yup";


const classSchema = Yup.object().shape({
  class_code: Yup.string()
    .required("Class Code is required.")
    .typeError("Class Code must be a string."),
  class_name: Yup.string().required("Class Name is required."),
  subjects: Yup.array()
    .min(3, "At least three compulsory subjects must be selected.")
    .of(
      Yup.object().shape({
        subject_name: Yup.string().required("Subject name is required."),
        subject_code: Yup.string().required("Subject code is required."),
      })
    ),
  optional_subjects: Yup.array().of(
    Yup.object().shape({
      subject_name: Yup.string().required("Subject name is required."),
      subject_code: Yup.string().required("Subject code is required."),
    })
  ),
});

const ClassModal = ({ classInfo, onClose, refreshClasses }) => {
  const { access } = useSelector((state) => state.user);

  const [subjectList, setSubjectList] = useState([]);
  const [optionalSubjectList, setOptionalSubjectList] = useState([]);


  const isEdit = Boolean(classInfo && classInfo.id);

  const formik = useFormik({
    initialValues: {
      class_code: classInfo?.class_code || "",
      class_name: classInfo?.class_name || "",
      subjects: classInfo?.subject_details || [],
      optional_subjects: classInfo?.optional_subject_details || [],
    },
    validationSchema: classSchema,
    onSubmit: async (values) => {
      if (!access) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }
      try {
        if (isEdit) {
          // EDIT
          await axios.put(
            `http://localhost:8000/api/classes/${classInfo.id}/`,
            values,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access}`,
              },
            }
          );
          toast.success("Class updated successfully.");
        } else {
          // ADD
          await axios.post("http://localhost:8000/api/classes/", values, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          });
          toast.success("Class added successfully.");
        }
        refreshClasses();
        onClose();
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Authentication error. Please log in again.");
        } else {
          toast.error(
            "Error saving class: " + (error.response?.data?.detail || error.message)
          );
        }
      }
    },
  });

  // Fetch subjects
  const fetchSubjects = async () => {
    if (!access) return;
    try {
      const { data } = await axios.get("http://localhost:8000/api/subjects/compulsory/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setSubjectList(data);
    } catch (error) {
      toast.error("Error fetching compulsory subjects.");
    }
  };

  const fetchOptionalSubjects = async () => {
    if (!access) return;
    try {
      const { data } = await axios.get("http://localhost:8000/api/subjects/optional/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setOptionalSubjectList(data);
    } catch (error) {
      toast.error("Error fetching optional subjects.");
    }
  };

  useEffect(() => {
    fetchSubjects();
    fetchOptionalSubjects();
  }, [access]);

  // Helper for multiple selects
  const handleSubjectsChange = (selectedNames) => {
    const selectedSubjects = selectedNames.map((name) => {
      const found = subjectList.find((sub) => sub.subject_name === name);
      return {
        subject_name: found.subject_name,
        subject_code: found.subject_code,
      };
    });
    formik.setFieldValue("subjects", selectedSubjects);
  };

  const handleOptionalSubjectsChange = (selectedNames) => {
    const selectedSubj = selectedNames.map((name) => {
      const found = optionalSubjectList.find((sub) => sub.subject_name === name);
      return {
        subject_name: found.subject_name,
        subject_code: found.subject_code,
      };
    });
    formik.setFieldValue("optional_subjects", selectedSubj);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          {isEdit ? "Edit Class" : "Add Class"}
        </h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Class Code */}
          <div className="mb-4">
            <label className="block text-sm font-semibold" htmlFor="class_code">
              Class Code
            </label>
            <input
              id="class_code"
              name="class_code"
              type="text"
              className="border border-gray-300 p-2 rounded w-full mt-1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.class_code}
              placeholder="Enter Class Code"
            />
            {formik.touched.class_code && formik.errors.class_code && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.class_code}
              </div>
            )}
          </div>

          {/* Class Name */}
          <div className="mb-4">
            <label className="block text-sm font-semibold" htmlFor="class_name">
              Class Name
            </label>
            <input
              id="class_name"
              name="class_name"
              type="text"
              className="border border-gray-300 p-2 rounded w-full mt-1"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.class_name}
              placeholder="Enter Class Name"
            />
            {formik.touched.class_name && formik.errors.class_name && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.class_name}
              </div>
            )}
          </div>

          {/* Compulsory Subjects */}
          <div className="mb-4">
            <label className="block text-sm font-semibold" htmlFor="subjects">
              Compulsory Subjects (Min. 3)
            </label>
            <Select
              mode="multiple"
              id="subjects"
              className="w-full mt-1"
              placeholder="Select at least three subjects"
              value={formik.values.subjects.map((sub) => sub.subject_name)}
              onChange={handleSubjectsChange}
              onBlur={() => formik.setFieldTouched("subjects", true)}
            >
              {subjectList.map((item) => (
                <Select.Option key={item.id} value={item.subject_name}>
                  {item.subject_name} ({item.subject_code})
                </Select.Option>
              ))}
            </Select>
            {formik.touched.subjects && formik.errors.subjects && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.subjects}
              </div>
            )}
          </div>

          {/* Optional Subjects */}
          <div className="mb-4">
            <label className="block text-sm font-semibold" htmlFor="optional_subjects">
              Optional Subjects
            </label>
            <Select
              mode="multiple"
              id="optional_subjects"
              className="w-full mt-1"
              placeholder="Select optional subjects"
              value={formik.values.optional_subjects.map((sub) => sub.subject_name)}
              onChange={handleOptionalSubjectsChange}
              onBlur={() => formik.setFieldTouched("optional_subjects", true)}
            >
              {optionalSubjectList.map((item) => (
                <Select.Option key={item.id} value={item.subject_name}>
                  {item.subject_name}({item.subject_code})
                </Select.Option>
              ))}
            </Select>
            {formik.touched.optional_subjects && formik.errors.optional_subjects && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.optional_subjects}
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-center">
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 mr-4"
            >
              {isEdit ? "Update" : "Save"}
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

export default ClassModal;
