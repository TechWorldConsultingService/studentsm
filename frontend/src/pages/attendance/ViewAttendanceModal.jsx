import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import EditAttendanceModal from "./EditAttendanceModal";


const ViewAttendance = ({ selectedDate, selectedClassForAttendance }) => {
  const { access } = useSelector((state) => state.user);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [loading, setLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
  

  // Fetch attendance data based on class and date
  const fetchAttendanceRecords = useCallback(async () => {
    if (!access) {
      toast.error("User is not authenticated.");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/attendance/${selectedClassForAttendance}/${selectedDate}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      setAttendanceRecords(data);
    } catch (error) {
      console.error("Error fetching attendance records:", error);
      toast.error("Failed to fetch attendance records.");
    } finally {
      setLoading(false);
    }
  }, [access, selectedClassForAttendance, selectedDate]);

  useEffect(() => {
    fetchAttendanceRecords();
  }, [fetchAttendanceRecords]);

  // Attendance summary
  const totalStudents = attendanceRecords?.attendance?.length;
  const presentCount = attendanceRecords?.attendance?.filter((record) => record.status).length;
  const absentCount = totalStudents - presentCount;

  const handleEditModal = () => {
    setShowEditModal(true)
  }

  return (
      <div className="bg-gray-100 ">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl">
        <button 
              onClick={handleEditModal}
               className="flex justify-self-end bg-purple-700 text-white px-6 py-2 rounded-lg shadow-md hover:bg-purple-800 transition duration-300"
              >
                 Edit Attendance </button>

          {/* Attendance Summary */}
          {attendanceRecords?.attendance?.length > 0 && (
            <div className="mt-6 p-4 bg-purple-100 rounded-lg">
              <h2 className="text-lg font-semibold text-purple-800">Attendance Summary</h2>
              <p className="text-gray-700 mt-2">
                Date: <span className="font-semibold">{attendanceRecords?.date}</span>
              </p>
              <p className="text-gray-700 mt-2">
                Class: <span className="font-semibold">{attendanceRecords?.class?.name}</span>
              </p>
              <p className="text-gray-700 mt-2">
                Total Students: <span className="font-semibold">{totalStudents}</span>
              </p>
              <p className="text-green-600">
                Present: <span className="font-semibold">{presentCount}</span>
              </p>
              <p className="text-red-600">
                Absent: <span className="font-semibold">{absentCount}</span>
              </p>
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
                    <td colSpan="4" className="p-3 text-center text-gray-600">Loading...</td>
                  </tr>
                ) : attendanceRecords.length === 0 ? (
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
                      <td className={`p-3 border font-semibold ${record.status ? "text-green-600" : "text-red-600"}`}>
                        {record.status ? "Present" : "Absent"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {
            showEditModal && (
              <EditAttendanceModal 
              selectedClassForAttendance={selectedClassForAttendance}
              selectedDate={selectedDate}
              onCancel = {() => setShowEditModal(false)}
              attendanceRecords = {attendanceRecords.attendance}
              fetchAttendanceRecords = {fetchAttendanceRecords}
              />
            )
          }

        </div>
      </div>
  );
};

export default ViewAttendance;
