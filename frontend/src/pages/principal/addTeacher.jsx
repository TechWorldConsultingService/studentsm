import React, { useState } from "react";
import { Select } from "antd";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { DatePicker } from "antd";

// Validation Schema
const addToTeacherSchema = Yup.object().shape({
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

  subject: Yup.string().required("Subject for tutoring must be selected"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required."),

  mobile: Yup.string()
    .length(10, "Mobile number must be exactly 10 digits")
    .matches(/^\d{10}$/, "Mobile number must be a valid 10-digit number")
    .required("Mobile number is required."),

  dateOfJoining: Yup.date()
    .required("Date of joining must be selected")
    .max(new Date(), "Date of joining cannot be in the future"),

  username: Yup.string()
    .min(3, "Username must be at least 3 letter")
    .required("Username is required."),

  password: Yup.string()
    .min(4, "Password must be at least 4 characters long.")
    .required("Password is required."),
});

const AddTeacher = () => {
  const formik = useFormik({
    initialValues: {
      firstname: "",
      lastname: "",
      gender: "",
      address: "",
      subject: "",
      email: "",
      mobile: "",
      dateOfJoining: "",
      username: "",
      password: "",
    },
    validationSchema: addToTeacherSchema,
    onSubmit: async(values) => {
      // await registerTeacher(values);
      await console.log(values)
    },
  });

   // const registerTeacher = async (values) => {
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


  const handleSubjectChange = (value) => {
    formik.setFieldValue("subject", value);
  };

  const handleDateChange = (date) => {
    formik.setFieldValue("dateOfJoining", date);
  };

  return (
    <div className="flex flex-col bg-purple-400 text-white  w-full px-32 pt-5 pb-10  items-center justify-center">
      <div className="flex flex-col items-center justify-center  bg-purple-800 rounded-sm shadow-2xl w-[80%] p-3">
        <h2 className=" text-3xl font-bold">Teacher Details</h2>
        <span>Enter the details of Teacher</span>
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

          <div className="flex items-center gap-x-5 ">
            <label className="w-1/6">Subject for Tutoring</label>
            <div className="flex flex-col">
            <Select
              showSearch
              className="w-[200px] h-10"
              placeholder="Subject for Tutoring"
              optionFilterProp="label"
              onChange={handleSubjectChange}
              onBlur={formik.handleBlur}
              options={[
                {
                  value: "math",
                  label: "Math",
                },
                {
                  value: "science",
                  label: "Science",
                },
                {
                  value: "computer",
                  label: "Computer",
                },
                {
                  value: "english",
                  label: "English",
                },
              ]}
            />
            {formik.touched.subject && formik.errors.subject && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.subject}
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
            <label className="w-1/6">Mobile Number</label>
            <div className="flex flex-col w-1/2">
            <input
              type="number"
              placeholder="Mobile Number"
              className="p-2 border w-full rounded-sm"
              id="mobile"
              name="mobile"
              onChange={formik.handleChange}
              value={formik.values.mobile}
            />
            {formik.touched.mobile && formik.errors.mobile && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.mobile}
              </div>
            )}
            </div>
          </div>

          <div className="flex items-center gap-x-5">
            <label className="w-1/6">Date of Joining</label>
            <div className="flex flex-col w-1/2 ">
            <DatePicker
              className="p-2 border w-full rounded-sm"
              onChange={handleDateChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.dateOfJoining && formik.errors.dateOfJoining && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.dateOfJoining}
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

export default AddTeacher;
