import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const StudentRoutine = () => {
  const { access, class: selectedClass } = useSelector((state) => state.user);
  const selectedClassId = selectedClass?.id;
  const [examList, setExamList] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState("");
  const [examRoutines, setExamRoutines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [routineError, setRoutineError] = useState("");

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
        setExamList(data);
      } catch (error) {
        toast.error("Error fetching exams.");
      }
    };

    fetchExams();
  }, [access]);

  useEffect(() => {
    const fetchExamRoutines = async () => {
      if (!access) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

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
          if (data.exam_details && data.exam_details.length > 0) {
            setExamRoutines(data.exam_details);
            setRoutineError("");
          } else {
            setRoutineError("The exam routine has not been published yet.");
            setExamRoutines([]);
          }
          setLoading(false);
        } catch (error) {
          setLoading(false);
          setRoutineError("The exam routine has not been published yet.");
          setExamRoutines([]);
        }
      }
    };

    fetchExamRoutines();
  }, [access, selectedExamId, selectedClassId]);

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800 mb-6">Exam Routine</h1>

          <div className="mt-4">
            <label className="block text-lg font-semibold text-purple-700 mb-2">
              Select Exam:
            </label>
            <select
              name="selectExam"
              id="selectExam"
              onChange={(e) => setSelectedExamId(e.target.value)}
              className="w-fit p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            >
              <option value="">Select Exam</option>
              {examList.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="text-center text-purple-600 font-medium">Loading exam routines...</p>
          ) : routineError ? (
            <p className="text-center text-red-600 font-medium">{routineError}</p>
          ) : selectedExamId && selectedClassId ? (
            <table className="min-w-full mt-4 table-auto text-sm text-purple-900">
              <thead>
                <tr className="bg-purple-700 text-white font-semibold">
                  <th className="px-4 py-2 border">Subject</th>
                  <th className="px-4 py-2 border">Date</th>
                  <th className="px-4 py-2 border">Time</th>
                </tr>
              </thead>
              <tbody>
                {examRoutines.map((routine, index) => (
                  <tr key={index} className="border-b hover:bg-purple-100">
                    <td className="px-4 py-2 font-medium text-purple-800">{routine.subject.subject_name}</td>
                    <td className="px-4 py-2 font-medium text-purple-800">{routine.exam_date}</td>
                    <td className="px-4 py-2 font-medium text-purple-800">{routine.exam_time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-purple-600 font-medium">
              Please select an exam to view the routine.
            </p>
          )}

          <div className="mt-6 text-sm text-purple-700">
            <p>
              <strong>Note:</strong> Please make sure to reach your exam location at least 30 minutes before the start time. All students must bring their student ID cards to the examination hall.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentRoutine;
