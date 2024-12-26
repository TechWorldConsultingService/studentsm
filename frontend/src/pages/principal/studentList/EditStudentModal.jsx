import React, { useEffect } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Select } from "antd";
import Password from "antd/es/input/Password";
import {addStudentSchema} from "./AddStudentModal"


const EditStudentModal = ({ handleCloseModal, fetchStudents, studentId }) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [studentData, setStudentData] = React.useState(null);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!access) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8000/api/students/${studentId}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
        setStudentData(response.data);
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/");
        } else {
          toast.error("Error fetching student details.");
        }
      }
    };

    if (studentId) {
      fetchStudentDetails();
    }
  }, [studentId, access, navigate]);

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
    validationSchema: addStudentSchema,
    onSubmit: async (values) => {
      await editStudent(values);
    },
    enableReinitialize: true, // Allow reinitialization when studentData is loaded
  });

  const editStudent = async (values) => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    try {
      await axios.put(`http://localhost:8000/api/students/${studentId}/`, values, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      toast.success("Student Updated Successfully.");
      fetchStudents();
      handleCloseModal();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error updating student.", error.message || error);
      }
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
          {/* Similar fields as AddStudentModal but with pre-filled values */}

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

          {/* Other fields will be similar to AddStudentModal... */}

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

export default EditStudentModal;
