import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ExamTeacher = () => {
  const { access, id: teacherId } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [exams, setExams] = useState([]);
  const [subjectDetails, setSubjectDetails] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [marks, setMarks] = useState({});
  const [viewMode, setViewMode] = useState(true);
  const [studentList, setStudentList] = useState([]);
  const [subjectWiseExamResult, setSubjectWiseExamResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExamDetailsId, setSelectedExamDetailsId] = useState(null);

  // Fetch exams when the component mounts
  useEffect(() => {
    const fetchExams = async () => {
      if (!access) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      try {
        setLoading(true);
        const { data } = await axios.get("http://localhost:8000/api/exams/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
        setExams(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching exams.");
      }
    };
    fetchExams();
  }, [access]);

  // Fetch subject details based on selected exam
  useEffect(() => {
    if (selectedExam === null) return;

    const fetchSubjectDetails = async () => {
      if (!access) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:8000/api/exam-details/${selectedExam}/${teacherId}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setSubjectDetails(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching subject details.");
      }
    };
    fetchSubjectDetails();
  }, [access, selectedExam]);

  // Fetch student list based on selected exam and subject
  useEffect(() => {
    if (selectedExam === null || selectedSubject === null) return;

    const fetchStudentList = async () => {
      if (!access) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:8000/api/students-by-subject/?subject_id=${selectedSubject}`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setStudentList(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching student list.");
      }
    };
    fetchStudentList();
  }, [access, selectedExam, selectedSubject]);

  // Fetch subject-wise exam results
  const fetchSubjectWiseExamResult = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/api/results/${selectedExam}/${selectedSubject}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      setSubjectWiseExamResult(data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      toast.error("Error fetching subject-wise exam results.");
    }
  };

  useEffect(() => {
    if (selectedExam === null || selectedSubject === null) return;
    fetchSubjectWiseExamResult();
  }, [access, selectedExam, selectedSubject]);

  // Save marks for a student
  const handleSaveMarks = async (studentId, theoryMarks, practicalMarks) => {
    if (theoryMarks < 0 || practicalMarks < 0) {
      toast.error("Marks cannot be negative");
      return;
    }

    try {
      const payload = {
        student: studentId,
        exam_detail: selectedExamDetailsId,
        practical_marks: practicalMarks,
        theory_marks: theoryMarks,
      };

      await axios.post("http://localhost:8000/api/results/", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      fetchSubjectWiseExamResult();
      toast.success("Marks saved successfully.");
    } catch (error) {
      toast.error("Error saving marks.");
    }
  };

  // Delete marks for a student
  const handleDeleteMarks = async (resultId) => {
    if (!resultId) {
      console.log(resultId, "result id");
      toast.error("This field is already blank.");
      return;
    }
    try {
      await axios.delete(`http://localhost:8000/api/results/${resultId}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      fetchSubjectWiseExamResult();
      toast.success("Marks deleted successfully.");
    } catch (error) {
      toast.error("Error deleting marks.");
    }
  };

  // Handle the selection of exam and subject
  const handleExamSelect = (examId) => {
    setSelectedExam(examId);
    setSelectedSubject(null);
    setSubjectDetails([]);
    setMarks({});
  };

  const handleSubjectSelect = (subjectString) => {
    const subject = JSON.parse(subjectString);
    setSelectedSubject(subject.subject_details.id);
    setSelectedExamDetailsId(subject.exam_details.id);
    setMarks({});
  };
  

  // Handle toggle between View and Edit modes
  const toggleViewMode = () => {
    setViewMode((prevMode) => !prevMode);
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">
            Exam Management
          </h1>
          <p className="mt-4 text-gray-600">
            Manage exams, subjects, and student marks here.
          </p>

          {/* Loading State */}
          {loading && (
            <div className="text-center text-purple-600">Loading...</div>
          )}

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

          {/* Subject Selection */}
          {selectedExam && (
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
                {subjectDetails.length > 0 &&
                  subjectDetails.map((item, index) =>
                    item.subject_details &&
                    item.subject_details.subject_name ? (
                      <option key={index} value={JSON.stringify(item)}>
                        {item.subject_details.subject_name}
                      </option>
                    ) : null
                  )}
              </select>
            </div>
          )}

          {/* Marks View or Add Toggle */}
          {selectedExam && selectedSubject && (
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={toggleViewMode}
                className={`${
                  viewMode
                    ? "bg-purple-700 text-white"
                    : "bg-white text-purple-700 border"
                } px-6 py-3 rounded-lg shadow-md w-full max-w-xs text-center`}
              >
                {viewMode ? "Edit Marks" : "View Marks"}
              </button>
            </div>
          )}

          {/* View Marks Section */}
          {viewMode && selectedExam && selectedSubject && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-purple-700">
                View Marks
              </h2>
              <p>
                Exam: {subjectWiseExamResult?.exam_details?.exam_name || "-"}
              </p>
              <p>
                Subject:{" "}
                {subjectWiseExamResult?.exam_details?.subject_name || "-"}
              </p>
              <p>
                Full Marks:{" "}
                {subjectWiseExamResult?.exam_details?.full_marks || "-"}
              </p>
              <p>
                Pass Marks:{" "}
                {subjectWiseExamResult?.exam_details?.pass_marks || "-"}
              </p>

              {/* Display table */}
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
                  {studentList.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No students found for the selected subject.
                      </td>
                    </tr>
                  ) : (
                    studentList.map((student) => {
                      const result =
                        subjectWiseExamResult?.results?.find(
                          (res) => res.student.id === student.id
                        ) || null;

                      return (
                        <tr
                          key={student.id}
                          className="border-b hover:bg-purple-50"
                        >
                          <td className="px-6 py-4">
                            {student.user.first_name} {student.user.last_name}
                          </td>
                          {/* Theory Marks Column */}
                          <td className="px-6 py-4">
                            {result ? result.theory_marks : "-"}
                          </td>
                          {/* Practical Marks Column */}
                          <td className="px-6 py-4">
                            {result ? result.practical_marks : "-"}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                handleDeleteMarks(
                                  result ? result.result_id : null
                                )
                              }
                              className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 ml-2"
                              disabled={!result}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Edit Marks Section */}
          {!viewMode && selectedExam && selectedSubject && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-purple-700">
                Edit Marks
              </h2>
              <p>
                Exam: {subjectWiseExamResult?.exam_details?.exam_name || "-"}
              </p>
              <p>
                Subject:{" "}
                {subjectWiseExamResult?.exam_details?.subject_name || "-"}
              </p>
              <p>
                Full Marks:{" "}
                {subjectWiseExamResult?.exam_details?.full_marks || "-"}
              </p>
              <p>
                Pass Marks:{" "}
                {subjectWiseExamResult?.exam_details?.pass_marks || "-"}
              </p>

              {/* Display table */}
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
                  {studentList.length === 0 ? (
                    <tr>
                      <td
                        colSpan="4"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No students found for the selected subject.
                      </td>
                    </tr>
                  ) : (
                    studentList.map((student) => {
                      const result =
                        subjectWiseExamResult?.results?.find(
                          (res) => res.student.id === student.id
                        ) || null;

                      return (
                        <tr
                          key={student.id}
                          className="border-b hover:bg-purple-50"
                        >
                          <td className="px-6 py-4">
                            {student.user.first_name} {student.user.last_name}
                          </td>
                          {/* Theory Marks Column */}
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={marks[student.id]?.theory || ""}
                              onChange={(e) =>
                                setMarks((prev) => ({
                                  ...prev,
                                  [student.id]: {
                                    ...prev[student.id],
                                    theory: e.target.value,
                                  },
                                }))
                              }
                              className="border border-purple-300 rounded-lg px-4 py-2 w-full shadow-sm focus:ring-2 focus:ring-purple-300"
                            />
                          </td>
                          {/* Practical Marks Column */}
                          <td className="px-6 py-4">
                            <input
                              type="number"
                              value={marks[student.id]?.practical || ""}
                              onChange={(e) =>
                                setMarks((prev) => ({
                                  ...prev,
                                  [student.id]: {
                                    ...prev[student.id],
                                    practical: e.target.value,
                                  },
                                }))
                              }
                              className="border border-purple-300 rounded-lg px-4 py-2 w-full shadow-sm focus:ring-2 focus:ring-purple-300"
                            />
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() =>
                                handleSaveMarks(
                                  student.id,
                                  marks[student.id]?.theory || 0,
                                  marks[student.id]?.practical || 0
                                )
                              }
                              className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800"
                            >
                              Save
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
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
