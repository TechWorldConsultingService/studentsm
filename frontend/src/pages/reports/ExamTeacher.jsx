import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ExamTeacher = () => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [classList, setClassList] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [marks, setMarks] = useState({});
  const [viewMode, setViewMode] = useState(true); // Toggle between "View" and "Add" mode

  useEffect(() => {
    const fetchExams = async () => {
      if (!access) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      try {
        const { data } = await axios.get("http://localhost:8000/api/exams/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
        setExams(data);
      } catch (error) {
        toast.error("Error fetching exams.");
      }
    };

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
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/");
        } else {
          toast.error("Error fetching classes:", error.message || error);
        }
      }
    };

    fetchExams();
    fetchClasses();
  }, [access]);

  const subjects = {
    1: {
      1: [
        {
          id: 1,
          name: "Algebra",
          theoryFullMarks: 100,
          practicalFullMarks: 50,
          theoryPassMarks: 35,
          practicalPassMarks: 20,
        },
        {
          id: 2,
          name: "Geometry",
          theoryFullMarks: 100,
          practicalFullMarks: 50,
          theoryPassMarks: 35,
          practicalPassMarks: 20,
        },
      ],
      2: [
        {
          id: 1,
          name: "Physics",
          theoryFullMarks: 100,
          practicalFullMarks: 50,
          theoryPassMarks: 35,
          practicalPassMarks: 20,
        },
        {
          id: 2,
          name: "Chemistry",
          theoryFullMarks: 100,
          practicalFullMarks: 50,
          theoryPassMarks: 35,
          practicalPassMarks: 20,
        },
      ],
    },
    2: {
      1: [
        {
          id: 1,
          name: "Literature",
          theoryFullMarks: 100,
          practicalFullMarks: 50,
          theoryPassMarks: 35,
          practicalPassMarks: 20,
        },
        {
          id: 2,
          name: "Grammar",
          theoryFullMarks: 100,
          practicalFullMarks: 50,
          theoryPassMarks: 35,
          practicalPassMarks: 20,
        },
      ],
    },
  };

  const students = [
    { id: 1, name: "Akash Singh" },
    { id: 2, name: "Tilak Don" },
    { id: 3, name: "Shujan Bhusal" },
  ];

  // Handle exam selection
  const handleExamSelect = (examId) => {
    setSelectedExam(examId);
    setSelectedClass(null); // Reset class and subject selections
    setSelectedSubject(null);
    setMarks({}); // Reset marks
  };

  // Handle class selection
  const handleClassSelect = (classId) => {
    setSelectedClass(classId);
    setSelectedSubject(null); // Reset subject selection
    setMarks({}); // Reset marks
  };

  // Handle subject selection
  const handleSubjectSelect = (subjectId) => {
    setSelectedSubject(subjectId);
    setMarks({}); // Reset marks
  };

  // Handle saving marks automatically when input is changed
  const handleSaveMarks = (studentId, theoryMarks, practicalMarks) => {
    setMarks((prevMarks) => ({
      ...prevMarks,
      [studentId]: { theory: theoryMarks, practical: practicalMarks },
    }));
  };

  // Handle editing marks
  const handleEditMarks = (studentId, newTheoryMarks, newPracticalMarks) => {
    setMarks((prevMarks) => ({
      ...prevMarks,
      [studentId]: { theory: newTheoryMarks, practical: newPracticalMarks },
    }));
  };

  // Handle deleting marks (clear marks)
  const handleDeleteMarks = (studentId) => {
    setMarks((prevMarks) => {
      const newMarks = { ...prevMarks };
      delete newMarks[studentId]; // Remove marks for the student
      return newMarks;
    });
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">
            Exam Management
          </h1>
          <p className="mt-4 text-gray-600">
            Manage exams, classes, subjects, and student marks here.
          </p>

          {/* Exam Selection */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">
              Select Exam
            </h2>
            <select
              className="mt-2 bg-white border border-purple-300 rounded-lg px-6 py-3 w-full shadow-sm focus:ring-2 focus:ring-purple-300"
              onChange={(e) => handleExamSelect(e.target.value)}
              value={selectedExam || ""}
            >
              <option value="">Select Exam</option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Selection */}
          {selectedExam && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-purple-700">
                Select Class
              </h2>
              <select
                className="mt-2 bg-white border border-purple-300 rounded-lg px-6 py-3 w-full shadow-sm focus:ring-2 focus:ring-purple-300"
                onChange={(e) => handleClassSelect(e.target.value)}
                value={selectedClass || ""}
              >
                <option value="">Select Class</option>
                {classList.map((classItem) => (
                  <option key={classItem.id} value={classItem.id}>
                    {classItem.class_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Subject Selection */}
          {selectedClass && selectedExam && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-purple-700">
                Select Subject
              </h2>
              <select
                className="mt-2 bg-white border border-purple-300 rounded-lg px-6 py-3 w-full shadow-sm focus:ring-2 focus:ring-purple-300"
                onChange={(e) => handleSubjectSelect(e.target.value)}
                value={selectedSubject || ""}
              >
                <option value="">Select Subject</option>
                {subjects[selectedExam]?.[selectedClass]?.map((subject) => (
                  <option key={subject.id} value={subject.id}>
                    {subject.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Toggle between View and Add Marks */}
          {selectedExam && selectedClass && selectedSubject && (
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={() => setViewMode(true)}
                className={`${
                  viewMode
                    ? "bg-purple-700 text-white"
                    : "bg-white text-purple-700 border"
                } px-6 py-3 rounded-lg shadow-md w-full max-w-xs text-center`}
              >
                View Marks
              </button>
              <button
                onClick={() => setViewMode(false)}
                className={`${
                  !viewMode
                    ? "bg-purple-700 text-white"
                    : "bg-white text-purple-700 border"
                } px-6 py-3 rounded-lg shadow-md w-full max-w-xs text-center`}
              >
                Add Marks
              </button>
            </div>
          )}

          {/* Add Marks Section */}
          {!viewMode && selectedExam && selectedClass && selectedSubject && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-purple-700">
                Add Marks for{" "}
                {
                  subjects[selectedExam]?.[selectedClass]?.find(
                    (subject) => subject.id === parseInt(selectedSubject)
                  )?.name
                }
              </h2>
              <p className="text-gray-600 mt-2">
                Full Marks for Theory:{" "}
                {
                  subjects[selectedExam]?.[selectedClass]?.find(
                    (subject) => subject.id === parseInt(selectedSubject)
                  )?.theoryFullMarks
                }{" "}
                | Full Marks for Practical:{" "}
                {
                  subjects[selectedExam]?.[selectedClass]?.find(
                    (subject) => subject.id === parseInt(selectedSubject)
                  )?.practicalFullMarks
                }
              </p>
              <table className="min-w-full mt-6 table-auto">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-6 py-3 text-left">Student Name</th>
                    <th className="px-6 py-3 text-left">Theory Marks</th>
                    <th className="px-6 py-3 text-left">Practical Marks</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b hover:bg-purple-50"
                    >
                      <td className="px-6 py-4">{student.name}</td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={marks[student.id]?.theory || ""}
                          onChange={(e) =>
                            handleSaveMarks(
                              student.id,
                              e.target.value,
                              marks[student.id]?.practical || ""
                            )
                          }
                          className="border border-purple-300 rounded-lg px-4 py-2 w-full shadow-sm focus:ring-2 focus:ring-purple-300"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          value={marks[student.id]?.practical || ""}
                          onChange={(e) =>
                            handleSaveMarks(
                              student.id,
                              marks[student.id]?.theory || "",
                              e.target.value
                            )
                          }
                          className="border border-purple-300 rounded-lg px-4 py-2 w-full shadow-sm focus:ring-2 focus:ring-purple-300"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* View Marks Section */}
          {viewMode && selectedExam && selectedClass && selectedSubject && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-purple-700">
                View Marks for{" "}
                {
                  subjects[selectedExam]?.[selectedClass]?.find(
                    (subject) => subject.id === parseInt(selectedSubject)
                  )?.name
                }
              </h2>
              <p className="text-gray-600 mt-2">
                Full Marks for Theory:{" "}
                {
                  subjects[selectedExam]?.[selectedClass]?.find(
                    (subject) => subject.id === parseInt(selectedSubject)
                  )?.theoryFullMarks
                }{" "}
                | Full Marks for Practical:{" "}
                {
                  subjects[selectedExam]?.[selectedClass]?.find(
                    (subject) => subject.id === parseInt(selectedSubject)
                  )?.practicalFullMarks
                }
              </p>
              <table className="min-w-full mt-6 table-auto">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-6 py-3 text-left">Student Name</th>
                    <th className="px-6 py-3 text-left">Theory Marks</th>
                    <th className="px-6 py-3 text-left">Practical Marks</th>
                    <th className="px-6 py-3 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b hover:bg-purple-50"
                    >
                      <td className="px-6 py-4">{student.name}</td>
                      <td className="px-6 py-4">
                        {marks[student.id]?.theory || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {marks[student.id]?.practical || "-"}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEditMarks(student.id, 90, 40)}
                          className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteMarks(student.id)}
                          className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 ml-2"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ExamTeacher;
