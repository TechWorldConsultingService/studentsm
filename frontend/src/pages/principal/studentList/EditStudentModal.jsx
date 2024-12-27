import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Password from "antd/es/input/Password";

const EditStudentModal = ({ handleCloseModal, fetchStudents, studentInfo }) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState(null);
  const [classList, setClassList] = useState([]);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!access) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8000/api/students/${studentInfo.id}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setStudentData(response.data);
      } catch (error) {
        toast.error("Error fetching student details.");
      }
    };

    const fetchClassList = async () => {
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
        toast.error("Error fetching class data.");
      }
    };

    if (studentInfo) {
      fetchStudentDetails();
    }

    fetchClassList();
  }, [studentInfo, access, navigate]);

  const formik = useFormik({
    initialValues: {
      user: {
        username: studentData?.user.username || "",
        email: studentData?.user.email || "",
        password: studentData?.user.password || "",
        first_name: studentData?.user.first_name || "",
        last_name: studentData?.user.last_name || "",
      },
      phone: studentData?.phone || "",
      address: studentData?.address || "",
      date_of_birth: studentData?.date_of_birth || "",
      parents: studentData?.parents || "",
      gender: studentData?.gender || "",
      class_code: studentData?.class_code || "",
    },
    validationSchema: Yup.object({
      // Add validation schema here
    }),
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

    try {
      await axios.put(
        `http://localhost:8000/api/students/${studentInfo.id}/`,
        values,
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

  if (!studentData) {
    return <div>Loading...</div>; // Show loading until student data is fetched
  }

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold text-purple-800">Edit Student</h2>
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
          </div>

          {/* Password */}
          <div className="mb-4">
            <Password
              placeholder="Password"
              name="user.password"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.user.password}
            />
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
          </div>

          {/* Parent's Name */}
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
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
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
              {classList.map((cls) => (
                <option key={cls.id} value={cls.class_code}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between mt-6">
            <button
              type="submit"
              className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800"
            >
              Save Changes
            </button>
            <button
              onClick={handleCloseModal}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
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
