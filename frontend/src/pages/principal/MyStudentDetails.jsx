import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const MyStudentDetails = () => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [studentList, setStudentList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [classList, setClassList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all students
  const fetchAllStudents = async () => {
    if (!access) {
      setError("User is not authenticated. Please log in.");
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:8000/api/students/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setStudentList(data);
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/");
      } else {
        const errMsg = "Error fetching students: " + (err.message || err);
        setError(errMsg);
        toast.error(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch class-wise students
  const fetchClassWiseStudents = async () => {
    if (!access) {
      setError("User is not authenticated. Please log in.");
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/students/class/${selectedClassId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      setStudentList(data);
      setError(null);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate("/");
      } else {
        const errMsg = "Error fetching students: " + (err.message || err);
        setError(errMsg);
        toast.error(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!selectedClassId) {
      fetchAllStudents();
    } else {
      fetchClassWiseStudents();
    }
  }, [access, navigate, selectedClassId]);

  // Fetch classes for the filter dropdown
  const fetchClasses = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      const { data } = await axios.get("http://localhost:8000/api/classes/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setClassList(data);
    } catch (err) {
      toast.error("Error fetching classes: " + (err.message || err));
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [access, navigate]);

  // Search filtering (by first name and last name)
  const filteredStudents = studentList.filter((student) => {
    const fullName = `${student.user.first_name} ${student.user.last_name}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  // View student details
  const handleViewDetails = (studentInfo) => {
    setSelectedStudent(studentInfo);
  };

  const handleCloseDetails = () => {
    setSelectedStudent(null);
  };

  return (
    <MainLayout>
      <div className="bg-gray-100 p-6 min-h-screen">
        <div className="max-w-7xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
          <h1 className="text-3xl font-extrabold text-purple-800 mb-6">
            Students
          </h1>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 space-y-4 md:space-y-0">
            <div className="w-full md:w-1/3">
              <input
                type="text"
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
            </div>
            <div className="w-full md:w-1/3">
              <label
                htmlFor="selectClass"
                className="block text-lg font-semibold text-purple-700 mb-2"
              >
                Select Class:
              </label>
              <select
                name="selectClass"
                id="selectClass"
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="">All Classes</option>
                {classList.length > 0 &&
                  classList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.class_name}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-gray-600">Loading...</div>
          ) : error ? (
            <div className="mt-6 text-center text-red-600">{error}</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-purple-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">
                      Class
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">
                      Student Name
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">
                      Roll Number
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-medium text-white">
                      Details
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredStudents.length > 0 ? (
                    filteredStudents.map((student) => (
                      <tr
                        key={student.id}
                        className="hover:bg-purple-50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {student.class_details?.class_name || "N/A"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {student.user.first_name} {student.user.last_name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {student.roll_no || "N/A"}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleViewDetails(student)}
                            className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition-colors"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="px-6 py-4 text-center text-gray-600"
                      >
                        No students found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Student Details Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold text-purple-800 mb-4">
                Student Details
              </h2>
              <div className="space-y-2 text-gray-700">
                <p>
                  <strong>Username:</strong> {selectedStudent.user.username}
                </p>
                <p>
                  <strong>Name:</strong>{" "}
                  {selectedStudent.user.first_name}{" "}
                  {selectedStudent.user.last_name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedStudent.user.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedStudent.phone}
                </p>
                <p>
                  <strong>Role:</strong> {selectedStudent.user.role}
                </p>
                <p>
                  <strong>Address:</strong> {selectedStudent.address}
                </p>
                <p>
                  <strong>Date of Birth:</strong>{" "}
                  {selectedStudent.date_of_birth}
                </p>
                <p>
                  <strong>Parent's Name:</strong> {selectedStudent.parents}
                </p>
                <p>
                  <strong>Gender:</strong> {selectedStudent.gender}
                </p>
                <p>
                  <strong>Class:</strong>{" "}
                  {selectedStudent.class_details?.class_name || "N/A"}
                </p>
                <p>
                  <strong>Roll Number:</strong> {selectedStudent.roll_no || "N/A"}
                </p>
                <p>
                  <strong>Optional Subjects:</strong>{" "}
                  {selectedStudent.optional_subjects &&
                  selectedStudent.optional_subjects.length > 0
                    ? selectedStudent.optional_subjects
                        .map((sub) => sub.subject_name)
                        .join(", ")
                    : "N/A"}
                </p>
                <p>
                  <strong>Class Section:</strong>{" "}
                  {selectedStudent.class_code_section || "N/A"}
                </p>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={handleCloseDetails}
                  className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MyStudentDetails;
