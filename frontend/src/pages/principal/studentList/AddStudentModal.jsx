import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Password from "antd/es/input/Password";

export const addStudentSchema = Yup.object().shape({
  user: Yup.object().shape({
    username: Yup.string()
      .required("Username is required.")
      .min(3, "Username must be at least 3 characters long.")
      .max(10, "Username can't exceed 10 characters."),
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
    .max(25, "Address can't exceed 25 characters."),
  date_of_birth: Yup.date()
    .required("Date of birth is required.")
    .max(new Date(), "Date of birth cannot be in the future.")
    .test(
      "age",
      "Student must be at least 3 years old.",
      (value) => new Date().getFullYear() - new Date(value).getFullYear() >= 3
    ),
  parents: Yup.string()
    .required("Parent's name is required.")
    .min(2, "Parent's name must be at least 2 characters long.")
    .max(25, "Parent's name can't exceed 25 characters."),
  gender: Yup.string()
    .required("Gender is required.")
    .oneOf(
      ["male", "female", "other"],
      "Gender must be one of 'male', 'female', or 'other'."
    ),
  class_code: Yup.string()
    .required("Class code is required.")
    .min(1, "Class code must be at least 1 character long.")
    .max(10, "Class code can't exceed 10 characters."),
});

const AddStudentModal = ({ handleCloseModal, fetchStudents }) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [classList, setClassList] = useState([]);

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
      date_of_birth: "",
      parents: "",
      gender: "",
      class_code: "",
    },
    validationSchema: addStudentSchema,
    onSubmit: async (values) => {
      await addStudent(values);
    },
  });

  const addStudent = async (values) => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/register/student/", values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      toast.success("Student Added Successfully.");
      fetchStudents();
      handleCloseModal();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error adding student.", error.message || error);
      }
    }
  };

  const fetchClass = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      const { data } = await axios.get("http://localhost:8000/api/classes/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setClassList(data);
    } catch (error) {
      toast.error("Error fetching class:", error.message || error);
    }
  };

  useEffect(() => {
    fetchClass();
  }, [access, navigate]);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3 max-h-full overflow-auto">
        <h2 className="text-2xl font-bold text-purple-800">Add Student</h2>
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

          {/* Date of Birth */}
          <div className="mb-4">
            <input
              type="date"
              className="border border-gray-300 p-2 rounded w-full"
              name="date_of_birth"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.date_of_birth}
            />
            {formik.touched.date_of_birth && formik.errors.date_of_birth && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.date_of_birth}
              </div>
            )}
          </div>

          {/* Parents */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Parents"
              name="parents"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.parents}
            />
            {formik.touched.parents && formik.errors.parents && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.parents}
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

          {/* Class Code */}
          <div className="mb-4">
            <select
              name="class_code"
              className="border border-gray-300 p-2 rounded w-full"
              value={formik.values.class_code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Class</option>
              {classList.length > 0 &&
                classList.map((item) => (
                  <option key={item.id} value={item.class_code}>
                    {item.class_name}
                  </option>
                ))}
            </select>
            {formik.touched.class_code && formik.errors.class_code && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.class_code}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 mr-2"
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

export default AddStudentModal;
