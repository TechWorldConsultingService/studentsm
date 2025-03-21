import React, { useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

const EditAttendanceModal = ({ onCancel, attendanceRecords, selectedClassForAttendance, selectedDate, fetchAttendanceRecords }) => {
  const { access } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [attendanceData, setAttendanceData] = useState(
    attendanceRecords.map((record) => ({
      id: record.student_id,
      full_name: record.full_name,
      roll_no: record.roll_no,
      status: record.status ? "Present" : "Absent",
    }))
  );

  const handleMarkAllPresent = () => {
    setAttendanceData((prevData) =>
      prevData.map((record) => ({ ...record, status: "Present" }))
    );
  };

  const handleMarkAllAbsent = () => {
    setAttendanceData((prevData) =>
      prevData.map((record) => ({ ...record, status: "Absent" }))
    );
  };

  const totalStudents = attendanceData.length;
  const presentCount = attendanceData.filter((s) => s.status === "Present").length;
  const absentCount = attendanceData.filter((s) => s.status === "Absent").length;

  const handleUpdateAttendance = async () => {
    if (!access) {
      toast.error("User is not authenticated.");
      return;
    }

    const payload = {
      attendance: attendanceData.map((record) => ({
        student: record.id,
        status: record.status === "Present",
      })),
    };

    try {
      setLoading(true);
      await axios.put(`http://localhost:8000/api/attendance/${selectedClassForAttendance}/${selectedDate}/`, payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      toast.success("Attendance updated successfully!");
      fetchAttendanceRecords()
      onCancel()
    } catch (error) {
      console.error("Failed to update attendance:", error);
      toast.error("Failed to update attendance. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
  <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 lg:w-2/3 max-h-full overflow-auto relative z-[10000]">
    <h2 className="text-3xl font-bold text-purple-800">Edit Attendance</h2>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="text-xl flex flex-col justify-self-center font-semibold text-gray-700">
            <p>Total Students: {totalStudents}</p>
            <p>Present: {presentCount}</p>
            <p>Absent: {absentCount}</p>
          </div>
          <div className="flex flex-col justify-self-center space-y-4">
            <button onClick={handleMarkAllPresent} className="bg-purple-700 text-white p-1.5 rounded-lg hover:bg-purple-800 shadow-lg">Mark All as Present</button>
            <button onClick={handleMarkAllAbsent} className="bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 shadow-lg">Mark All as Absent</button>
          </div>
        </div>

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
              {attendanceData.map((record) => (
                <tr key={record.id} className="border text-center hover:bg-purple-50">
                  <td className="p-3 border">{record.roll_no || "Null"}</td>
                  <td className="p-3 border">{record.full_name}</td>
                  <td className="p-3 border font-semibold">
                    <div className="relative w-28 h-12 flex items-center justify-center bg-gray-300 rounded-full shadow-lg">
                      <input
                        type="range"
                        min="0"
                        max="2"
                        step="1"
                        value={
                          record.status === "Absent"
                            ? 0
                            : record.status === "Present"
                            ? 2
                            : 1
                        }
                        onChange={(e) => {
                          const newStatus =
                            e.target.value === "0"
                              ? "Absent"
                              : e.target.value === "1"
                              ? "Not Done"
                              : "Present";
                          setAttendanceData((prev) =>
                            prev.map((rec) =>
                              rec.id === record.id
                                ? { ...rec, status: newStatus }
                                : rec
                            )
                          );
                        }}
                        className="absolute w-full h-full cursor-pointer appearance-none bg-gray-200 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-800"
                      />
                      <div
                        className={`absolute left-1 top-1 w-10 h-10 flex items-center justify-center text-white text-sm font-semibold rounded-full transition-all duration-300 transform scale-100 ${
                          record.status === "Absent"
                            ? "bg-red-600 translate-x-0"
                            : record.status === "Present"
                            ? "bg-purple-700 translate-x-full"
                            : "bg-gray-400 translate-x-1/2"
                        }`}
                      >
                        {record.status}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-center mt-6 space-x-5">
          <button className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600" onClick={onCancel}>Cancel</button>
          <button onClick={handleUpdateAttendance} className="bg-purple-800 text-white px-6 py-3 rounded-lg hover:bg-purple-900 shadow-lg">{loading ? "Updating..." : "Update Attendance"}</button>
        </div>
      </div>
    </div>
  );
};

export default EditAttendanceModal;