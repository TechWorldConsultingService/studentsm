import React, { useState, useEffect } from "react";
import { Select } from "antd";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import { DatePicker } from "antd";
import moment from "moment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CloseOutlined } from "@ant-design/icons";

// Validation Schema
const addToTeacherSchema = Yup.object().shape({
  user: Yup.object({  
    first_name: Yup.string().min(3, "First Name must be at least 3 letter").required("First Name is required"),
    last_name: Yup.string().min(3, "Last Name must be at least 3 letter").required("Last Name is required"),
    email: Yup.string().email("Invalid email format").required("Email is required."),
    username: Yup.string().min(3, "Username must be at least 3 letter").required("Username is required."),
    password: Yup.string().min(4, "Password must be at least 4 characters long.").required("Password is required."),
    
    }),
  gender: Yup.string().required("Gender must be selected"),
  address: Yup.string().min(3, "Address must be at least 3 letter").required("Address is required"),
  subjects: Yup.array().min(1, "At least one Subject must be selected").required("Subjects are required"),
  phone: Yup.string().length(10, "Mobile number must be exactly 10 digits").matches(/^\d{10}$/, "Mobile number must be a valid 10-digit number").required("Mobile number is required."),
  date_of_joining: Yup.date().required("Date of joining must be selected").max(new Date(), "Date of joining cannot be in the future"),
  classes: Yup.array().min(1, "At least one class must be selected").required("Classes are required"),
  class_teacher: Yup.string().nullable(),
});

const AddTeacher = () => {
  const navigate = useNavigate();  // Initialize the navigate function
  const [subjects, setSubjects] = useState([]);  // Stores the subjects fetched from the api
  const [classes, setClasses] = useState([]);

  const closeForm = () => {
    navigate("/principaldashboard"); // Navigate back or close the form
  };

  useEffect(()=> {
    //  Fetch data from api
    const fetchSubjects = async () => {
      try{
        const response = await axios.get("http://localhost:8000/api/subjects/");
        const subjects = response.data.map(subject => ({
          value:subject.id,
          label:subject.subject_name
        }));
        setSubjects(subjects);
      } catch (error){
        toast.error("Failed to load subjects");
      }
    };
    const fetchClasses = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/classes/");
        setClasses(response.data.map(cls => ({ value: cls.id, label: cls.class_name })));
      } catch (error) {
        toast.error("Failed to load classes");
      }
    };

    fetchSubjects();
    fetchClasses();
  },[]);


  const formik = useFormik({
    initialValues: {
      user:{
        first_name: "",
        last_name: "",
        email: "",
        username: "",
        password: "",
      },
      
      gender: "",
      address: "",
      subject: [],
      phone: "",
      date_of_joining: null,
      classes:[],
      class_teacher: null,
      
    },
    validationSchema: addToTeacherSchema,
    onSubmit: async(values) => {
      // await registerTeacher(values);
      values.date_of_joining = moment(values.date_of_joining).format("YYYY-MM-DD");
      console.log(values);
      await registerTeacher(values);
    },
  });

  const registerTeacher = async (values) => {
    try {
      const response = await axios.post('http://localhost:8000/api/register/teacher/', values, {
        headers: { 'Content-Type': 'application/json' }
      });
  
      if (response.status === 201) {
        toast.success(response.data.msg || "Teacher register successfully");
        navigate("/principaldashboard");
      }

    } catch (error) {
      const errorMsg = error.response?.data?.msg || 'An error occurred';
      toast.error(errorMsg);
    }
  };


  const handleSubjectChange = (value) => formik.setFieldValue("subjects", value);
  const handleClassChange = (value) => formik.setFieldValue("classes", value);
  const handleClassTeacherChange = (value) => formik.setFieldValue("class_teacher", value);

  const handleDateChange = (date) => {
    formik.setFieldValue("date_of_joining", date);
  };

  return (

  <div className="flex">

    <div className="flex flex-col bg-purple-400 text-white  w-full px-32 pt-5 pb-10  items-center justify-center">
      <div className="flex flex-col items-center justify-center  bg-purple-800 rounded-sm shadow-2xl w-[80%] p-3">
        
        {/* Close Button */}
        <button onClick={closeForm} className="absolute top-5 right-3 text-red-600 hover:text-red-800">
          <CloseOutlined className="text-2xl" />
        </button>

        <h2 className=" text-3xl font-bold">Teacher Details</h2>
        <span>Enter the details of Teacher</span>
      </div>

      <div className="bg-white text-purple-900 w-[80%]">
        <form
          onSubmit={formik.handleSubmit}
          className="flex flex-col p-8 gap-y-4 justify-center"
        >

          {/* First Name */} 
          <div className="flex gap-x-5 items-center">
            <label className="w-1/6">First Name:</label>
            <div className="flex flex-col w-1/2">
            <input
              className="border p-2 rounded-sm w-full"
              type="text"
              placeholder="First Name"
              id="first_name"
              name="user.first_name"
              onChange={formik.handleChange}
              value={formik.values.user.first_name}
            />
            {formik.touched.user?.first_name && formik.errors.user?.first_name && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.user.first_name}
              </div>
            )}
            </div>
          </div>

          {/* Last Name */}
          <div className="flex gap-x-5 items-center">
            <label className="w-1/6">Last Name:</label>
            <div className="flex flex-col w-1/2">
            <input
              className="border p-2 rounded-sm w-full"
              type="text"
              placeholder="Last Name"
              id="last_name"
              name="user.last_name"
              onChange={formik.handleChange}
              value={formik.values.user.last_name}
            />
            {formik.touched.user?.last_name && formik.errors.user?.last_name && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.user?.last_name}
              </div>
            )}
            </div>
          </div>

          <div className="flex items-start gap-y-3 gap-x-5">
            <label className="w-1/6">Gender:</label>
            <div className="flex flex-col w-1/2">
            <div className="flex flex-col ">
              <label>
                <input
                  type="radio"
                  value="female"
                  name="gender"
                  onChange={() => formik.setFieldValue("gender", "female")}
                  checked={formik.values.gender === "female"}
                />
                Female
              </label>
              <label>
                <input
                  type="radio"
                  value="male"
                  name="gender"
                  onChange={() => formik.setFieldValue("gender", "male")}
                  checked={formik.values.gender === "male"}
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  value="other"
                  name="gender"
                  onChange={() => formik.setFieldValue("gender", "other")}
                  checked={formik.values.gender === "other"}
                />
                Other
              </label>
            </div>
            {formik.touched.gender && formik.errors.gender && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.gender}
              </div>
            )}
            </div>
          </div>

          <div className="flex items-center gap-x-5">
            <label className="w-1/6">Address</label>
            <div className="flex flex-col w-1/2">
            <input
              type="text"
              placeholder="Address"
              className="p-2 border w-full rounded-sm"
              id="address"
              name="address"
              onChange={formik.handleChange}
              value={formik.values.address}
            />
            {formik.touched.address && formik.errors.address && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.address}
              </div>
            )}
            </div>
          </div>

          
          {/* Classes Selection */}
          <div className="flex items-center gap-x-5">
            <label className="w-1/6">Classes</label>
            <div className="flex flex-col w-1/2">
              <Select
                mode="multiple"
                className="w-[200px] h-10"
                placeholder="Select Classes"
                optionFilterProp="label"
                onChange={(value) => formik.setFieldValue("classes", value)}
                options={classes}
              />
              {formik.touched.classes && formik.errors.classes && (
                <div className="p-1 px-2 text-red-500 text-sm mt-1">{formik.errors.classes}</div>
              )}
            </div>
          </div>

          {/* Class Teacher Selection */}
          <div className="flex items-center gap-x-5">
            <label className="w-1/6">Class Teacher</label>
            <div className="flex flex-col w-1/2">
              <Select
                className="w-[200px] h-10"
                placeholder="Assign as Class Teacher"
                optionFilterProp="label"
                onChange={handleClassTeacherChange}
                options={classes}
                allowClear
              />
              {formik.touched.class_teacher && formik.errors.class_teacher && (
                <div className="p-1 px-2 text-red-500 text-sm mt-1">
                  {formik.errors.class_teacher}
                </div>
              )}
            </div>
          </div>

          {/* Subject for tutoring */}
          <div className="flex items-center gap-x-5 ">
            <label className="w-1/6">Subject for Tutoring</label>
            <div className="flex flex-col w-1/2">
            <Select
              mode="multiple" // Enable multiple selection
              showSearch
              className="w-[200px] h-10"
              placeholder="Subject for Tutoring"
              optionFilterProp="label"
              onChange={handleSubjectChange}
              // onBlur={formik.handleBlur}
              options={subjects}
              
            />
            {formik.touched.subjects && formik.errors.subjects && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.subjects}
              </div>
            )}
            </div>
          </div>

            {/* Email */}
          <div className="flex items-center gap-x-5">
            <label className="w-1/6">Email</label>
            <div className="flex flex-col w-1/2">
            <input
              type="email"
              placeholder="Email"
              className="p-2 border w-full rounded-sm"
              id="email"
              name="user.email"
              onChange={formik.handleChange}
              value={formik.values.user?.email}
            />
            {formik.touched.user?.email && formik.errors.user?.email && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.user?.email}
              </div>
            )}
            </div>
          </div>

            {/* Mobile Number */}
          <div className="flex items-center gap-x-5">
            <label className="w-1/6">Mobile Number</label>
            <div className="flex flex-col w-1/2">
            <input
              type="text"
              placeholder="Mobile Number"
              className="p-2 border w-full rounded-sm"
              id="phone"
              name="phone"
              onChange={formik.handleChange}
              value={formik.values.phone}
            />
            {formik.touched.phone && formik.errors.phone && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.phone}
              </div>
            )}
            </div>
          </div>

            {/* Date of Joining */}
          <div className="flex items-center gap-x-5">
            <label className="w-1/6">Date of Joining</label>
            <div className="flex flex-col w-1/2 ">
            <DatePicker
              className="p-2 border w-full rounded-sm"
              onChange={handleDateChange}
              onBlur={formik.handleBlur}
              value={formik.values.date_of_joining ? moment(formik.values.date_of_joining) : null}
              format="YYYY-MM-DD"
            />
            {formik.touched.date_of_joining && formik.errors.date_of_joining && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.date_of_joining}
              </div>
            )}
            </div>
          </div>

          <div className="flex items-center gap-x-5">
            <label className="w-1/6">Username</label>
            <div className="flex flex-col w-1/2 ">
            <input
              type="text"
              placeholder="Username"
              className="p-2 border w-full rounded-sm"
              id="username"
              name="user.username"
              onChange={formik.handleChange}
              value={formik.values.user?.username}
            />
            {formik.touched.user?.username && formik.errors.user?.username && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.user?.username}
              </div>
            )}
            </div>
          </div>

          <div className="flex items-center gap-x-5">
            <label className="w-1/6">Password</label>
            <div className="flex flex-col w-1/2 ">
            <input
              type="password"
              placeholder="Password"
              className="p-2 border w-full rounded-sm"
              id="password"
              name="user.password"
              onChange={formik.handleChange}
              value={formik.values.user?.password}
            />
            {formik.touched.user?.password && formik.errors.user?.password && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.user?.password}
              </div>
            )}
            </div>
          </div>

          <button
            className="flex bg-purple-600 w-1/6 self-center justify-center p-3 rounded-md shadow-lg hover:bg-purple-800 text-white "
            type="submit"
            // onClick={formik.submitForm}
          >
            Submit
          </button>
        </form>
      </div>
    </div>
    </div>
  );
};

export default AddTeacher;
