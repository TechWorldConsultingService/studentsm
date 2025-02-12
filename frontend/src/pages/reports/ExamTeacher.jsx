import React, { useState, useEffect, useCallback } from "react";
import MainLayout from "../../layout/MainLayout";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ExamTeacher = () => {
  const { access, id: teacherId } = useSelector((state) => state.user);
  const navigate = useNavigate();

  // State variables
  const [exams, setExams] = useState([]);
  const [subjectDetails, setSubjectDetails] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [marks, setMarks] = useState({});
  const [viewMode, setViewMode] = useState(true); // Toggle between view-only and edit mode
  const [studentList, setStudentList] = useState([]);
  const [subjectWiseExamResult, setSubjectWiseExamResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExamDetailsId, setSelectedExamDetailsId] = useState(null);

  /**
   * Fetch All Exams
   */
  const fetchExams = useCallback(async () => {
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
    } catch (error) {
      toast.error("Error fetching exams.");
    } finally {
      setLoading(false);
    }
  }, [access]);

  useEffect(() => {
    fetchExams();
  }, [fetchExams]);

  /**
   * Fetch Subject Details (for the selected exam & teacher)
   */
  const fetchSubjectDetails = useCallback(async () => {
    if (!access || !selectedExam) return;

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
    } catch (error) {
      toast.error("Error fetching subject details.");
    } finally {
      setLoading(false);
    }
  }, [access, selectedExam, teacherId]);

  useEffect(() => {
    fetchSubjectDetails();
  }, [fetchSubjectDetails]);

  /**
   * Fetch Student List for the selected subject
   */
  const fetchStudentList = useCallback(async () => {
    if (!access || !selectedSubject) return;

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
    } catch (error) {
      toast.error("Error fetching student list.");
    } finally {
      setLoading(false);
    }
  }, [access, selectedSubject]);

  useEffect(() => {
    fetchStudentList();
  }, [fetchStudentList]);

  /**
   * Fetch Subject-wise Exam Results
   */
  const fetchSubjectWiseExamResult = useCallback(async () => {
    if (!access || !selectedExam || !selectedSubject) return;

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
    } catch (error) {
      toast.error("Error fetching subject-wise exam results.");
    } finally {
      setLoading(false);
    }
  }, [access, selectedExam, selectedSubject]);

  useEffect(() => {
    fetchSubjectWiseExamResult();
  }, [fetchSubjectWiseExamResult]);

  /**
   * Handle Saving Marks
   */
  const handleSaveMarks = async (studentId, theoryMarks, practicalMarks) => {
    if (theoryMarks < 0 || practicalMarks < 0) {
      toast.error("Marks cannot be negative.");
      return;
    }
    if (!selectedExamDetailsId) {
      toast.error("No exam detail selected.");
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
      toast.success("Marks saved successfully.");
      // Refresh the exam results
      fetchSubjectWiseExamResult();
    } catch (error) {
      toast.error("Error saving marks.");
    }
  };

  /**
   * Handle Deleting Marks
   */
  const handleDeleteMarks = async (resultId) => {
    if (!resultId) {
      toast.error("No marks to delete.");
      return;
    }

    try {
      await axios.delete(`http://localhost:8000/api/results/${resultId}/`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      toast.success("Marks deleted successfully.");
      // Refresh the exam results
      fetchSubjectWiseExamResult();
    } catch (error) {
      toast.error("Error deleting marks.");
    }
  };

  /**
   * Handlers for Exam and Subject selection
   */
  const handleExamSelect = (examId) => {
    setSelectedExam(examId);
    setSelectedSubject(null);
    setSubjectDetails([]);
  };

  const handleSubjectSelect = (subjectString) => {
    const parsed = JSON.parse(subjectString);
    setSelectedSubject(parsed.subject_details.id);
    setSelectedExamDetailsId(parsed.exam_details.id);
  };

  /**
   * Toggle between view mode and edit mode
   */
  const toggleViewMode = () => setViewMode((prev) => !prev);

  return (
    <MainLayout>
      {/* Page Container */}
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 min-h-screen p-6 flex flex-col items-center">
        {/* Main Card */}
        <div className="w-full max-w-5xl bg-white p-8 rounded-xl shadow-lg border border-purple-200">
          <h1 className="text-3xl font-extrabold text-purple-800">
            Exam Management
          </h1>
          <p className="mt-2 text-gray-600">
            Manage exams, subjects, and student marks.
          </p>

          {/* Loading Spinner */}
          {loading && (
            <div className="mt-4 flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-purple-500 mr-2"></div>
              <p className="text-purple-500">Loading...</p>
            </div>
          )}

          {/* Exam Selection */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">Select Exam</h2>
            <select
              className="mt-2 w-full border border-purple-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-purple-300"
              onChange={(e) => handleExamSelect(e.target.value)}
              value={selectedExam || ""}
            >
              <option value="">-- Choose an Exam --</option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Selection (only when an exam is selected) */}
          {selectedExam && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-purple-700">
                Select Subject
              </h2>
              <select
                className="mt-2 w-full border border-purple-300 rounded-lg px-4 py-2 shadow-sm focus:ring-2 focus:ring-purple-300"
                onChange={(e) => handleSubjectSelect(e.target.value)}
                value={selectedSubject || ""}
              >
                <option value="">-- Choose a Subject --</option>
                {subjectDetails.map((item, index) =>
                  item.subject_details?.subject_name ? (
                    <option key={index} value={JSON.stringify(item)}>
                      {item.subject_details.subject_name}
                    </option>
                  ) : null
                )}
              </select>
            </div>
          )}

          {/* View/Edit Mode Toggle (only when exam and subject are selected) */}
          {selectedExam && selectedSubject && (
            <div className="mt-6 flex justify-end">
              <button
                onClick={toggleViewMode}
                className={`rounded-lg px-6 py-2 font-semibold shadow-sm transition-colors ${
                  viewMode
                    ? "bg-purple-700 text-white hover:bg-purple-800"
                    : "bg-white text-purple-700 border-2 border-purple-700 hover:bg-purple-100"
                }`}
              >
                {viewMode ? "Switch to Edit Mode" : "Switch to View Mode"}
              </button>
            </div>
          )}

          {/* Marks Table */}
          {selectedExam && selectedSubject && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-purple-700 mb-2">
                {viewMode ? "View Marks" : "Edit Marks"}
              </h2>
              <div className="border border-purple-300 rounded-lg p-4 shadow-sm bg-purple-50">
                <p>
                  <span className="font-semibold">Exam: </span>
                  {subjectWiseExamResult?.exam_details?.exam_name || "-"}
                </p>
                <p>
                  <span className="font-semibold">Subject: </span>
                  {subjectWiseExamResult?.exam_details?.subject_name || "-"}
                </p>
                <p>
                  <span className="font-semibold">Full Marks: </span>
                  {subjectWiseExamResult?.exam_details?.full_marks || "-"}
                </p>
                <p>
                  <span className="font-semibold">Pass Marks: </span>
                  {subjectWiseExamResult?.exam_details?.pass_marks || "-"}
                </p>
              </div>

              {/* Table */}
              <div className="mt-6 overflow-x-auto">
                <table className="w-full table-auto border-collapse text-left">
                  <thead>
                    <tr className="bg-purple-700 text-white">
                      <th className="px-6 py-3">Student Name</th>
                      <th className="px-6 py-3">Theory Marks</th>
                      <th className="px-6 py-3">Practical Marks</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {/* No Students */}
                    {studentList.length === 0 && (
                      <tr>
                        <td
                          colSpan="4"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No students found for the selected subject.
                        </td>
                      </tr>
                    )}

                    {/* Students List */}
                    {studentList.map((student) => {
                      const result =
                        subjectWiseExamResult?.results?.find(
                          (res) => res.student.id === student.id
                        ) || null;

                      return (
                        <tr
                          key={student.id}
                          className="border-b hover:bg-purple-50 transition-colors"
                        >
                          {/* Student Name */}
                          <td className="px-6 py-4">
                            {student.user.first_name} {student.user.last_name}
                          </td>

                          {/* Theory Marks */}
                          <td className="px-6 py-4">
                            {viewMode ? (
                              result?.theory_marks !== null
                                ? result?.theory_marks
                                : "-"
                            ) : (
                              <input
                                type="number"
                                value={
                                  marks[student.id]?.theory ??
                                  result?.theory_marks ??
                                  ""
                                }
                                onChange={(e) =>
                                  setMarks((prev) => ({
                                    ...prev,
                                    [student.id]: {
                                      ...prev[student.id],
                                      theory: e.target.value,
                                    },
                                  }))
                                }
                                className="w-24 border border-purple-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300"
                              />
                            )}
                          </td>

                          {/* Practical Marks */}
                          <td className="px-6 py-4">
                            {viewMode ? (
                              result?.practical_marks !== null
                                ? result?.practical_marks
                                : "-"
                            ) : (
                              <input
                                type="number"
                                value={
                                  marks[student.id]?.practical ??
                                  result?.practical_marks ??
                                  ""
                                }
                                onChange={(e) =>
                                  setMarks((prev) => ({
                                    ...prev,
                                    [student.id]: {
                                      ...prev[student.id],
                                      practical: e.target.value,
                                    },
                                  }))
                                }
                                className="w-24 border border-purple-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-purple-300"
                              />
                            )}
                          </td>

                          {/* Action Buttons */}
                          <td className="px-6 py-4">
                            {viewMode ? (
                              <button
                                onClick={() =>
                                  handleDeleteMarks(result?.result_id)
                                }
                                disabled={!result} // Disable if no result yet
                                className={`rounded-md px-4 py-2 text-white transition-colors ${
                                  result
                                    ? "bg-red-600 hover:bg-red-700"
                                    : "bg-gray-400 cursor-not-allowed"
                                }`}
                              >
                                Delete
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleSaveMarks(
                                    student.id,
                                    marks[student.id]?.theory ||
                                      result?.theory_marks ||
                                      0,
                                    marks[student.id]?.practical ||
                                      result?.practical_marks ||
                                      0
                                  )
                                }
                                className="bg-purple-700 text-white px-4 py-2 rounded-md hover:bg-purple-800 transition-colors"
                              >
                                Save
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ExamTeacher;
