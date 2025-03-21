import React, { useEffect, useState, useCallback } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddAttendanceModal = ({
  handleCancelModal,
  selectedClassForAttendance,
}) => {
  const navigate = useNavigate();
  const { access } = useSelector((state) => state.user);
  const [attendanceData, setAttendanceData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorAddingAttendance, setErrorAddingAttendance] = useState("")

  // Fetch students for attendance
  const fetchStudentForAttendance = useCallback(async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/attendance/student/${selectedClassForAttendance}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      // Add default status to each student
      const updatedData = data.map((student) => ({
        ...student,
        status: "Not Done",
      }));

      setAttendanceData(updatedData);
    } catch (error) {
      console.error("Error fetching students:", error);
      if (error.response?.status === 401) {
        navigate("/");
      } else {
        toast.error("Error fetching students. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [access, navigate, selectedClassForAttendance]);

  useEffect(() => {
    fetchStudentForAttendance();
  }, [fetchStudentForAttendance]);

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

  const handleMarkAllDefault = () => {
    setAttendanceData((prevData) =>
      prevData.map((record) => ({ ...record, status: "Not Done" }))
    );
  };

  // Submit Attendance Data to API
  const handleSubmitAttendance = async () => {
    if (!access) {
      toast.error("User is not authenticated.");
      return;
    }

    const payload = {
      attendance: attendanceData
        .filter((record) => record.status !== "Not Done")
        .map((record) => ({
          student: record.id,
          status: record.status === "Present",
        })),
    };

    if (payload.attendance.length === 0) {
      toast.error("No attendance data to submit.");
      return;
    }

    try {
      setLoading(true);
      await axios.post("http://localhost:8000/api/attendance/", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });

      toast.success("Attendance submitted successfully!");
      handleCancelModal()
    } catch (error) {
      setErrorAddingAttendance(error)
    } finally {
      setLoading(false);
    }
  };

  const totalStudents = attendanceData.length;
  const presentCount = attendanceData.filter(
    (s) => s.status === "Present"
  ).length;
  const absentCount = attendanceData.filter(
    (s) => s.status === "Absent"
  ).length;

  return (
<div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
  <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 lg:w-2/3 max-h-full overflow-auto relative z-[10000]">
    <h2 className="text-3xl font-bold text-purple-800">Add Attendance</h2>

        <div className="grid grid-cols-2 gap-4 mt-16">
          {/* Attendance Summary */}
          <div className="mt-4 space-y-2  text-xl font-semibold text-gray-700 flex flex-col justify-self-center">
            <p>
              Total Students: <span className="">{totalStudents}</span>
            </p>
            <p>
              Present: <span className="">{presentCount}</span>
            </p>
            <p>
              Absent: <span className="">{absentCount}</span>
            </p>
          </div>

          <div className="flex flex-col  space-y-4 justify-self-center">
            <button
              onClick={handleMarkAllPresent}
              className=" bg-purple-700 text-white p-1.5 rounded-lg hover:bg-purple-800 shadow-lg "
            >
              Mark All as Present
            </button>
            <button
              onClick={handleMarkAllAbsent}
              className=" bg-red-600 text-white p-1.5 rounded-lg hover:bg-red-700 shadow-lg "
            >
              Mark All as Absent
            </button>
            <button
              onClick={handleMarkAllDefault}
              className=" bg-gray-600 text-white p-1.5 rounded-lg hover:bg-gray-700 shadow-lg "
            >
              Reset to Default
            </button>
          </div>
        </div>

        <div className="mt-8 overflow-x-auto">
          <table className="w-full border-collapse border border-purple-300">
            <thead>
              <tr className="bg-purple-800 text-white">
                <th className="p-3 border">Class</th>
                <th className="p-3 border">Roll No</th>
                <th className="p-3 border">Student Name</th>
                <th className="p-3 border">Status</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record) => (
                <tr
                  key={record.id}
                  className="border text-center hover:bg-purple-50"
                >
                  <td className="p-3 border">
                    {record.class_details.class_name}
                  </td>
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
{
  errorAddingAttendance && (
    <span className=" text-red-500">{errorAddingAttendance?.response?.data?.detail || "Error taking attendance. Please try again !"} </span>
  )
}

        <div className="flex justify-center mt-6 space-x-5">
          <button
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            onClick={handleCancelModal}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmitAttendance}
            className="bg-purple-800 text-white px-6 py-3 rounded-lg hover:bg-purple-900 shadow-lg"
          >
            {loading ? "Submitting..." : "Submit Attendance"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddAttendanceModal;
