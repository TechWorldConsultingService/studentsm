import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Password from "antd/es/input/Password";
import { Select } from "antd";
import * as Yup from "yup";

const EditTeacherModal = ({ handleCloseModal, fetchTeachers, teacherInfo }) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // Toggles for username/password editing
  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);

  // We'll store the data from API calls here
  const [classList, setClassList] = useState([]);
  const [sectionList, setSectionList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);

  useEffect(() => {
    if (access) {
      fetchClasses();
      fetchSections();
      fetchSubjects();
    } else {
      toast.error("User is not authenticated. Please log in.");
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

  // Validation schema (similar to AddTeacherModal)
  const EditTeacherSchema = Yup.object().shape({
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
    phone: Yup.string().matches(
      /^[0-9]{9,10}$/,
      "Phone number must be 9 or 10 digits."
    ),
    address: Yup.string().min(2).max(100),
    date_of_joining: Yup.string(),
    gender: Yup.string().oneOf(["male", "female", "other", ""]),
    subjects: Yup.array().of(
      Yup.object().shape({
        subject_code: Yup.string().required(),
        subject_name: Yup.string().required(),
      })
    ),
    classes: Yup.array().of(Yup.number()),
    classes_section: Yup.array().of(Yup.number()),
    class_teacher: Yup.number().nullable(),
    class_teacher_section: Yup.number().nullable(),
  });

  const formik = useFormik({
    initialValues: {
      user: {
        username: teacherInfo?.user?.username || "",
        email: teacherInfo?.user?.email || "",
        password: "",
        first_name: teacherInfo?.user?.first_name || "",
        last_name: teacherInfo?.user?.last_name || "",
      },
      phone: teacherInfo?.phone || "",
      address: teacherInfo?.address || "",
      date_of_joining: teacherInfo?.date_of_joining || "",
      gender: teacherInfo?.gender || "",
      // Convert array of subject objects -> array of full objects (with code/name)
      subjects: teacherInfo?.subjects || teacherInfo?.subject_details || [],
      // If teacherInfo gives you an array of classes as IDs, just set it directly.
      // If you have teacherInfo.class_details with more info, map to IDs:
      classes:
        teacherInfo?.classes ||
        teacherInfo?.class_details?.map((cls) => cls.id) ||
        [],
      classes_section:
        teacherInfo?.classes_section ||
        [],

      class_teacher: teacherInfo?.class_teacher || null,
      class_teacher_section: teacherInfo?.class_teacher_section || null,
    },
    validationSchema: EditTeacherSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      await updateTeacher(values);
    },
  });

  // Called on subject multi-select change: map code -> object
  const handleSubjectsChange = (selectedSubjectCodes) => {
    const selectedObjects = subjectList
      .filter((sub) => selectedSubjectCodes.includes(sub.subject_code))
      .map((sub) => ({
        subject_code: sub.subject_code,
        subject_name: sub.subject_name,
      }));
    formik.setFieldValue("subjects", selectedObjects);
  };

  // Actually update teacher
  const updateTeacher = async (values) => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    // Build the final payload
    const payload = {
      ...values,
    };

    // If not editing username, remove it from payload
    if (!isUsernameEditable) {
      delete payload.user.username;
    }
    // If not editing password, remove it from payload
    if (!isPasswordEditable) {
      delete payload.user.password;
    }

    try {
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
      toast.success("Teacher updated successfully.");
      fetchTeachers();
      handleCloseModal();
    } catch (error) {
      console.error("Error updating teacher:", error);
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error updating teacher.");
      }
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
              <label className="mr-2">Username:</label>
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
                name="user.username"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.user.username}
              />
            ) : (
              <span>{formik.values.user.username || "No username set"}</span>
            )}
            {formik.touched.user?.username && formik.errors.user?.username && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.user.username}
              </div>
            )}
          </div>

          {/* Password */}
          <div className="mb-4">
            <div className="flex items-center">
              <label className="mr-2">Password:</label>
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
                className="w-full mt-2"
                name="user.password"
                placeholder="Enter new password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.user.password}
              />
            ) : (
              <span>********</span>
            )}
            {formik.touched.user?.password && formik.errors.user?.password && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.user.password}
              </div>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <input
              type="email"
              className="border border-gray-300 p-2 rounded w-full"
              name="user.email"
              placeholder="Email"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.user.email}
            />
            {formik.touched.user?.email && formik.errors.user?.email && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.user.email}
              </div>
            )}
          </div>

          {/* First Name */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              name="user.first_name"
              placeholder="First Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.user.first_name}
            />
            {formik.touched.user?.first_name &&
              formik.errors.user?.first_name && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.user.first_name}
                </div>
              )}
          </div>

          {/* Last Name */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              name="user.last_name"
              placeholder="Last Name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.user.last_name}
            />
            {formik.touched.user?.last_name &&
              formik.errors.user?.last_name && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.user.last_name}
                </div>
              )}
          </div>

          {/* Phone */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              name="phone"
              placeholder="Phone"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.phone}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.phone}
              </div>
            )}
          </div>

          {/* Address */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              name="address"
              placeholder="Address"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.address}
            />
            {formik.touched.address && formik.errors.address && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.address}
              </div>
            )}
          </div>

          {/* Date of Joining */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              name="date_of_joining"
              placeholder="Date of Joining (e.g. 2081/11/12)"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.date_of_joining}
            />
            {formik.touched.date_of_joining &&
              formik.errors.date_of_joining && (
                <div className="text-red-500 text-sm mt-1">
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
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.gender}
              </div>
            )}
          </div>

          {/* Subjects (Multi-select) */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Subjects:</label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder="Select subjects"
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
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.subjects}
              </div>
            )}
          </div>

          {/* Classes (Multi-select) */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Classes:</label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder="Select classes to teach"
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
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.classes}
              </div>
            )}
          </div>

          {/* Classes Section (Multi-select) */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Classes Sections:</label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder="Select sections for those classes"
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
            {formik.touched.classes_section &&
              formik.errors.classes_section && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.classes_section}
                </div>
              )}
          </div>

          {/* Class Teacher (Single-select) */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Class Teacher of:</label>
            <Select
              allowClear
              className="w-full"
              placeholder="Select one class if applicable"
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
              <div className="text-red-500 text-sm mt-1">
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
              className="w-full"
              placeholder="Select one section if applicable"
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
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.class_teacher_section}
                </div>
              )}
          </div>

          {/* Submit and Cancel */}
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
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
