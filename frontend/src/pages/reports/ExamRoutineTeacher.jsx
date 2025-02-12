import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ExamRoutineTeacher = () => {
  const { access } = useSelector((state) => state.user);

  // State
  const [examRoutines, setExamRoutines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [classList, setClassList] = useState([]);
  const [examList, setExamList] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedExamId, setSelectedExamId] = useState("");
  const [routineError, setRoutineError] = useState("");

  /** Fetch all classes & exams on mount **/
  useEffect(() => {
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
        toast.error("Error fetching classes.");
      }
    };

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
        setExamList(data);
      } catch (error) {
        toast.error("Error fetching exams.");
      }
    };

    fetchClasses();
    fetchExams();
  }, [access]);

  /** Fetch Exam Routine whenever class or exam changes **/
  useEffect(() => {
    const fetchExamRoutines = async () => {
      if (!access) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      // Only fetch if both exam and class are selected
      if (selectedExamId && selectedClassId) {
        try {
          setLoading(true);
          const { data } = await axios.get(
            `http://localhost:8000/api/exam-timetable/${selectedExamId}/${selectedClassId}/`,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access}`,
              },
            }
          );

          // Check if there are any exam details
          if (data.exam_details && data.exam_details.length > 0) {
            setExamRoutines(data.exam_details);
            setRoutineError("");
          } else {
            setRoutineError("The exam routine has not been published yet.");
            setExamRoutines([]);
          }
        } catch (error) {
          setRoutineError("The exam routine has not been published yet.");
          setExamRoutines([]);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchExamRoutines();
  }, [access, selectedExamId, selectedClassId]);

  return (
    <MainLayout>
      {/* Page Background with Subtle Gradient */}
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-purple-100 p-6 flex flex-col items-center">
        {/* Main Container */}
        <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow-md border border-purple-100">
          <h1 className="text-3xl font-extrabold text-purple-800 mb-6 text-center">
            Teacher's Exam Routine
          </h1>

          {/* Exam Selector */}
          <div className="mb-6">
            <label className="block text-lg font-medium text-purple-700 mb-2">
              Select Exam
            </label>
            <select
              name="selectExam"
              id="selectExam"
              value={selectedExamId}
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-full max-w-sm border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="">-- Choose an Exam --</option>
              {examList.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>

          {/* Class Selector (only show if an exam is selected) */}
          {selectedExamId && (
            <div className="mb-6">
              <label className="block text-lg font-medium text-purple-700 mb-2">
                Select Class
              </label>
              <select
                name="selectClass"
                id="selectClass"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                className="w-full max-w-sm border border-purple-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-600"
              >
                <option value="">-- Choose a Class --</option>
                {classList.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Messages */}
          {loading && (
            <p className="text-center text-purple-600 font-medium my-4 flex items-center justify-center">
              <span className="animate-spin h-5 w-5 mr-2 border-2 border-current border-r-transparent rounded-full"></span>
              Loading exam routines...
            </p>
          )}
          {routineError && !loading && (
            <p className="text-center text-red-600 font-medium mb-4">
              {routineError}
            </p>
          )}

          {/* Routine Table */}
          {!loading && !routineError && selectedExamId && selectedClassId && (
            <div className="overflow-x-auto">
              <table className="min-w-full mt-4 table-auto text-sm text-purple-900 border border-purple-200">
                <thead>
                  <tr className="bg-purple-700 text-white font-semibold">
                    <th className="px-4 py-3 border-r">Class</th>
                    <th className="px-4 py-3 border-r">Subject</th>
                    <th className="px-4 py-3 border-r">Date</th>
                    <th className="px-4 py-3">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {examRoutines.map((routine, index) => (
                    <tr
                      key={index}
                      className="border-b border-purple-200 hover:bg-purple-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-purple-800 border-r">
                        {routine.class_details.name}
                      </td>
                      <td className="px-4 py-3 font-medium text-purple-800 border-r">
                        {routine.subject.subject_name}
                      </td>
                      <td className="px-4 py-3 font-medium text-purple-800 border-r">
                        {routine.exam_date}
                      </td>
                      <td className="px-4 py-3 font-medium text-purple-800">
                        {routine.exam_time}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Fallback: Prompt to select exam and class */}
          {!selectedExamId && !selectedClassId && !loading && !routineError && (
            <p className="text-center text-purple-600 font-medium mt-8">
              Please select an exam and class to view the routine.
            </p>
          )}

          {/* Note / Additional Info */}
          <div className="mt-6 text-sm text-purple-700 bg-purple-50 p-4 rounded-lg border border-purple-100">
            <p className="leading-relaxed">
              <strong>Note for Teachers:</strong> Please be present in the
              examination hall at least 15 minutes before the scheduled time.
              Ensure that all examination materials (question papers, answer
              sheets, seating arrangements, etc.) are properly organized.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExamRoutineTeacher;
