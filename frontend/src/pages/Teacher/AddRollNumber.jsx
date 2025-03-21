import React, { useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import MainLayout from "../../layout/MainLayout";

const AddRollNumber = () => {
  const { access, classes } = useSelector((state) => state.user);
  const [selectedClass, setSelectedClass] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchStudents = useCallback(async () => {
    if (!selectedClass) return;

    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/attendance/student/${selectedClass}`,
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );
      setStudents(data);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students.");
    } finally {
      setLoading(false);
    }
  }, [selectedClass, access]);

  useEffect(() => {
    if (selectedClass) fetchStudents();
  }, [selectedClass, fetchStudents]);

  const handleRollNumberChange = (id, newRollNo) => {
    setStudents((prev) =>
      prev.map((student) =>
        student.id === id ? { ...student, roll_no: newRollNo } : student
      )
    );
  };

  const handleSubmit = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/students/update-roll-numbers/${selectedClass}/`,
        {
          students: students.map(({ id, roll_no }) => ({ id, roll_no })),
        },
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );
      toast.success("Roll numbers updated successfully.");
    } catch (error) {
      console.error("Error updating roll numbers:", error);
      toast.error("Failed to update roll numbers.");
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gradient-to-r from-purple-100 via-purple-50 to-purple-100 flex items-center justify-center p-4">
        {/* Main card container */}
        <div className="bg-white w-full max-w-5xl p-8 rounded-2xl shadow-xl">
          <h1 className="text-3xl font-bold text-purple-700 text-center">
            Assign Roll Numbers
          </h1>
          <p className="text-gray-600 text-center mt-1 mb-6">
            Select a class and update student roll numbers.
          </p>

          {/* Class Selector */}
          <div className="mb-6">
            <label
              htmlFor="classSelector"
              className="block text-gray-700 font-medium text-lg mb-2"
            >
              Select Class
            </label>
            <select
              id="classSelector"
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2 transition-colors focus:outline-none focus:border-purple-500"
            >
              <option value="">-- Choose a Class --</option>
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.class_name}
                </option>
              ))}
            </select>
          </div>

          {/* Students Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
              <thead>
                <tr className="bg-purple-600 text-white">
                  <th className="p-3 text-left">S.N.</th>
                  <th className="p-3 text-left">Student Name</th>
                  <th className="p-3 text-left">Class</th>
                  <th className="p-3 text-left">Roll No</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan="4" className="p-3 text-center text-gray-600">
                      Loading...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="p-3 text-center text-gray-600">
                      No students available.
                    </td>
                  </tr>
                ) : (
                  students.map((student, index) => (
                    <tr
                      key={student.id}
                      className="border-b last:border-b-0 hover:bg-purple-50 transition-colors"
                    >
                      <td className="p-3">{index + 1}</td>
                      <td className="p-3">{student.full_name}</td>
                      <td className="p-3">
                        {student.class_details.class_name}
                      </td>
                      <td className="p-3">
                        <input
                          type="number"
                          value={student.roll_no || ""}
                          onChange={(e) =>
                            handleRollNumberChange(student.id, e.target.value)
                          }
                          className="w-20 border border-gray-300 rounded-md p-1 focus:outline-none focus:border-purple-500 transition-colors"
                          placeholder="Roll No"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              onClick={handleSubmit}
              className="bg-purple-600 text-white px-6 py-2 rounded-md font-semibold shadow hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Update Roll Numbers
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AddRollNumber;
