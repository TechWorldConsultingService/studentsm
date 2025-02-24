import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

const SelectStudent = ({
  setErrorMessage,
  selectedClassId,
  setSelectedClassId,
  selectedStudentId,
  setSelectedStudentId,
}) => {
  const { access } = useSelector((state) => state.user);
  const [classes, setClasses] = useState([]);
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchClasses = async () => {
      if (!access) {
        toast.error("Not authenticated. Please log in.");
        return;
      }
      try {
        const { data } = await axios.get("http://localhost:8000/api/classes/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
        setClasses(data);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          error?.response?.data?.detail ||
          "An unexpected error occurred while fetching classes. Please try again."
        );
      }
    };

    fetchClasses();
  }, [access, setErrorMessage]);

  useEffect(() => {
    if (!selectedClassId) {
      setStudents([]);
      return;
    }

    const fetchStudents = async () => {
      if (!access) return;
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/attendance/student/${selectedClassId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setStudents(data);
      } catch (error) {
        console.error(error);
        setErrorMessage(
          error?.response?.data?.detail ||
          "An unexpected error occurred while fetching students. Please try again."
        );
      }
    };

    fetchStudents();
    setSelectedStudentId("");
  }, [selectedClassId, access, setErrorMessage, setSelectedStudentId]);

  const filteredStudents = students.filter((student) => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    const nameMatch = student.full_name?.toLowerCase().includes(lowerCaseSearch);
    const rollMatch = student.roll_number?.toString().includes(searchTerm);
    return nameMatch || rollMatch;
  });

  const handleClassChange = (e) => {
    setSelectedClassId(e.target.value);
    setErrorMessage("");
  };

  const handleStudentSelect = (studentId) => {
    setSelectedStudentId(studentId);
    setErrorMessage("");
  };

  return (
      <div className="bg-purple-50 p-6 h-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800 mb-4">Select Student</h1>

          {/* Class Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="class-select">
              Select Class:
            </label>
            <select
              id="class-select"
              className="border border-gray-300 p-2 rounded w-full md:w-1/2"
              value={selectedClassId}
              onChange={handleClassChange}
            >
              <option value="">-- Select Class --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name} ({cls.class_code})
                </option>
              ))}
            </select>
          </div>

          {/* Student Search */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1" htmlFor="student-search">
              Search Student:
            </label>
            <input
              id="student-search"
              type="text"
              className="border border-gray-300 p-2 rounded w-full md:w-1/2"
              placeholder="Search by name or roll number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Student Table */}
          <div>
            <h2 className="text-xl font-semibold text-purple-700 mb-2">Students</h2>
            {filteredStudents.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-purple-700 text-white">
                      <th className="px-4 py-2">Select</th>
                      <th className="px-4 py-2">Student Name</th>
                      <th className="px-4 py-2">Class</th>
                      <th className="px-4 py-2">Roll Number</th>
                      <th className="px-4 py-2">Parent's Name</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((student) => (
                      <tr key={student.id} className="border-b hover:bg-purple-50">
                        <td className="px-4 py-2 text-center">
                          <input
                            type="radio"
                            name="selectedStudent"
                            id={`student-${student.id}`}
                            value={student.id}
                            checked={selectedStudentId === String(student.id)}
                            onChange={() => handleStudentSelect(String(student.id))}
                          />
                        </td>
                        <td className="px-4 py-2">
                          <label htmlFor={`student-${student.id}`}>{student.full_name}</label>
                        </td>
                        <td className="px-4 py-2">
                          {student.class_details?.class_name || "N/A"} (
                          {student.class_details?.class_code || "N/A"})
                        </td>
                        <td className="px-4 py-2">{student.roll_no}</td>
                        <td className="px-4 py-2">{student.parent_name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">
                {selectedClassId
                  ? "No students found for the selected class or search term."
                  : "Please select a class to view students."}
              </p>
            )}
          </div>
        </div>
      </div>
  );
};

export default SelectStudent;
