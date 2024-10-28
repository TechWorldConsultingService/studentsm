import React, { useState } from "react";
import { Select } from "antd";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { DatePicker } from "antd";
import axios from "axios";

// Validation Schema
const addStudentSchema = Yup.object().shape({
  user: Yup.object({
    first_name: Yup.string().min(3, "First Name must be at least 3 letters").required("First Name is required"),
    last_name: Yup.string().min(3, "Last Name must be at least 3 letters").required("Last Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required"),
    username: Yup.string().min(3, "Username must be at least 3 letters").required("Username is required"),
    password: Yup.string().min(4, "Password must be at least 4 characters").required("Password is required"),
  }),
  phone: Yup.string().required("Phone number is required"),
  address: Yup.string().min(3, "Address must be at least 3 letters").required("Address is required"),
  gender: Yup.string().required("Gender is required"),
  parents: Yup.string().required("Parent name is required"),
  class_assigned: Yup.string().required("Class is required"),
  date_of_birth: Yup.date().required("Date of Birth is required").max(new Date(), "Date cannot be in the future"),
});

const AddStudent = () => {
  const formik = useFormik({
    initialValues: {
      user: {
        username: "",
        password: "",
        email: "",
        first_name: "", 
        last_name: "",
      },
      phone: "",
      address: "",
      gender: "",
      class_assigned: "", 
      date_of_birth: "",  
      parents: "",
    },
    validationSchema: addStudentSchema,
    onSubmit: async(values) => {
      // await registerStudent(values);
      // await console.log(values)
      try {
        // await console.log(values)

        const response = await axios.post(
          'http://localhost:8000/api/register/student/', values, { headers: { 'Content-Type': 'application/json' } }
        );
        if (response.status === 201) {
          console.log('Student registered successfully:', response.data);
        }
      } catch  (error) {
        console.error('Error registering student:', error.response?.data);
        // console.log(values)
      }
    },
  });


  const handleDateChange = (date) => {
    formik.setFieldValue("date_of_birth", date);
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
              name="user.first_name"
              onChange={formik.handleChange}
              value={formik.values.user.first_name}
            />
            {formik.touched.user?.first_name && formik.errors.user?.first_name && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.user.first_name}
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
              name="user.last_name"
              onChange={formik.handleChange}
              value={formik.values.user.last_name}
            />
            {formik.touched.last_name && formik.errors.last_name && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.user?.last_name}
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
              name="user.email"
              onChange={formik.handleChange}
              value={formik.values.user?.email}
            />
            {formik.touched.user?.email && formik.errors.user?.email && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.user?.email}
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
              name="class_assigned"
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
              // selected={formik.values.date_of_birth}
              className="p-2 border w-full rounded-sm"
              onChange={(date) => formik.setFieldValue("date_of_birth", date)}
              // name="date_of_birth"
              onBlur={formik.handleBlur}
              value={formik.values.date_of_birth}
            />
            {formik.touched.date_of_birth && formik.errors.date_of_birth && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.date_of_birth}
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
              name="user.username"
              onChange={formik.handleChange}
              value={formik.values.user?.username}
            />
            {formik.touched.user?.username && formik.errors.user?.username && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.user?.username}
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
              name="user.password"
              onChange={formik.handleChange}
              value={formik.values.user?.password}
            />
            {formik.touched.user?.password && formik.errors.user?.password && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.user?.password}
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
