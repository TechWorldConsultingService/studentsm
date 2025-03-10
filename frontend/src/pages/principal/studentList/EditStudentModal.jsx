import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Password from "antd/es/input/Password";
import * as Yup from "yup";

// Validation schema for editing a student
const EditStudentSchema = Yup.object().shape({
  user: Yup.object().shape({
    username: Yup.string()
      .min(3, "Username must be at least 3 characters long.")
      .max(20, "Username can't exceed 20 characters."),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters long.")
      .max(15, "Password can't exceed 15 characters.")
      .matches(
        /[a-zA-Z0-9]/,
        "Password must contain at least one letter and one number."
      ),
    email: Yup.string().email("Please enter a valid email address."),
    first_name: Yup.string()
      .min(2, "First name must be at least 2 characters.")
      .max(10, "First name can't exceed 10 characters."),
    last_name: Yup.string()
      .min(2, "Last name must be at least 2 characters.")
      .max(10, "Last name can't exceed 10 characters."),
  }),
  phone: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits long.")
    .min(10, "Phone number must be 10 digits.")
    .max(10, "Phone number must be 10 digits."),
  address: Yup.string()
    .min(5, "Address must be at least 5 characters long.")
    .max(50, "Address can't exceed 50 characters."),
  date_of_birth: Yup.date().max(
    new Date(),
    "Date of birth cannot be in the future."
  ),
  parents: Yup.string()
    .min(2, "Parent's name must be at least 2 characters long.")
    .max(25, "Parent's name can't exceed 25 characters."),
  gender: Yup.string().oneOf(["male", "female", "other"]),
  class_code: Yup.string()
    .min(1, "Class must be at least 1 character long.")
    .max(10, "Class can't exceed 10 characters."),
  class_code_section: Yup.number(),
  optional_subjects: Yup.array().of(Yup.number()),
});

const EditStudentModal = ({ handleCloseModal, fetchStudents, studentInfo }) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [classList, setClassList] = useState([]);
  const [sectionsList, setSectionsList] = useState([]);
  const [optionalSubjects, setOptionalSubjects] = useState([]);

  // Toggles for username/password editing
  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);

  useEffect(() => {
    if (access) {
      fetchClassList();
      fetchSections();
      fetchOptionalSubjects();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [access]);

  const fetchClassList = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/classes/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setClassList(data);
    } catch (error) {
      toast.error("Error fetching class data.");
    }
  };

  // Placeholder function - adapt or replace with your actual sections endpoint/data
  const fetchSections = async () => {
    try {
      // Example:
      // const { data } = await axios.get("http://localhost:8000/api/sections/", {
      //   headers: {
      //     "Content-Type": "application/json",
      //     Authorization: `Bearer ${access}`,
      //   },
      // });
      // setSectionsList(data);

      // For demonstration, we hardcode some sections:
      setSectionsList([
        { id: 1, name: "Section A" },
        { id: 2, name: "Section B" },
        { id: 3, name: "Section C" },
      ]);
    } catch (error) {
      toast.error("Error fetching sections.");
    }
  };

  const fetchOptionalSubjects = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/subjects/optional/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      setOptionalSubjects(data);
    } catch (error) {
      toast.error("Error fetching optional subjects.");
    }
  };

  // Pre-populate the form based on studentInfo
  const formik = useFormik({
    initialValues: {
      user: {
        username: studentInfo?.user?.username || "",
        email: studentInfo?.user?.email || "",
        password: "",
        first_name: studentInfo?.user?.first_name || "",
        last_name: studentInfo?.user?.last_name || "",
      },
      phone: studentInfo?.phone || "",
      address: studentInfo?.address || "",
      date_of_birth: studentInfo?.date_of_birth || "",
      parents: studentInfo?.parents || "",
      gender: studentInfo?.gender || "",
      class_code: studentInfo?.class_details?.id || "",
      class_code_section: studentInfo?.class_code_section || "",
      optional_subjects:
        studentInfo?.optional_subjects?.map((sub) => sub.id) || [],
    },
    validationSchema: EditStudentSchema,
    onSubmit: async (values) => {
      await editStudent(values);
    },
    enableReinitialize: true,
  });

  const editStudent = async (values) => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    // Build the payload with conditional fields
    const payload = {
      phone: values.phone,
      address: values.address,
      date_of_birth: values.date_of_birth,
      parents: values.parents,
      gender: values.gender,
      class_code: values.class_code,
      class_code_section: values.class_code_section,
      optional_subjects: values.optional_subjects,
      user: {},
    };

    // We only include the user fields if they changed them:
    if (isUsernameEditable) {
      payload.user.username = values.user.username;
    }
    if (isPasswordEditable) {
      payload.user.password = values.user.password;
    }
    // Email, first_name, last_name we assume can always be updated:
    payload.user.email = values.user.email;
    payload.user.first_name = values.user.first_name;
    payload.user.last_name = values.user.last_name;

    try {
      await axios.put(
        `http://localhost:8000/api/student/${studentInfo.id}/update/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      toast.success("Student Updated Successfully.");
      fetchStudents();
      handleCloseModal();
    } catch (error) {
      toast.error("Error updating student.");
    }
  };

  // Handle multiple select changes for optional subjects
  const handleOptionalSubjectsChange = (subjectId) => {
    const { optional_subjects } = formik.values;
    if (optional_subjects.includes(subjectId)) {
      formik.setFieldValue(
        "optional_subjects",
        optional_subjects.filter((id) => id !== subjectId)
      );
    } else {
      formik.setFieldValue(
        "optional_subjects",
        [...optional_subjects, subjectId]
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3 max-h-full overflow-auto">
        <h2 className="text-2xl font-bold text-purple-800">Edit Student</h2>
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
              placeholder="Parent's Name"
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

          {/* Class Code */}
          <div className="mb-4">
            <select
              className="border border-gray-300 p-2 rounded w-full"
              name="class_code"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.class_code}
            >
              <option value="">Select Class</option>
              {classList.map((item) => (
                <option key={item.id} value={item.id}>
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

          {/* Class Code Section */}
          <div className="mb-4">
            <select
              className="border border-gray-300 p-2 rounded w-full"
              name="class_code_section"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.class_code_section}
            >
              <option value="">Select Section</option>
              {sectionsList.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.name}
                </option>
              ))}
            </select>
            {formik.touched.class_code_section &&
              formik.errors.class_code_section && (
                <div className="p-1 px-2 text-red-500 text-sm mt-1">
                  {formik.errors.class_code_section}
                </div>
              )}
          </div>

          {/* Optional Subjects (Multi-Select / Checkboxes) */}
          <div className="mb-4">
            <p className="font-semibold mb-2">Optional Subjects:</p>
            {optionalSubjects.length > 0 ? (
              optionalSubjects.map((subject) => (
                <div key={subject.id} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={`subject-${subject.id}`}
                    value={subject.id}
                    checked={formik.values.optional_subjects.includes(subject.id)}
                    onChange={() => handleOptionalSubjectsChange(subject.id)}
                    className="mr-2"
                  />
                  <label htmlFor={`subject-${subject.id}`}>
                    {subject.subject_name}
                  </label>
                </div>
              ))
            ) : (
              <p>No optional subjects available.</p>
            )}
          </div>

          {/* Submit and Cancel */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 mr-2"
            >
              Save Change
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

export default EditStudentModal;
