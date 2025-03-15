import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Password from "antd/es/input/Password";

const EditAccountentModal = ({
  handleCloseModal,
  fetchAccountents,
  accountentInfo,
}) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);

  useEffect(() => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
    }
  }, [access]);

  const editAccountentSchema = Yup.object().shape({
    user: Yup.object().shape({
      username: Yup.string()
      .when("$isUsernameEditable", {
        is: true,
        then: (schema) => schema
          .required("Username is required when changing.")
          .min(3, "Username must be at least 3 characters long.")
          .max(20, "Username can't exceed 20 characters."),
        otherwise: (schema) => schema.notRequired(),
      }),
      password: Yup.string()
      .when("$isPasswordEditable", {
        is: true,
        then: (schema) => schema
          .required("Password is required when changing.")
          .min(6, "Password must be at least 6 characters long.")
          .max(15, "Password can't exceed 15 characters."),
        otherwise: (schema) => schema.notRequired(),
      }),
    
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
      .matches(/^[0-9]{10}$/, "Phone number must be 10 digits long."),
    address: Yup.string()
      .required("Address is required.")
      .min(5, "Address must be at least 5 characters long.")
      .max(50, "Address can't exceed 50 characters."),
    gender: Yup.string().required("Gender is required."),
    date_of_joining: Yup.date()
      .required("Date of joining is required.")
      .max(new Date(), "Date of joining cannot be in the future."),
  });

  const formik = useFormik({
    initialValues: {
      user: {
        username: accountentInfo?.user.username || "",
        password: "",
        email: accountentInfo?.user.email || "",
        first_name: accountentInfo?.user.first_name || "",
        last_name: accountentInfo?.user.last_name || "",
      },
      phone: accountentInfo?.phone || "",
      address: accountentInfo?.address || "",
      gender: accountentInfo?.gender || "",
      date_of_joining: accountentInfo?.date_of_joining || "",
    },
    validationSchema: editAccountentSchema,
    onSubmit: async (values) => {
      await editAccountent(values);
    },
    enableReinitialize: true,
  });

  const editAccountent = async (values) => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      const payload = {
        ...values,
      };

      if (!isUsernameEditable) {
        delete payload.user.username;
      }

      if (!isPasswordEditable) {
        delete payload.user.password;
      }

      await axios.put(
        `http://localhost:8000/api/accountant/${accountentInfo.id}/update/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      toast.success("Accountant updated successfully.");
      fetchAccountents();
      handleCloseModal();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error updating accountant.");
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3 max-h-full overflow-auto">
        <h2 className="text-2xl font-bold text-purple-800">Edit Accountant</h2>
        <form onSubmit={formik.handleSubmit} className="mt-4">
          {/* Username */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="mr-2 text-gray-700 font-semibold">Username:</span>
              <button
                type="button"
                onClick={() => setIsUsernameEditable(!isUsernameEditable)}
                className="text-blue-500"
              >
                {isUsernameEditable ? "Cancel" : "Change Username"}
              </button>
            </div>
            {isUsernameEditable ? (
              <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full mt-2"
                placeholder="Username"
                name="user.username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.user.username}
              />
            ) : (
              <span>{formik.values.user.username || "Not Set"}</span>
            )}
            {formik.touched.user?.username && formik.errors.user?.username && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.user.username}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="mr-2 text-gray-700 font-semibold">Password:</span>
              <button
                type="button"
                onClick={() => setIsPasswordEditable(!isPasswordEditable)}
                className="text-blue-500"
              >
                {isPasswordEditable ? "Cancel" : "Change Password"}
              </button>
            </div>
            {isPasswordEditable ? (
              <Password
                placeholder="New Password"
                name="user.password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.user.password}
                className="w-full mt-2"
              />
            ) : (
              <span>********</span>
            )}
            {formik.touched.user?.password && formik.errors.user?.password && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.user.password}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
          <label className="block text-gray-700 font-semibold" >
              Email:
            </label>
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
          <label className="block text-gray-700 font-semibold" >
            First Name:
            </label>
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
          <label className="block text-gray-700 font-semibold" >
            Last Name:
            </label>
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
          <label className="block text-gray-700 font-semibold" >
            Phone:
            </label>
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
          <label className="block text-gray-700 font-semibold" >
            Address:
            </label>
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

          {/* Gender */}
          <div className="mb-4">
          <label className="block text-gray-700 font-semibold" >
            Gender:
            </label>
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

          {/* Date of Joining */}
          <div className="mb-4">
          <label className="block text-gray-700 font-semibold" >
            Date Of Joining:
            </label>
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

          {/* Buttons */}
          <div className="mt-6 text-center">
                      <label className="block text-gray-700 font-semibold" >
            
            </label>
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 mr-2"
            >
              Save Changes
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

export default EditAccountentModal;
