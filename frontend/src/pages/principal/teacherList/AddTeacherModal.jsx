import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Select, Input, Form, DatePicker, Radio } from "antd";
import moment from "moment";  // Ensure moment is imported

const { Option } = Select;

export const addTeacherSchema = Yup.object().shape({
  username: Yup.string().required("Username is required."),
  password: Yup.string().required("Password is required."),
  email: Yup.string().email("Invalid email format").required("Email is required."),
  phone: Yup.string().required("Phone number is required."),
  address: Yup.string().required("Address is required."),
  date_of_joining: Yup.date().required("Date of joining is required."),
  gender: Yup.string().required("Gender is required."),
  teacher_id: Yup.number()
    .required("Teacher ID is Required.")
    .typeError("Teacher ID must be a number."),
  name: Yup.string().required("Teacher Name is Required."),
  subjects: Yup.array().min(1, "At least one subject must be selected."),
  classes: Yup.array().min(1, "At least one class must be selected."),
  class_teacher: Yup.number().required("Class Teacher must be selected."),
});

const AddTeacherModal = ({ handleCloseModal, fetchTeachers }) => {
  const { access, user } = useSelector((state) => state.user);  // Access user data from redux
  const navigate = useNavigate();

  // Check if user is available to avoid undefined errors
  const subjects = user?.subjects || [];
  const classes = user?.classes || [];
  const classTeacher = user?.class_teacher || null;

  const formik = useFormik({
    initialValues: {
      username: user?.username || "",
      password: user?.password || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      date_of_joining: user?.date_of_joining || "",
      gender: user?.gender || "",
      teacher_id: "",
      name: "",
      subjects: subjects,
      classes: classes,
      class_teacher: classTeacher,
    },
    validationSchema: addTeacherSchema,
    onSubmit: async (values) => {
      await addTeacher(values);
    },
  });

  const addTeacher = async (values) => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      await axios.post("http://localhost:8000/api/teachers/", values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      toast.success("Teacher Added Successfully.");
      fetchTeachers();  
      handleCloseModal();  
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/"); 
      } else {
        toast.error("Error adding teacher.", error.message || error);
      }
    }
  };

  const handleClassChange = (selectedClasses) => {
    // If classes are selected, reset the class_teacher to null if it's not part of the selected classes
    if (!selectedClasses.includes(formik.values.class_teacher)) {
      formik.setFieldValue("class_teacher", null);
    }
  };

  if (!user) {
    return <div>Loading...</div>;  // Fallback UI while user data is being loaded
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold text-purple-800">Add Teacher</h2>
        <form onSubmit={formik.handleSubmit} className="mt-4">
          {/* Teacher ID */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Teacher ID"
              name="teacher_id"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.teacher_id}
            />
            {formik.touched.teacher_id && formik.errors.teacher_id && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.teacher_id}
              </div>
            )}
          </div>

          {/* Name */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Teacher Name"
              name="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
            />
            {formik.touched.name && formik.errors.name && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.name}
              </div>
            )}
          </div>

          {/* Subjects Selection (Multiple) */}
          <div className="mb-4">
            <Select
              mode="multiple"
              placeholder="Select Subjects"
              style={{ width: "100%" }}
              value={formik.values.subjects}
              onChange={(value) => formik.setFieldValue("subjects", value)}
            >
              {subjects.map((subject, index) => (
                <Option key={index} value={subject}>
                  {subject}
                </Option>
              ))}
            </Select>
            {formik.touched.subjects && formik.errors.subjects && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.subjects}
              </div>
            )}
          </div>

          {/* Classes Selection (Multiple) */}
          <div className="mb-4">
            <Select
              mode="multiple"
              placeholder="Select Classes"
              style={{ width: "100%" }}
              value={formik.values.classes}
              onChange={(value) => {
                formik.setFieldValue("classes", value);
                handleClassChange(value);
              }}
            >
              {classes.map((cls, index) => (
                <Option key={index} value={cls}>
                  {cls}
                </Option>
              ))}
            </Select>
            {formik.touched.classes && formik.errors.classes && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.classes}
              </div>
            )}
          </div>

          {/* Class Teacher Selection */}
          <div className="mb-4">
            <Select
              placeholder="Select Class Teacher"
              style={{ width: "100%" }}
              value={formik.values.class_teacher}
              onChange={(value) => formik.setFieldValue("class_teacher", value)}
            >
              {formik.values.classes.map((classId) => (
                <Option key={classId} value={classId}>
                  {classId}
                </Option>
              ))}
            </Select>
            {formik.touched.class_teacher && formik.errors.class_teacher && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.class_teacher}
              </div>
            )}
          </div>

          {/* Username */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Username"
              name="username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.username}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <input
              type="password"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Password"
              name="password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Email"
              name="email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Phone"
              name="phone"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.phone}
              </div>
            )}
          </div>

          {/* Address */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Address"
              name="address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
            />
            {formik.touched.address && formik.errors.address && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.address}
              </div>
            )}
          </div>

          {/* Date of Joining */}
          <div className="mb-4">
            <DatePicker
              className="w-full"
              name="date_of_joining"
              onChange={(date, dateString) => formik.setFieldValue("date_of_joining", dateString)}
              value={formik.values.date_of_joining ? moment(formik.values.date_of_joining) : null}
            />
            {formik.touched.date_of_joining && formik.errors.date_of_joining && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.date_of_joining}
              </div>
            )}
          </div>

          {/* Gender */}
          <div className="mb-4">
            <Radio.Group
              name="gender"
              onChange={formik.handleChange}
              value={formik.values.gender}
            >
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="other">Other</Radio>
            </Radio.Group>
            {formik.touched.gender && formik.errors.gender && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.gender}
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

export default AddTeacherModal;
