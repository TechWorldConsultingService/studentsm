import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import MainLayout from "../../layout/MainLayout";
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import {ADToBS} from 'bikram-sambat-js';


const AttendancePrincipal = () => {
  const { access, is_ad } = useSelector((state) => state.user);
  const [classes, setClasses] = useState([]);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const todayAd = new Date();
    const formattedAd = todayAd.toISOString().split('T')[0];
   const formattedBs = ADToBS(formattedAd, "YYYY-MM-DD");
   const defaultAttendanceDate = is_ad ? formattedAd : formattedBs;

  // Fetch available classes
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/classes/", {
          headers: { Authorization: `Bearer ${access}` },
        });
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
        toast.error("Failed to fetch classes.");
      }
    };

    if (access) fetchClasses();
  }, [access]);

  // Fetch attendance records
  const fetchAttendanceRecords = useCallback(async () => {
    if (!access || !selectedClass || !selectedDate) return;
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/attendance/${selectedClass}/${selectedDate}/`,
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );
      setAttendanceRecords(data);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      toast.error("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  }, [access, selectedClass, selectedDate]);

  useEffect(() => {
    if (selectedClass && selectedDate) fetchAttendanceRecords();
  }, [selectedClass, selectedDate, fetchAttendanceRecords]);

  const handleDeleteClick = () => {
    if (!selectedClass || !selectedDate) {
      toast.error("Please select a class and date first.");
      return;
    }
    setShowConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    setShowConfirmDialog(false);
    try {
      await axios.delete(`http://localhost:8000/api/attendance/${selectedClass}/${selectedDate}/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      toast.success("Attendance records deleted successfully.");
      setAttendanceRecords([]);
    } catch (error) {
      console.error("Error deleting attendance records:", error);
      toast.error("Failed to delete attendance records.");
    }
  };

  // Attendance summary
  const totalStudents = attendanceRecords?.attendance?.length;
  const presentCount = attendanceRecords?.attendance?.filter((record) => record.status).length;
  const absentCount = totalStudents - presentCount;

  return (
    <MainLayout>
      <div className="bg-gray-100 p-6 min-h-screen flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
          <h1 className="text-3xl font-semibold text-purple-700 text-center">View Attendance</h1>
          <p className="text-gray-600 text-center mt-2">
            Select class and date to view attendance.
          </p>

          {/* Class Selector */}
          <div className="mt-4">
            <label className="block text-gray-700 text-lg font-medium">Select Class</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="mt-2 w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Choose a Class</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="mt-4">
            <label className="block text-gray-700 text-lg font-medium">
              Select Date {is_ad ? "(AD)" : "(BS)"}
            </label>
            {is_ad ? (
              <input
                type="date"
                value={selectedDate || defaultAttendanceDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="mt-2 w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
              />
            ) : (
              <NepaliDatePicker
                value={selectedDate || defaultAttendanceDate}
                onChange={(date) => setSelectedDate(date)}
                inputClassName="mt-2 w-full border border-gray-300 p-2 rounded-md focus:ring-2 focus:ring-purple-500"
                dateFormat="YYYY/MM/DD"
                language="ne"
              />
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <button
              onClick={fetchAttendanceRecords}
              className={`px-5 py-2 rounded-lg transition ${
                selectedClass && selectedDate
                  ? "bg-purple-600 text-white hover:bg-purple-700"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
              disabled={!selectedClass || !selectedDate}
            >
              View Attendance
            </button>

            <button
              onClick={handleDeleteClick}
              className={`px-5 py-2 rounded-lg transition ${
                selectedClass && selectedDate
                  ? "bg-red-500 text-white hover:bg-red-600"
                  : "bg-gray-300 text-gray-600 cursor-not-allowed"
              }`}
              disabled={!selectedClass || !selectedDate}
            >
              Delete Attendance
            </button>
          </div>

          {/* Attendance Summary */}
          {attendanceRecords?.attendance?.length > 0 && (
            <div className="mt-6 p-4 bg-purple-100 rounded-lg">
              <h2 className="text-lg font-semibold text-purple-800">Attendance Summary</h2>
              <p className="text-gray-700 mt-2">
                Date: <span className="font-semibold">{attendanceRecords.date}</span>
              </p>
              <p className="text-gray-700 mt-2">
                Class: <span className="font-semibold">{attendanceRecords?.class?.name}</span>
              </p>
              <p className="text-gray-700 mt-2">
                Total Students: <span className="font-semibold">{totalStudents}</span>
              </p>
              <p className="text-purple-700">
                Present: <span className="font-semibold">{presentCount}</span>
              </p>
              <p className="text-red-600">
                Absent: <span className="font-semibold">{absentCount}</span>
              </p>
            </div>
          )}

          {/* Confirmation Dialog */}
          {showConfirmDialog && (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75 z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/3">
                <h2 className="text-xl font-bold text-red-700">Confirm Deletion</h2>
                <p className="mt-3 text-gray-700">
                  Are you sure you want to delete all attendance records for{" "}
                  <strong>Class {selectedClass}</strong> on{" "}
                  <strong>{selectedDate}</strong>? This action cannot be undone.
                </p>
                <div className="mt-6 flex justify-end space-x-4">
                  <button
                    onClick={() => setShowConfirmDialog(false)}
                    className="bg-gray-500 text-white px-4 py-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Attendance Table */}
          <div className="mt-8 overflow-x-auto">
            <table className="w-full border-collapse border border-purple-300">
              <thead>
                <tr className="bg-purple-800 text-white">
                  <th className="p-3 border">Roll No</th>
                  <th className="p-3 border">Student Name</th>
                  <th className="p-3 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-3 text-center text-gray-600">
                      Loading...
                    </td>
                  </tr>
                ) : attendanceRecords?.attendance?.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-3 text-center text-gray-600">
                      No attendance data available.
                    </td>
                  </tr>
                ) : (
                  attendanceRecords?.attendance?.map((record) => (
                    <tr key={record.id} className="border text-center hover:bg-purple-50">
                      <td className="p-3 border">{record.roll_no || "Null"}</td>
                      <td className="p-3 border">{record.full_name}</td>
                      <td className={`p-3 border font-semibold ${record.status ? "text-purple-700" : "text-red-600"}`}>
                        {record.status ? "Present" : "Absent"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AttendancePrincipal;
