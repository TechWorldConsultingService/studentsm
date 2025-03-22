import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import AddAttendanceModal from "./AddAttendanceModal";
import ViewAttendanceModal from "./ViewAttendanceModal";
import { useSelector } from "react-redux";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { ADToBS } from "bikram-sambat-js";

const Attendance = ({ selectedClassForAttendance }) => {
  const { is_ad } = useSelector((state) => state.user);

  // Get today's date in AD and convert it to BS
  const todayAd = new Date();
  const formattedAd = todayAd.toISOString().split("T")[0];
  const formattedBs = ADToBS(formattedAd, "YYYY-MM-DD");
  const defaultSelectedDate = is_ad ? formattedAd : formattedBs;

  const [showAddModal, setShowAddModal] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(defaultSelectedDate);

  // Handle Date Change for both AD (input) and BS (NepaliDatePicker)
  const handleDateChange = (valueOrEvent) => {
    if (is_ad) {
      setSelectedDate(valueOrEvent.target.value); // For AD date input
    } else {
      setSelectedDate(valueOrEvent); // For BS NepaliDatePicker
    }
    setIsViewModalOpen(true);
  };

  const handleAddModal = () => setShowAddModal(true);
  const handleCancelModal = () => {
    setShowAddModal(false);
    setIsViewModalOpen(false);
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-purple-300 w-full max-w-4xl">
          <h1 className="text-4xl font-bold text-purple-800 mb-6">
            Class Attendance
          </h1>

          <div className="flex justify-between mb-6">
            <p className="text-gray-700 text-lg">
              Manage and track student attendance.
            </p>
            <button
              onClick={handleAddModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-800 transition duration-300"
            >
              Add Attendance
            </button>
          </div>

          {showAddModal && (
            <AddAttendanceModal
              handleCancelModal={handleCancelModal}
              selectedClassForAttendance={selectedClassForAttendance}
            />
          )}

          {/* Date Picker */}
          <div className="flex flex-col">
            <label className="text-xl font-semibold text-purple-800 mb-2">
              Select Attendance Date To View
            </label>
            {is_ad ? (
              <input
                type="date"
                id="attendance-date"
                value={selectedDate}
                onChange={handleDateChange}
                className="border-2 p-2 rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-purple-700 w-full max-w-xs text-center"
              />
            ) : (
              <div className="relative z-50">
                <NepaliDatePicker
                  value={selectedDate}
                  onChange={(value) => handleDateChange(value)}
                  inputClassName="p-2 border border-purple-300 rounded w-full"
                  dateFormat="YYYY-MM-DD"
                  language="ne"
                  placeholder="Select Date"
                  container={(triggerNode) => triggerNode.parentNode}
                  className="relative z-50"
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: 0,
                    width: "100%",
                    backgroundColor: "white",
                  }}
                />
              </div>
            )}
          </div>

          {isViewModalOpen && (
            <ViewAttendanceModal
              selectedClassForAttendance={selectedClassForAttendance}
              selectedDate={selectedDate}
            />
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Attendance;
