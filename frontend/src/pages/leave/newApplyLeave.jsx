import React, { useState } from "react";
import axios from "axios";
import MainLayout from "../../layout/MainLayout";
import { DatePicker } from "antd";
import moment from "moment";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ApplyLeave = () => {
  const navigate = useNavigate();
  const { access } = useSelector((state) => state.user);

  const [leaveDate, setLeaveDate] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!access) {
      setErrorMessage("User is not authenticated. Please log in.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8000/api/leave-applications/create/",
        {
          leave_date: leaveDate,
          message: message,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      toast.success("Leave application submitted successfully.");
      setLeaveDate("");
      setMessage("");
      navigate("/myLeaves"); // after successful submission
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
      <div className="bg-purple-50 p-6 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300 max-w-lg mx-auto">
          <h1 className="text-3xl font-extrabold text-purple-800">
            Apply for Leave
          </h1>
          {errorMessage && <p className="mt-4 text-red-500">{errorMessage}</p>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-purple-900 text-sm">Leave Date:</label>
              <DatePicker
                onChange={handleDateChange}
                placeholder="Select date"
                format="YYYY-MM-DD"
                required
                className="w-full border rounded-md p-2 mt-1"
                disabledDate={(current) => current && current < moment().startOf("day")}
              />
            </div>

            <div>
              <label className="text-purple-900 text-sm">Message:</label>
              <textarea
                className="w-full border rounded-md p-2 mt-1"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Reason for leave"
                required
              />
            </div>

            <div className="mt-6 text-center">
              <button
                type="submit"
                className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none"
              >
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default ApplyLeave;
