import React, { useState } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import * as Yup from 'yup';
import { useFormik } from "formik";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from 'react-hot-toast';

// Validation Schema
const loginSchema = Yup.object().shape({
  // email: Yup.string()
  //   .email("Invalid email format")
  //   .required("Email is required."),
  
  username: Yup.string()
  .min(3,"Username must be at least 3 letter")
  .required("Username is required."),
  
  password: Yup.string()
    .min(8, "Password must be at least 8 characters long.")
    .required("Password is required."),
});

const Login = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

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
    <div className="flex items-center justify-between w-screen h-screen">
      <div className="w-1/2 flex justify-center">
        <img
          src="/sideimage.jpg"
          alt="School Picture"
          className="h-full w-[80%]"
        />
      </div>

      <div className="w-1/2 flex items-center justify-center flex-col">
        <img src="/logo.jpeg" alt="Logo" className="h-10 w-24" />
        <span className="font-semibold text-purple-800">Satyam Xaviers</span>
        <span className="text-3xl text-purple-800 mt-3">Welcome!</span>
        <span className="text-sm text-purple-800">Please Enter Your Details</span>
        <form
          className="w-full flex flex-col items-center justify-center  pt-5"
          onSubmit={formik.handleSubmit}
        >
          <Input
            size="large"
            placeholder="Enter Username"
            type="text"
            id="username"
            className="bg-purple-100 w-4/6"
            prefix={<UserOutlined className="text-purple-800" />}
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
          />
          {formik.touched.username && formik.errors.username && (
            <div className="p-1 px-2 text-red-500 text-sm mt-1">
              {formik.errors.username}
            </div>
          )}

          <Input
            placeholder="Enter Password"
            className="bg-purple-100 w-4/6 mt-5"
            name="password"
            id="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            prefix={<RiLockPasswordLine className="text-purple-800" />}
            type={isVisible ? "text" : "password"}
            suffix={
              <Button
                type="text"
                onClick={toggleVisibility}
                className="flex items-center"
                icon={isVisible ? <FaRegEyeSlash className="text-purple-800" /> : <FaRegEye className="text-purple-800" />}
              />
            }
          />
          {formik.touched.password && formik.errors.password && (
            <div className="p-1 px-2 text-red-500 text-sm mt-1 ">
              {formik.errors.password}
            </div>
          )}

          <Button
           htmlType="submit"
            className="bg-purple-600 text-white mt-8 px-7 py-4 hover:font-semibold"
          >
            Log In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
