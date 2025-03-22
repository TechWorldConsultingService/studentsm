import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Password from "antd/es/input/Password";
import { Select } from "antd";
import * as Yup from "yup";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";

const EditTeacherModal = ({ handleCloseModal, fetchTeachers, teacherInfo }) => {
  const { access, is_ad } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [isUsernameEditable, setIsUsernameEditable] = useState(false);
  const [isPasswordEditable, setIsPasswordEditable] = useState(false);
  const [classList, setClassList] = useState([]);
  const [sectionsByClass, setSectionsByClass] = useState({});
  const [subjectList, setSubjectList] = useState([]);
  const [teacherSections, setTeacherSections] = useState([]);

  // Fetch classes and subjects on mount (and when access is available)
  useEffect(() => {
    if (access) {
      fetchClasses();
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

  const fetchSectionsForClass = async (classId) => {
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/classes/${classId}/sections/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (data && data.class && Array.isArray(data.class.sections)) {
        return data.class.sections;
      }
      return [];
    } catch (error) {
      toast.error(`Error fetching sections for class ${classId}.`);
      return [];
    }
  };

  const formik = useFormik({
    enableReinitialize: true,
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
      subjects: teacherInfo?.subjects
        ? teacherInfo.subjects.map((sub) => sub.id)
        : [],
      classes:
        teacherInfo?.classes ||
        teacherInfo?.class_details?.map((cls) => cls.id) ||
        [],
      classes_section: teacherInfo?.classes_section || [],
      class_teacher: teacherInfo?.class_teacher || "",
      class_teacher_section: teacherInfo?.class_teacher_section || "",
    },
    validationSchema: Yup.object().shape({
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
      subjects: Yup.array()
        .of(Yup.number().required("Subject is required."))
        .min(1, "At least one subject is required."),
      classes: Yup.array().of(Yup.number()),
      classes_section: Yup.array().of(Yup.number()),
      class_teacher: Yup.number().nullable(),
      class_teacher_section: Yup.number().nullable(),
    }),
    onSubmit: async (values) => {
      const payload = { ...values };

      if (!isUsernameEditable) {
        delete payload.user.username;
      }
      if (!isPasswordEditable) {
        delete payload.user.password;
      }
      await updateTeacher(payload);
    },
  });

  useEffect(() => {
    const classId = formik.values.class_teacher;
    if (classId) {
      fetchSectionsForClass(classId).then((sections) => {
        setTeacherSections(Array.isArray(sections) ? sections : []);
      });
    } else {
      setTeacherSections([]);
    }
  }, [formik.values.class_teacher]);

  const handleClassCheckboxChange = async (e) => {
    const classId = Number(e.target.value);
    let updatedClasses = [...formik.values.classes];
    if (e.target.checked) {
      if (!updatedClasses.includes(classId)) {
        updatedClasses.push(classId);
        if (!sectionsByClass[classId]) {
          const sections = await fetchSectionsForClass(classId);
          setSectionsByClass((prev) => ({ ...prev, [classId]: sections }));
        }
      }
    } else {
      updatedClasses = updatedClasses.filter((id) => id !== classId);
      const sectionsForClass =
        sectionsByClass[classId]?.map((sec) => sec.id) || [];
      const updatedSections = formik.values.classes_section.filter(
        (secId) => !sectionsForClass.includes(secId)
      );
      formik.setFieldValue("classes_section", updatedSections);
    }
    formik.setFieldValue("classes", updatedClasses);
  };

  const handleSectionCheckboxChange = (classId, sectionId, checked) => {
    let updatedSections = [...formik.values.classes_section];
    if (checked) {
      if (!updatedSections.includes(sectionId)) {
        updatedSections.push(sectionId);
      }
    } else {
      updatedSections = updatedSections.filter((id) => id !== sectionId);
    }
    formik.setFieldValue("classes_section", updatedSections);
  };

  const handleSubjectsChange = (selectedSubjectIds) => {
    formik.setFieldValue("subjects", selectedSubjectIds.map(Number));
  };

  // Update teacher API call.
  const updateTeacher = async (payload) => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
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
        <h2 className="text-2xl font-bold text-purple-800 mb-4">
          Edit Teacher
        </h2>
        <form onSubmit={formik.handleSubmit} className="mt-4">
          {/* Username */}
          <div className="mb-4">
            <div className="flex items-center">
              <label className="block text-gray-700 font-semibold mr-2">
                Field: Username
              </label>
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
                placeholder="Username"
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
              <label className="block text-gray-700 font-semibold mr-2">
                Field: Password
              </label>
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
            <label className="block text-gray-700 font-semibold">
              Field: Email
            </label>
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
            <label className="block text-gray-700 font-semibold">
              Field: First Name
            </label>
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
            <label className="block text-gray-700 font-semibold">
              Field: Last Name
            </label>
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
            <label className="block text-gray-700 font-semibold">
              Field: Phone
            </label>
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
            <label className="block text-gray-700 font-semibold">
              Field: Address
            </label>
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
            <label className="block text-gray-700 font-semibold">
              Field: Date of Joining
            </label>
            {is_ad ? (
              <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full"
                name="date_of_joining"
                placeholder="Date of Joining"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.date_of_joining}
              />
            ) : (
              <NepaliDatePicker
                value={formik.values.date_of_joining}
                onChange={(date) =>
                  formik.setFieldValue("date_of_joining", date)
                }
                onBlur={() => formik.setFieldTouched("date_of_joining", true)}
                inputClassName="border border-gray-300 p-2 rounded w-full"
                dateFormat="YYYY-MM-DD"
                language="ne"
                placeholder="Date of Joining "
              />
            )}

            {formik.touched.date_of_joining &&
              formik.errors.date_of_joining && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.date_of_joining}
                </div>
              )}
          </div>
          {/* Gender */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Field: Gender
            </label>
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
          {/* Subjects (Antd Multiple Select) */}
          <div className="mb-4">
            <label className="block font-semibold mb-1">Field: Subjects</label>
            <Select
              mode="multiple"
              className="w-full"
              placeholder="Select subjects"
              onChange={handleSubjectsChange}
              value={formik.values.subjects}
              optionLabelProp="label"
            >
              {subjectList.map((sub) => (
                <Select.Option
                  key={sub.id}
                  value={sub.id}
                  label={`${sub.subject_name} (${sub.subject_code})`}
                >
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
          {/* Classes (Checkboxes) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Field: Classes
            </label>
            {classList.map((cls) => (
              <div key={cls.id} className="flex items-center">
                <input
                  type="checkbox"
                  value={cls.id}
                  checked={formik.values.classes.includes(cls.id)}
                  onChange={handleClassCheckboxChange}
                  className="mr-2"
                />
                <label>
                  {cls.class_name} (ID: {cls.id})
                </label>
              </div>
            ))}
            {formik.touched.classes && formik.errors.classes && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.classes}
              </div>
            )}
          </div>
          {/* For each selected class, display its sections as checkboxes */}
          {formik.values.classes.map((classId) => {
            const sections = sectionsByClass[classId] || [];
            const className =
              classList.find((cls) => cls.id === classId)?.class_name || "";
            return (
              <div key={classId} className="mb-4 border p-2 rounded">
                <label className="block text-gray-700 font-semibold">
                  Field: Sections for {className}
                </label>
                {sections.map((section) => (
                  <div key={section.id} className="flex items-center">
                    <input
                      type="checkbox"
                      value={section.id}
                      checked={formik.values.classes_section.includes(
                        section.id
                      )}
                      onChange={(e) =>
                        handleSectionCheckboxChange(
                          classId,
                          section.id,
                          e.target.checked
                        )
                      }
                      className="mr-2"
                    />
                    <label>
                      {section.section_name} (ID: {section.id})
                    </label>
                  </div>
                ))}
              </div>
            );
          })}
          {/* Class Teacher (HTML Select Dropdown) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Field: Class Teacher of
            </label>
            <select
              name="class_teacher"
              className="border border-gray-300 p-2 rounded w-full"
              value={formik.values.class_teacher}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Class</option>
              {classList.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
            {formik.touched.class_teacher && formik.errors.class_teacher && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors.class_teacher}
              </div>
            )}
          </div>
          {/* Class Teacher Section (HTML Select Dropdown) */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold">
              Field: Class Teacher Section
            </label>
            <select
              name="class_teacher_section"
              className="border border-gray-300 p-2 rounded w-full"
              value={formik.values.class_teacher_section}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            >
              <option value="">Select Section</option>
              {teacherSections.map((section) => (
                <option key={section.id} value={section.id}>
                  {section.section_name}
                </option>
              ))}
            </select>
            {formik.touched.class_teacher_section &&
              formik.errors.class_teacher_section && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.class_teacher_section}
                </div>
              )}
          </div>
          {/* Submit & Cancel Buttons */}
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
