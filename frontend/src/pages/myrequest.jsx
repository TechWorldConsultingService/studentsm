import React, { useState } from "react";
import MainLayout from "../layout/MainLayout";
import { DatePicker, Select } from "antd";

const itemsList = [
  {
    key: "2",
    label: "Attendance",
  },
  {
    key: "3",
    label: "Leave",
  },
  {
    key: "4",
    label: "Fee",
  },
  {
    key: "1",
    label: "Reports",
  },
  {
    key: "5",
    label: "Other",
  },
];

const MyRequest = () => {
  const [requestDate, setRequestDate] = useState(null);
  const [selectedReason, setSelectedReason] = useState(null);
  const [message, setMessage] = useState("");

  const handleDateChange = (date, dateString) => {
    setRequestDate(dateString);
  };

  const handleReasonChange = (value) => {
    setSelectedReason(value);
    console.log(`Selected reason: ${value}`);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Request Date:", requestDate);
    console.log("Selected Reason:", selectedReason);
    console.log("Message:", message);

  };

  return (
    <MainLayout>
      <div className="flex items-center justify-self-center  bg-purple-300 w-[45%] m-5 rounded-md shadow-2xl">
        <div className="flex flex-col items-center justify-center w-full rounded-md">
          <h2 className="bg-purple-800 w-full p-4 text-white font-semibold text-center text-lg">
            Add Your Request
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
            <div className="flex flex-col gap-4 m-5 p-5 w-full">
              <div className="flex gap-3 items-center w-full">
                <label className="text-purple-900">Request Date:</label>
                <DatePicker
                  className="w-full p-1 border rounded-md"
                  onChange={handleDateChange}
                />
              </div>

              <div className="flex gap-3 items-center w-full">
                <label className="text-purple-900">Reason:</label>
                <Select
                  placeholder="Select a reason"
                  optionFilterProp="label"
                  onChange={handleReasonChange}
                  options={itemsList}
                  className="w-full  rounded"
                />
              </div>

              <div className="flex gap-3 items-center w-full">
                <label className="text-purple-900">Message:</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={message}
                  onChange={handleMessageChange}
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-purple-800 text-white p-2 rounded-md mb-10"
            >
              SUBMIT
            </button>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default MyRequest;
