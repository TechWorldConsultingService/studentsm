import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Password from "antd/es/input/Password";
import useFetchData from "../../../hooks/useFetch";
import { Select } from "antd";

const AddTeacherModal = ({ handleCloseModal, fetchTeachers }) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const { fetchedData: classList } = useFetchData(
    "http://localhost:8000/api/classes/"
  );

  const { fetchedData: subjectList } = useFetchData(
    "http://localhost:8000/api/subjects/"
  );

const addTeacherSchema = Yup.object().shape({
    user: Yup.object().shape({
      username: Yup.string()
        .required("Username is required.")
        .min(3, "Username must be at least 3 characters long.")
        .max(20, "Username can't exceed 20 characters."),
      password: Yup.string()
        .required("Password is required.")
        .min(6, "Password must be at least 6 characters long.")
        .max(15, "Password can't exceed 15 characters.")
        .matches(
          /[a-zA-Z0-9]/,
          "Password must contain at least one letter and one number."
        ),
      email: Yup.string()
        .required("Email is required.")
        .email("Please enter a valid email address."),
      first_name: Yup.string()
        .required("First name is required.")
        .min(2, "First name must be at least 2 characters.")
        .max(10, "First name can't exceed 10 characters."),
      last_name: Yup.string()
        .required("Last name is required.")
        .min(2, "Last name must be at least 2 characters.")
        .max(10, "Last name can't exceed 10 characters."),
    }),
    phone: Yup.string()
      .required("Phone number is required.")
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits long.")
      .min(10, "Phone number must be 10 digits.")
      .max(10, "Phone number must be 10 digits."),
    address: Yup.string()
      .required("Address is required.")
      .min(5, "Address must be at least 5 characters long.")
      .max(50, "Address can't exceed 50 characters."),
    date_of_joining: Yup.date()
      .required("Date of joining is required.")
      .max(new Date(), "Date of birth cannot be in the future."),
    gender: Yup.string().required("Gender is required."),

    subjects: Yup.array()
      .of(
        Yup.object().shape({
          subject_code: Yup.string()
            .required("Subject code is required.")
            .oneOf(
              subjectList.map((item) => item.subject_code),
              "Invalid subject selected."
            ),
          subject_name: Yup.string()
            .required("Subject name is required.")
            .oneOf(
              subjectList.map((item) => item.subject_name),
              "Invalid subject name."
            ),
        })
      )
      .min(1, "At least one subject is required."),
    classes: Yup.array()
      .of(
        Yup.object().shape({
          class_code: Yup.string()
            .required("Class code is required.")
            .oneOf(
              classList.map((item) => item.class_code),
              "Invalid class selected."
            ),
          class_name: Yup.string()
            .required("Class name is required.")
            .oneOf(
              classList.map((item) => item.class_name),
              "Invalid class name"
            ),
        })
      )
      .min(1, "At least one class is required."),
    class_teacher: Yup.string()
      .nullable()
      .notRequired("Please select one class as Class Teacher if applicable."),
  });

  const formik = useFormik({
    initialValues: {
      user: {
        username: "",
        email: "",
        password: "",
        first_name: "",
        last_name: "",
      },
      phone: "",
      address: "",
      date_of_joining: "",
      gender: "",
      subjects: [],
      classes: [],
      class_teacher: "",
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
      await axios.post("http://localhost:8000/api/register/teacher/", values, {
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

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3 max-h-full overflow-auto">
        <h2 className="text-2xl font-bold text-purple-800">Add Teacher</h2>
        <form onSubmit={formik.handleSubmit} className="mt-4">
          {/* Username */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Username"
              name="user.username"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.user.username}
            />
            {formik.touched.user?.username && formik.errors.user?.username && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.user.username}
              </div>
            )}
          </div>
          {/* Password */}
          <div className="mb-4">
            <Password
              placeholder="Password"
              name="user.password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.user.password}
              className="w-full"
            />
            {formik.touched.user?.password && formik.errors.user?.password && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.user.password}
              </div>
            )}
          </div>
          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Email"
              name="user.email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.user.email}
            />
            {formik.touched.user?.email && formik.errors.user?.email && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.user.email}
              </div>
            )}
          </div>
          {/* First Name */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="First Name"
              name="user.first_name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.user.first_name}
            />
            {formik.touched.user?.first_name &&
              formik.errors.user?.first_name && (
                <div className="p-1 px-2 text-red-500 text-sm mt-1">
                  {formik.errors.user.first_name}
                </div>
              )}
          </div>
          {/* Last Name */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Last Name"
              name="user.last_name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.user.last_name}
            />
            {formik.touched.user?.last_name &&
              formik.errors.user?.last_name && (
                <div className="p-1 px-2 text-red-500 text-sm mt-1">
                  {formik.errors.user.last_name}
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
            <input
              type="date"
              className="border border-gray-300 p-2 rounded w-full"
              name="date_of_joining"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.date_of_joining}
            />
            {formik.touched.date_of_joining &&
              formik.errors.date_of_joining && (
                <div className="p-1 px-2 text-red-500 text-sm mt-1">
                  {formik.errors.date_of_joining}
                </div>
              )}
          </div>
          {/* Gender */}
          <div className="mb-4">
            <select
              name="gender"
              className="border border-gray-300 p-2 rounded w-full"
              value={formik.values.gender}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {formik.touched.gender && formik.errors.gender && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.gender}
              </div>
            )}
          </div>




{/*  subjects */}
          <div className="mb-4">
            <Select
              mode="multiple"
              name="subjects"
              placeholder="Select all subjects"
              className="w-full"
              onChange={(selectedValues) => {
                // Map selected class codes to full objects
                const selectedSubject = subjectList.filter((item) =>
                  selectedValues.includes(item.subject_code)
                );
                formik.setFieldValue("subjects", selectedSubject);
              }}
              value={formik.values.subjects.map((item) => item.subject_code)}
              onBlur={formik.handleBlur}
            >
              {subjectList.length > 0 &&
                subjectList.map((item) => (
                  <Select.Option
                    key={item.subjectList_code}
                    value={item.subject_code}
                  >
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



          {/* Classes */}
          <div className="mb-4">
            <Select
              mode="multiple"
              name="classes"
              placeholder="Select all classes"
              className="w-full"
              onChange={(selectedValues) => {
                // Map selected class codes to full objects
                const selectedClasses = classList.filter((classItem) =>
                  selectedValues.includes(classItem.class_code)
                );
                formik.setFieldValue("classes", selectedClasses);
              }}
              value={formik.values.classes.map((item) => item.class_code)}
              onBlur={formik.handleBlur}
            >
              {classList.length > 0 &&
                classList.map((classItem) => (
                  <Select.Option
                    key={classItem.class_code}
                    value={classItem.class_code}
                  >
                    {classItem.class_name}
                  </Select.Option>
                ))}
            </Select>
            {formik.touched.classes && formik.errors.classes && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.classes}
              </div>
            )}
          </div>

          {/* clsss teacher  */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Class Teacher"
              name="class_teacher"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.class_teacher}
            />
            {formik.touched.class_teacher && formik.errors.class_teacher && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.class_teacher}
              </div>
            )}
          </div>
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Add Teacher
            </button>
            <button
              type="button"
              className="bg-gray-300 text-black px-6 py-2 rounded-lg hover:bg-gray-400"
              onClick={handleCloseModal}
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
