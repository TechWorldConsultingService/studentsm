import React, { useState, useEffect, useRef } from "react";
import MainLayout from "../../layout/MainLayout";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const StudentReports = () => {
  const {
    access,
    id: StudentId,
    first_name: firstName,
    last_name: lastName,
    date_of_birth: dateOfBirth,
    class: studentClass,
    phone,
  } = useSelector((state) => state.user);
  const classAssigned = studentClass?.class_name;

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examReports, setExamReports] = useState(null);
  const [reportError, setReportError] = useState("");
  const reportRef = useRef();

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
        toast.error(error?.response?.data?.detail || "Error fetching exams.");
      }
    };
    fetchExams();
  }, [access]);

  useEffect(() => {
    const fetchReports = async () => {
      if (!access || !selectedExam?.is_result_published) return;

      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:8000/api/marksheet/${StudentId}/${selectedExam.id}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setExamReports(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        setReportError(
          error?.response?.data?.detail || "Error fetching exam reports."
        );
      }
    };
    if (selectedExam) fetchReports();
  }, [access, selectedExam]);

  const handleExamChange = (e) => {
    const examId = e.target.value;
    const exam = exams.find((exam) => exam.id === parseInt(examId));
    setSelectedExam(exam);
    setExamReports(null);

    if (exam && !exam.is_result_published) {
      setReportError("The result for this exam has not been published yet.");
    }
  };

  const downloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2, backgroundColor: "#FAF5FF" }).then(
      (canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        pdf.save(
          `Marksheet_${examReports.student.first_name}_${examReports.exam}.pdf`
        );
      }
    );
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-10">
        <div className="bg-white p-8 rounded-xl shadow-xl relative max-w-4xl mx-auto">
          {selectedExam && examReports && (
            <button
              onClick={downloadPDF}
              className="absolute top-4 right-4 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
            >
              Download PDF
            </button>
          )}

          <h2 className="text-3xl font-extrabold text-purple-900 mb-6 text-center">
            Student Examination Report
          </h2>

          <div className="mb-6">
            <label className="block text-lg font-semibold text-purple-700 mb-2">
              Select Exam:
            </label>
            <select
              name="selectExam"
              id="selectExam"
              onChange={handleExamChange}
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
            >
              <option value="">Select Exam</option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="flex justify-center items-center p-6 animate-pulse">
              <div className="w-8 h-8 bg-purple-500 rounded-full mr-4"></div>
              <p className="text-xl font-medium text-purple-700">Loading...</p>
            </div>
          )}

          {!selectedExam && !loading && (
            <div className="flex flex-col items-center justify-center bg-white text-gray-800 p-8 rounded-xl shadow-md border border-gray-300">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-gray-600">
                📄
              </div>
              <p className="text-2xl font-bold mt-4">No Exam Selected</p>
              <p className="text-md mt-2 text-gray-600">
                Please select an exam from the dropdown above to view the
                report.
              </p>
            </div>
          )}

          {selectedExam && !examReports && !loading && (
            <div className="flex flex-col items-center justify-center bg-white text-gray-800 p-8 rounded-xl shadow-md border border-gray-300">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-red-500">
                ⏳
              </div>
              <p className="text-2xl font-bold mt-4 text-red-600">
                {reportError}
              </p>
              <p className="text-md mt-2 text-gray-600">
                {" "}
                Please check back later.
              </p>
            </div>
          )}

          {selectedExam && examReports && (
            <div
              ref={reportRef}
              className="p-8 bg-purple-50 rounded-lg shadow-md relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 bottom-0 grid grid-cols-5 grid-rows-20 gap-4 opacity-10 pointer-events-none select-none">
                {Array.from({ length: 300 }).map((_, index) => (
                  <p
                    key={index}
                    className="text-xs text-purple-400 text-center"
                  >
                    Satyam Xaviers English School
                  </p>
                ))}
              </div>

              <div className="text-center mb-8 relative z-10">
                <div className="flex justify-between text-sm">
                  <span>
                    <strong> IEMES Code: </strong>124587658
                  </span>
                  <span>
                    <strong>Contact:</strong> +977-9763258057
                  </span>
                </div>
                <div className="flex justify-around p-5 space-x-8">
                  <img
                    src="logo.jpeg"
                    alt="School Logo"
                    className="w-28 h-28 mx-auto rounded-full shadow-lg"
                  />
                  <div>
                    <p className="italic">
                      "Education is the key that unlocks the golden door to
                      freedom."
                    </p>
                    <h1 className="text-3xl font-bold text-purple-900">
                      Satyam Xaviers English School
                    </h1>
                    <p className="text-md text-gray-700 font-semibold">
                      Bharatpur-3, Aaanandamargh
                    </p>
                    <p className="text-md text-gray-700 font-semibold">
                      Estd: 2055
                    </p>
                    <h3 className="text-xl font-bold text-gray-700 mt-2">
                      GRADE-SHEET
                    </h3>
                  </div>
                  <img
                    src="logo.jpeg"
                    alt="School Logo"
                    className="w-28 h-28 mx-auto rounded-full shadow-lg"
                  />
                </div>
              </div>

              <div className="text-gray-700 text-md">
                <p>
                  THE GRADE(S) SECURED BY{" "}
                  <span className="inline-flex flex-col items-center font-bold relative mx-2">
                    <span>
                      {(firstName + " " + lastName || "N/A").toUpperCase()}
                    </span>
                    <span className="block border-b-2 border-gray-700 w-60 mt-1"></span>
                  </span>{" "}
                  DATE OF BIRTH{" "}
                  <span className="inline-flex flex-col items-center font-bold relative mx-2">
                    <span>{(dateOfBirth || "N/A").toUpperCase()}</span>
                    <span className="block border-b-2 border-gray-700 w-36 mt-1"></span>
                  </span>
                  CLASS{" "}
                  <span className="inline-flex flex-col items-center font-bold relative mx-2">
                    <span>{(classAssigned || "N/A").toUpperCase()}</span>
                    <span className="block border-b-2 border-gray-700 w-24 mt-1"></span>
                  </span>{" "}
                  WITH ROLL NUMBER{" "}
                  <span className="inline-flex flex-col items-center font-bold relative mx-2">
                    <span>
                      {(examReports.student.roll_number || "N/A").toUpperCase()}
                    </span>
                    <span className="block border-b-2 border-gray-700 w-24 mt-1"></span>
                  </span>
                  ATTENDANCE RECORD{" "}
                  <span className="inline-flex flex-col items-center font-bold relative mx-2">
                    <span>
                      {(examReports.student.attendance
                        ? examReports.student.attendance + "%"
                        : "N/A"
                      ).toUpperCase()}
                    </span>
                    <span className="block border-b-2 border-gray-700 w-24 mt-1"></span>
                  </span>
                  CONTACT NUMBER{" "}
                  <span className="inline-flex flex-col items-center font-bold relative mx-2">
                    <span>{(phone || "N/A").toUpperCase()}</span>
                    <span className="block border-b-2 border-gray-700 w-36 mt-1"></span>
                  </span>
                  IN THE{" "}
                  <span className="inline-flex flex-col items-center font-bold relative mx-2">
                    <span>{(examReports.exam || "N/A").toUpperCase()}</span>
                    <span className="block border-b-2 border-gray-700 w-96 mt-1"></span>
                  </span>
                  .
                </p>
              </div>

              <table className="w-full mt-4 table-auto text-md border-collapse border border-purple-400 shadow-md relative z-10">
                <thead>
                  <tr className="bg-purple-200 text-purple-900">
                    <th className="px-4 py-2 border">Subject</th>
                    <th className="px-4 py-2 border">Full Marks</th>
                    <th className="px-4 py-2 border">TH</th>
                    <th className="px-4 py-2 border">PR</th>
                    <th className="px-4 py-2 border">Final Grade</th>
                    <th className="px-4 py-2 border">Grade Point</th>
                    <th className="px-4 py-2 border">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {examReports.results.length > 0 &&
                    examReports.results.map((item, index) => (
                      <tr key={index} className="hover:bg-purple-50">
                        <td className="px-4 py-2 border text-center">
                          {item?.exam_detail?.subject?.subject_name || "N/A"}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          {item?.exam_detail?.full_marks || "N/A"}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          {item.theory_marks || "N/A"}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          {item.practical_marks || "N/A"}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          {item.total_marks || "N/A"}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          {item.gpa || "N/A"}
                        </td>
                        <td className="px-4 py-2 border text-center">
                          {item.remarks || "Very Good."}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>

              <div className="flex flex-col items-end mt-4 text-gray-700 text-lg ">
                <p>
                  <strong>Grade Point Average(GPA):</strong>{" "}
                  {examReports.gpa || "N/A"}
                </p>
                <p>
                  <strong>Result:</strong> {examReports.result || "N/A"}
                </p>
                <p>
                  Position: {examReports.result || "2nd"}
                </p>
              </div>

              <div className="mt-6 text-sm text-gray-600 relative z-10">
                <p>
                  <strong>Remarks Key:</strong>
                </p>
                <ul className="list-disc ml-6">
                  <li>One Cradit Hour Equals 32 Clock Hours</li>
                  <li>TH: Theory, PR: Practical</li>
                  <li>ABS: Absent, N/G: Non Graded, F: Fail, W: withheld</li>
                </ul>
              </div>

              <h3 className="text-gray-700 font-semibold p-2 pt-2">
                Details of Grade Sheet:
              </h3>
              <table className="text-gray-700 table-auto border-collapse border border-gray-400 p-1 text-center w-full relative z-10">
                <thead>
                  <tr>
                    <th className="border border-gray-400 py-1 px-2 ">
                      Percentage
                    </th>
                    <th className="border border-gray-400 py-1 px-2 ">Grade</th>
                    <th className="border border-gray-400 py-1 px-2 ">GPA</th>
                    <th className="border border-gray-400 py-1 px-2 ">
                      Percentage
                    </th>
                    <th className="border border-gray-400 py-1 px-2 ">Grade</th>
                    <th className="border border-gray-400 py-1 px-2 ">GPA</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-400 py-1 px-2 ">
                      90% - 100%
                    </td>
                    <td className="border border-gray-400 py-1 px-2 ">A+</td>
                    <td className="border border-gray-400 py-1 px-2 ">4.0</td>
                    <td className="border border-gray-400 py-1 px-2 ">
                      50% - Below 60%
                    </td>
                    <td className="border border-gray-400 py-1 px-2 ">C+</td>
                    <td className="border border-gray-400 py-1 px-2 ">2.4</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 py-1 px-2 ">
                      80% - Below 90%
                    </td>
                    <td className="border border-gray-400 py-1 px-2 ">A</td>
                    <td className="border border-gray-400 py-1 px-2 ">3.6</td>
                    <td className="border border-gray-400 py-1 px-2 ">
                      40% - Below 50%
                    </td>
                    <td className="border border-gray-400 py-1 px-2 ">C</td>
                    <td className="border border-gray-400 py-1 px-2 ">2.0</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 py-1 px-2 ">
                      70% - Below 80%
                    </td>
                    <td className="border border-gray-400 py-1 px-2 ">B+</td>
                    <td className="border border-gray-400 py-1 px-2 ">3.2</td>
                    <td className="border border-gray-400 py-1 px-2 ">
                      35% - Below 40%
                    </td>
                    <td className="border border-gray-400 py-1 px-2 ">D</td>
                    <td className="border border-gray-400 py-1 px-2 ">1.6</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-400 py-1 px-2 ">
                      60% - Below 70%
                    </td>
                    <td className="border border-gray-400 py-1 px-2 ">B</td>
                    <td className="border border-gray-400 py-1 px-2 ">2.8</td>
                    <td className="border border-gray-400 py-1 px-2 ">
                      Below 35%
                    </td>
                    <td className="border border-gray-400 py-1 px-2 ">N/G</td>
                    <td className="border border-gray-400 py-1 px-2 ">-</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-around mt-6 text-gray-700 text-md relative z-10">
                <p className="flex flex-col items-center">
                  <span>{examReports.published_date || "N/A"}</span>
                  <strong>Published Date</strong>{" "}
                </p>
                <p className="flex flex-col items-center">
                  <span> __________________________</span>
                  <strong>Class Teacher</strong>
                </p>
                <p className="flex flex-col items-center">
                  <span> __________________________</span>
                  <strong>Principal</strong>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentReports;
