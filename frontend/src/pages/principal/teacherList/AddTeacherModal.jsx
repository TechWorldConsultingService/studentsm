import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Password from "antd/es/input/Password";
import { Select } from "antd";

// Example fetch hook or your approach
// If you're using your custom `useFetchData`, that is fine, just replicate it for sections as well.
const AddTeacherModal = ({ handleCloseModal, fetchTeachers }) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // We'll store the data from API calls here
  const [classList, setClassList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  // Fetch classes, sections, and subjects on mount
  useEffect(() => {
    if (access) {
      fetchClasses();
      fetchSections();
      fetchSubjects();
    }
  }, [access]);

  const fetchClasses = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/classes/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setClassList(data);
    } catch (err) {
      toast.error("Error fetching classes.");
    }
  };

  const fetchSections = async () => {
    try {
      // Replace with your actual endpoint for sections
      const { data } = await axios.get("http://localhost:8000/api/sections/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setSectionList(data);
    } catch (error) {
      toast.error("Error fetching sections.");
    }
  };

  const fetchSubjects = async () => {
    try {
      const { data } = await axios.get("http://localhost:8000/api/subjects/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setSubjectList(data);
    } catch (err) {
      toast.error("Error fetching subjects.");
    }
  };

  // Validation schema
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
      .matches(/^[0-9]{9,10}$/, "Phone number must be 9 or 10 digits.")
      .max(10, "Phone number can't exceed 10 digits."),
    address: Yup.string()
      .required("Address is required.")
      .min(2, "Address must be at least 2 characters.")
      .max(100, "Address can't exceed 100 characters."),
    date_of_joining: Yup.string().required("Date of joining is required."),
    gender: Yup.string().required("Gender is required."),

    // We'll only do a minimal validation for classes and sections
    classes: Yup.array()
      .of(Yup.number().required())
      .min(1, "Please select at least one class."),
    classes_section: Yup.array().of(Yup.number()).min(1, "Select at least one section."),

    class_teacher: Yup.number().nullable(),
    class_teacher_section: Yup.number().nullable(),

    // subjects is array of objects
    subjects: Yup.array()
      .of(
        Yup.object().shape({
          subject_code: Yup.string().required("Subject code is required."),
          subject_name: Yup.string().required("Subject name is required."),
        })
      )
      .min(1, "At least one subject is required."),
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
      classes_section: [],
      class_teacher: "",
      class_teacher_section: "",
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
        toast.error("Error adding teacher: " + (error.message || error));
      }
    }
  };

  // Helper to map user’s selected subject_codes to objects
  const handleSubjectsChange = (selectedSubjectCodes) => {
    const selectedObjects = subjectList
      .filter((sub) => selectedSubjectCodes.includes(sub.subject_code))
      .map((sub) => ({
        subject_code: sub.subject_code,
        subject_name: sub.subject_name,
      }));
    formik.setFieldValue("subjects", selectedObjects);
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
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Date of Joining (e.g. 2081/11/12)"
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

          {/* Subjects (Multi-select) */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Subjects:</label>
            <Select
              mode="multiple"
              placeholder="Select all subjects"
              className="w-full"
              onChange={handleSubjectsChange}
              value={formik.values.subjects.map((s) => s.subject_code)}
            >
              {subjectList.map((sub) => (
                <Select.Option key={sub.subject_code} value={sub.subject_code}>
                  {sub.subject_name} ({sub.subject_code})
                </Select.Option>
              ))}
            </Select>
            {formik.touched.subjects && formik.errors.subjects && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.subjects}
              </div>
            )}
          </div>

          {/* Classes (Multi-select) */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Classes:</label>
            <Select
              mode="multiple"
              placeholder="Select classes to teach"
              className="w-full"
              onChange={(selectedIDs) => {
                formik.setFieldValue("classes", selectedIDs);
              }}
              value={formik.values.classes}
            >
              {classList.map((cls) => (
                <Select.Option key={cls.id} value={cls.id}>
                  {cls.class_name} (ID: {cls.id})
                </Select.Option>
              ))}
            </Select>
            {formik.touched.classes && formik.errors.classes && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.classes}
              </div>
            )}
          </div>

          {/* Classes Section (Multi-select) */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Classes Sections:</label>
            <Select
              mode="multiple"
              placeholder="Select sections for those classes"
              className="w-full"
              onChange={(selectedSectionIDs) => {
                formik.setFieldValue("classes_section", selectedSectionIDs);
              }}
              value={formik.values.classes_section}
            >
              {sectionList.map((section) => (
                <Select.Option key={section.id} value={section.id}>
                  {section.section_name} (ID: {section.id})
                </Select.Option>
              ))}
            </Select>
            {formik.touched.classes_section && formik.errors.classes_section && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.classes_section}
              </div>
            )}
          </div>

          {/* Class Teacher (Single-select) */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Class Teacher of:</label>
            <Select
              allowClear
              placeholder="Select one class if applicable"
              className="w-full"
              onChange={(value) => formik.setFieldValue("class_teacher", value)}
              value={formik.values.class_teacher}
            >
              {classList.map((cls) => (
                <Select.Option key={cls.id} value={cls.id}>
                  {cls.class_name} (ID: {cls.id})
                </Select.Option>
              ))}
            </Select>
            {formik.touched.class_teacher && formik.errors.class_teacher && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.class_teacher}
              </div>
            )}
          </div>

          {/* Class Teacher Section (Single-select) */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">
              Class Teacher Section:
            </label>
            <Select
              allowClear
              placeholder="Select one section if applicable"
              className="w-full"
              onChange={(value) =>
                formik.setFieldValue("class_teacher_section", value)
              }
              value={formik.values.class_teacher_section}
            >
              {sectionList.map((section) => (
                <Select.Option key={section.id} value={section.id}>
                  {section.section_name} (ID: {section.id})
                </Select.Option>
              ))}
            </Select>
            {formik.touched.class_teacher_section &&
              formik.errors.class_teacher_section && (
                <div className="p-1 px-2 text-red-500 text-sm mt-1">
                  {formik.errors.class_teacher_section}
                </div>
              )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Add Teacher
            </button>
            <button
              type="button"
              className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
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
