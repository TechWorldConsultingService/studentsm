import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Password from "antd/es/input/Password";
import * as Yup from "yup";
import { Select } from "antd";
import useFetchData from "../../../hooks/useFetch";


const EditTeacherSchema = Yup.object().shape({
  user: Yup.object().shape({
    username: Yup.string()
      .required("Username is required.")
      .min(3, "Username must be at least 3 characters long.")
      .max(20, "Username can't exceed 20 characters long."),
    password: Yup.string()
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
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits long."),
  address: Yup.string()
    .required("Address is required.")
    .min(5, "Address must be at least 5 characters long.")
    .max(25, "Address can't exceed 25 characters."),
  date_of_joining: Yup.date()
    .required("Date of joining is required.")
    .max(new Date(), "Date of joining cannot be in the future."),
  gender: Yup.string()
    .required("Gender is required.")
    .oneOf(
      ["male", "female", "other"],
      "Gender must be one of 'male', 'female', or 'other'."
    ),
  subjects: Yup.array()
    .of(
      Yup.object().shape({
        subject_code: Yup.string().required("Subject code is required."),
        subject_name: Yup.string().required("Subject name is required."),
      })
    )
    .min(1, "At least one subject must be selected."),
  classes: Yup.array()
    .of(
      Yup.object().shape({
        class_code: Yup.string().required("Class code is required."),
        class_name: Yup.string().required("Class name is required."),
      })
    )
    .min(1, "At least one class must be selected."),
  class_teacher: Yup.number().required("Class teacher is required."),
});

const EditTeacherModal = ({ handleCloseModal, fetchTeachers, teacherInfo }) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);

  const { fetchedData: classList } = useFetchData(
    "http://localhost:8000/api/classes/"
  );

  const { fetchedData: subjectList } = useFetchData(
    "http://localhost:8000/api/subjects/"
  );

  useEffect(() => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
  }, [access, navigate]);

  const formik = useFormik({
    initialValues: {
      user: {
        username: teacherInfo?.user.username || "",
        email: teacherInfo?.user.email || "",
        password: "",
        first_name: teacherInfo?.user.first_name || "",
        last_name: teacherInfo?.user.last_name || "",
      },
      phone: teacherInfo?.phone || "",
      address: teacherInfo?.address || "",
      date_of_joining: teacherInfo?.date_of_joining || "",
      gender: teacherInfo?.gender || "",
      subjects: teacherInfo?.subject_details || [],
      classes: teacherInfo?.class_details || [],
      class_teacher: teacherInfo?.class_teacher || "",
    },
    validationSchema: EditTeacherSchema,
    onSubmit: async (values) => {
      await editTeacher(values);
    },
    enableReinitialize: true,
  });

  const editTeacher = async (values) => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    try {
      const payload = {
        ...values,
      };

      if (isUsernameEditable) {
        payload.user = {
          ...payload.user,
          username: values.user.username,
        };
      } else {
        delete payload.user.username;
      }

      if (isPasswordEditable) {
        payload.user = {
          ...payload.user,
          password: values.user.password,
        };
      } else {
        delete payload.user.password;
      }

      await axios.put(
        `http://localhost:8000/api/teacher/${teacherInfo.id}/update/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      toast.success("Teacher Updated Successfully.");
      fetchTeachers();
      handleCloseModal();
    } catch (error) {
      console.log("error on updating is :",error)
      toast.error("Error updating teacher.");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3 max-h-full overflow-auto">
        <h2 className="text-2xl font-bold text-purple-800">Edit Teacher</h2>
        <form onSubmit={formik.handleSubmit} className="mt-4">
          {/* Username */}
          <div className="mb-4">
            <div className="flex items-center">
              <span className="mr-2">Username:</span>
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
              <span className="mr-2">Password:</span>
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
                placeholder="Password"
                name="user.password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.user.password}
                className="w-full mt-2"
              />
            ) : (
              <span>
                {formik.values.user.password ? "********" : "Not Set"}
              </span>
            )}
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
              className="border border-gray-300 p-2 rounded w-full"
              name="gender"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.gender}
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

          {/* Subjects */}
          <div className="mb-4">
            <Select
              mode="multiple"
              name="subjects"
              placeholder="Select all subjects"
              className="w-full"
              onChange={(selectedValues) => {
                // Map selected subject codes to full subject objects
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
                    key={item.subject_code}
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
                // Map selected class codes to full class objects
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

          {/* Class Teacher */}
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

          {/* Submit Button */}
          <div className="mt-6 text-center">
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

export default EditTeacherModal;
