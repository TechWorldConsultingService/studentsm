import React, { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import * as Yup from "yup";
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { setLoginDetails } from "../redux/reducerSlices/userSlice";
import { useDispatch } from "react-redux";

// Validation Schema
const loginSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Username must be at least 3 letters")
    .required("Username is required."),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long.")
    .required("Password is required."),
});

const Login = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const dispatch = useDispatch();

  const toggleVisibility = () => {
    setIsVisible(!isVisible);
  };

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => {
      await loginUser(values);
    },
  });

  const loginUser = async (values) => {
    try {
      const response = await axios.post("http://localhost:8000/api/login/", values);
      const data = response.data;

      if (response.status === 200) {
        const successMessage = data.msg || "Login successful";
        toast.success(successMessage);
        dispatch(setLoginDetails(data));

        // Redirect based on role
        switch (data.role) {
          case "student":
            navigate("/studentdashboard");
            break;
          case "teacher":
            navigate("/teacherdashboard");
            break;
          case "master":
            navigate("/masterdashboard");
            break;
          default:
            navigate("/principaldashboard");
        }
      } else {
        const errorMessage = data.msg || "Error during login.";
        toast.error(errorMessage);
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.msg) {
        toast.error(error.response.data.msg);
      } else {
        toast.error("Network error or server is down");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-purple-100 to-purple-200">
      {/* Left section / Image */}
      <div className="hidden md:flex md:w-1/2 items-center justify-center">
        <img
          src="/sideimage.jpg"
          alt="School"
          className="w-[80%] h-auto object-cover rounded-md shadow-2xl"
        />
      </div>

      {/* Right section / Form */}
      <div className="flex flex-col justify-center items-center w-full md:w-1/2 px-5 py-10">
        {/* Logo and Branding */}
        <div className="flex flex-col items-center mb-5">
          <img src="/logo.jpeg" alt="Logo" className="h-12 w-28 mb-2" />
          <span className="text-lg font-semibold text-purple-800">Satyam Xaviers</span>
        </div>

        {/* Card Wrapper */}
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md py-8 px-6 md:px-10 flex flex-col items-center">
          <h2 className="text-2xl font-bold text-purple-800">Welcome!</h2>
          <p className="text-sm text-gray-600 mb-6">Please enter your details to sign in</p>
          
          <form className="w-full" onSubmit={formik.handleSubmit}>
            {/* Username */}
            <div className="mb-5">
              <Input
                size="large"
                placeholder="Enter Username"
                type="text"
                id="username"
                prefix={<UserOutlined className="text-purple-800" />}
                name="username"
                className={`rounded-md ${
                  formik.touched.username && formik.errors.username
                    ? "border-red-500"
                    : "border-none"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              {formik.touched.username && formik.errors.username && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.username}</div>
              )}
            </div>

            {/* Password */}
            <div className="mb-5">
              <Input
                size="large"
                placeholder="Enter Password"
                id="password"
                name="password"
                prefix={<RiLockPasswordLine className="text-purple-800" />}
                type={isVisible ? "text" : "password"}
                className={`rounded-md ${
                  formik.touched.password && formik.errors.password
                    ? "border-red-500"
                    : "border-none"
                }`}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
                suffix={
                  <Button
                    type="text"
                    onClick={toggleVisibility}
                    className="flex items-center"
                    icon={
                      isVisible ? (
                        <FaRegEyeSlash className="text-purple-800" />
                      ) : (
                        <FaRegEye className="text-purple-800" />
                      )
                    }
                  />
                }
              />
              {formik.touched.password && formik.errors.password && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.password}</div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              htmlType="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-md py-2 text-lg font-medium transition-all"
            >
              Log In
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
