import React, { useState } from "react";
import { Select } from "antd";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { DatePicker } from "antd";
import axios from "axios";

// Validation Schema
const addStudentSchema = Yup.object().shape({
  firstname: Yup.string()
    .min(3, "Full Name must be at least 3 letter")
    .required("Full Name is required"),

  lastname: Yup.string()
    .min(3, "Full Name must be at least 3 letter")
    .required("Full Name is required"),

  gender: Yup.string().required("Gender must be selected"),

  address: Yup.string()
    .min(3, "Address must be at least 3 letter")
    .required("Address is required"),

  parents: Yup.string().required("Parent name must be provided"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required."),

  class: Yup.string()
    .required("class number is required."),

  dateOfBirth: Yup.date()
    .required("Date of Birth must be selected")
    .max(new Date(), "Date of joining cannot be in the future"),

  username: Yup.string()
    .min(3, "Username must be at least 3 letter")
    .required("Username is required."),

  password: Yup.string()
    .min(4, "Password must be at least 4 characters long.")
    .required("Password is required."),
});

const AddStudent = () => {
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      gender: "",
      address: "",
      parents: "",
      email: "",
      class: "",
      dateOfBirth: "",
      username: "",
      password: "",
    },
    validationSchema: addStudentSchema,
    onSubmit: async(values) => {
      // await registerStudent(values);
      await console.log(values)
    },
  });

  // const registerStudent = async (values) => {
  //   try {
  //     const response = await axios.post('http://localhost:8000/register', values, {
  //       headers: { 'Content-Type': 'application/json' }
  //     });
  
  //     if (response.status === 201) {
  //       toast.success(response.data.msg);
  //     }
  //   } catch (error) {
  //     const errorMsg = error.response?.data?.msg || 'An error occurred';
  //     toast.error(errorMsg);
  //   }
  // };

  const handleDateChange = (date) => {
    formik.setFieldValue("dateOfBirth", date);
  };

  return (
    <div className="flex flex-col bg-purple-400 text-white  w-full px-32 pt-5 pb-10  items-center justify-center">
      <div className="flex flex-col items-center justify-center  bg-purple-800 rounded-sm shadow-2xl w-[80%] p-3">
        <h2 className=" text-3xl font-bold">Student Details</h2>
        <span>Enter the details of Student</span>
      </div>

      <div className="bg-white text-purple-900 w-[80%]">
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col p-8 gap-y-4 justify-center"
        >
          <div className="flex gap-x-5 items-center">
            <label className="w-1/6">First Name:</label>
            <div className="flex flex-col w-1/2">
            <input
              className="border p-2 rounded-sm w-full"
              type="text"
              placeholder="First Name"
              id="firstname"
              name="firstname"
              onChange={formik.handleChange}
              value={formik.values.firstname}
            />
            {formik.touched.firstname && formik.errors.firstname && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.firstname}
              </div>
            )}
            </div>
          </div>

          <div className="flex gap-x-5 items-center">
            <label className="w-1/6">Last Name:</label>
            <div className="flex flex-col w-1/2">
            <input
              className="border p-2 rounded-sm w-full"
              type="text"
              placeholder="Last Name"
              id="lastname"
              name="lastname"
              onChange={formik.handleChange}
              value={formik.values.lastname}
            />
            {formik.touched.lastname && formik.errors.lastname && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.lastname}
              </div>
            )}
            </div>
          </div>

          <div className="flex items-start gap-y-3 gap-x-5">
            <label className="w-1/6">Gender:</label>
            <div className="flex flex-col w-1/2">
            <div className="flex flex-col ">
              <label>
                <input
                  type="radio"
                  value="female"
                  name="gender"
                  onChange={() => formik.setFieldValue("gender", "female")}
                  checked={formik.values.gender === "female"}
                />
                Female
              </label>
              <label>
                <input
                  type="radio"
                  value="male"
                  name="gender"
                  onChange={() => formik.setFieldValue("gender", "male")}
                  checked={formik.values.gender === "male"}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  value="other"
                  name="gender"
                  onChange={() => formik.setFieldValue("gender", "other")}
                  checked={formik.values.gender === "other"}
                />
                Other
              </label>
            </div>
            {formik.touched.gender && formik.errors.gender && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.gender}
              </div>
            )}
            </div>
          </div>

          <div className="flex items-center gap-x-5">
            <label className="w-1/6">Address</label>
            <div className="flex flex-col w-1/2">
            <input
              type="text"
              placeholder="Address"
              className="p-2 border w-full rounded-sm"
              id="address"
              name="address"
              onChange={formik.handleChange}
              value={formik.values.address}
            />
            {formik.touched.address && formik.errors.address && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.address}
              </div>
            )}
            </div>
          </div>

          <div className="flex items-center gap-x-5">
            <label className="w-1/6">Parents Name</label>
            <div className="flex flex-col w-1/2">
            <input
              type="text"
              placeholder="Parents Name"
              className="p-2 border w-full rounded-sm"
              id="parents"
              name="parents"
              onChange={formik.handleChange}
              value={formik.values.parents}
            />
            {formik.touched.parents && formik.errors.parents && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.parents}
              </div>
            )}
            </div>
          </div>

          <div className="flex items-center gap-x-5">
            <label className="w-1/6">Email</label>
            <div className="flex flex-col w-1/2">
            <input
              type="email"
              placeholder="Email"
              className="p-2 border w-full rounded-sm"
              id="email"
              name="email"
              onChange={formik.handleChange}
              value={formik.values.email}
            />
            {formik.touched.email && formik.errors.email && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.email}
              </div>
            )}
            </div>
          </div>

          <div className="flex items-center gap-x-5">
            <label className="w-1/6">Class</label>
            <div className="flex flex-col w-1/2">
            <input
              type="number"
              placeholder="Class"
              className="p-2 border w-full rounded-sm"
              id="class"
              name="class"
              onChange={formik.handleChange}
              value={formik.values.class}
            />
            {formik.touched.class && formik.errors.class && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.class}
              </div>
            )}
            </div>
          </div>

          <div className="flex items-center gap-x-5">
            <label className="w-1/6">Date of Birth</label>
            <div className="flex flex-col w-1/2 ">
            <DatePicker
              className="p-2 border w-full rounded-sm"
              onChange={handleDateChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.dateOfBirth}
              </div>
            )}
            </div>
          </div>

          <div className="flex items-center gap-x-5">
            <label className="w-1/6">Username</label>
            <div className="flex flex-col w-1/2 ">
            <input
              type="text"
              placeholder="Username"
              className="p-2 border w-full rounded-sm"
              id="username"
              name="username"
              onChange={formik.handleChange}
              value={formik.values.username}
            />
            {formik.touched.username && formik.errors.username && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.username}
              </div>
            )}
            </div>
          </div>

          <div className="flex items-center gap-x-5">
            <label className="w-1/6">Password</label>
            <div className="flex flex-col w-1/2 ">
            <input
              type="password"
              placeholder="Password"
              className="p-2 border w-full rounded-sm"
              id="password"
              name="password"
              onChange={formik.handleChange}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.password}
              </div>
            )}
            </div>
          </div>

          <button
            className="flex bg-purple-600 w-1/6 self-center justify-center p-3 rounded-md shadow-lg hover:bg-purple-800 text-white "
            type="submit"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddStudent;
