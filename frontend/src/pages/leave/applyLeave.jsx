import React, { useState } from "react";
import axios from "axios";
import MainLayout from "../../layout/MainLayout";
import { DatePicker } from "antd";
import moment from "moment";
import toast from 'react-hot-toast';
import {  useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";




const ApplyLeave = () => {
  const [leaveDate, setLeaveDate] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();
  const {access} = useSelector((state) => state.user);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!access) {
      setErrorMessage("User is not authenticated. Please log in.");
      return;
    }
    try {
      await axios.post(
        "http://localhost:8000/api/leave-applications/create/",
        { leave_date: leaveDate, message: message },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`, // Assuming token is stored in local storage
          },
        }
      );

     toast.success('Sucessfully Submitted')
      setErrorMessage("");
      setLeaveDate("");
      setMessage("")
      navigate("/myLeave");
    } catch (error) {
      const errorMsg =
        error.response?.data?.error ||
        "Error submitting leave application. Please try again.";
      setErrorMessage(errorMsg);
    }
  };

  const handleDateChange = (date, dateString) => {
    setLeaveDate(dateString);
  };

  

  return (
    <MainLayout>
      <div className="flex  items-center justify-self-center bg-purple-300 w-[45%]   m-10 rounded-md shadow-2xl">
        <div className="flex flex-col items-center justify-center w-full rounded-md  ">
          <h2 className="bg-purple-800  w-full p-4 text-white font-semibold text-center text-lg ">
            Apply for Leave
          </h2>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col items-center w-full "
          >
            <div className="flex flex-col  gap-4 m-5 p-5 w-full">
              <div className="flex gap-3 items-center ">
                <label className={`text-purple-900`}>Leave Date:</label>
                <DatePicker
                  onChange={handleDateChange}
                  placeholder="Select date"
                  format="YYYY-MM-DD"
                  required
                  className="w-full"
                  disabledDate={(current) =>
                    current && current < moment().startOf("day")
                  }
                />
              </div>

              <div className="flex gap-3 items-center ">
                <label className="text-purple-900">Message:</label>
                <textarea
                  className="w-full rounded-md p-1"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-purple-800 text-white p-2  rounded-md mb-10"
            >
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ApplyLeave;
