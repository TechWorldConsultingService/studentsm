import React, { useState } from "react";
import MainLayout from "../../layout/MainLayout";
import AddAttendanceModal from "./AddAttendanceModal";
import ViewAttendanceModal from "./ViewAttendanceModal";

const Attendance = ({ selectedClassForAttendance }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
    setIsViewModalOpen(true);
  };

  const handleAddModal = () => setShowAddModal(true);
  const handleCancelModal = () => {
    setShowAddModal(false);
    setIsViewModalOpen(false);
  };



  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-purple-50 to-purple-100  flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-purple-300 w-full max-w-4xl">
          <h1 className="text-4xl font-bold text-purple-800  mb-6">
            Class Attendance
          </h1>

          <div className="flex justify-between mb-6">
            <p className="text-gray-700 text-lg">Manage and track student attendance.</p>
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
          <div className=" flex flex-col ">
            <label  className="text-xl font-semibold text-purple-800 mb-2">
              Select Attendance Date To View
            </label>
            <input
              type="date"
              id="attendance-date"
              value={selectedDate}
              onChange={handleDateChange}
              className="border-2 p-2 rounded-lg shadow-sm text-gray-700 focus:ring-2 focus:ring-purple-700 w-full max-w-xs text-center"
            />
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
