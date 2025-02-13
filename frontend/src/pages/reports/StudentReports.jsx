import React, { useState, useEffect, useRef } from "react";
import MainLayout from "../../layout/MainLayout";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const StudentReports = () => {
  const { access, id: StudentId, date_of_birth: DOB, email: userEmail, phone, parents: parentsName } = useSelector((state) => state.user);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExamIdForMarks, setSelectedExamIdForMarks] = useState("");
  const [examReports, setExamReports] = useState(null);
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
        toast.error("Error fetching exams.");
      }
    };
    fetchExams();
  }, [access]);

  useEffect(() => {
    const fetchReports = async () => {
      if (!access) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      try {
        setLoading(true);
        const { data } = await axios.get(`http://localhost:8000/api/marksheet/${StudentId}/${selectedExamIdForMarks}/`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
        setExamReports(data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error("Error fetching exam reports.");
      }
    };
    if (selectedExamIdForMarks) fetchReports();
  }, [access, selectedExamIdForMarks]);

  const handleExamChange = (e) => {
    setSelectedExamIdForMarks(e.target.value);
    setExamReports(null);
  };

  const downloadPDF = () => {
    const input = reportRef.current;
    html2canvas(input, { scale: 2, backgroundColor: "#FAF5FF" }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`Marksheet_${examReports.student.first_name}_${examReports.exam}.pdf`);
    });
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-10">
        <div className="bg-white p-8 rounded-xl shadow-xl relative max-w-4xl mx-auto">
          {selectedExamIdForMarks && examReports && (
            <button
              onClick={downloadPDF}
              className="absolute top-4 right-4 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition duration-300"
            >
              Download PDF
            </button>
          )}

          <h2 className="text-3xl font-extrabold text-purple-900 mb-6 text-center">Student Examination Report</h2>

          <div className="mb-6">
            <label className="block text-lg font-semibold text-purple-700 mb-2">Select Exam:</label>
            <select
              name="selectExam"
              id="selectExam"
              onChange={handleExamChange}
              className="w-full p-4 border rounded-xl focus:outline-none focus:ring-4 focus:ring-purple-500 transition duration-300 ease-in-out"
            >
              <option value="">Select Exam</option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>{exam.name}</option>
              ))}
            </select>
            <p className="text-sm text-gray-500 mt-2">Please select an exam from the dropdown above to view the report.</p>
          </div>

          {loading && (
            <div className="flex justify-center items-center p-6 animate-pulse">
              <div className="w-8 h-8 bg-purple-500 rounded-full mr-4"></div>
              <p className="text-xl font-medium text-purple-700">Loading...</p>
            </div>
          )}

          {!selectedExamIdForMarks && !loading && (
            <div className="flex flex-col items-center justify-center bg-white text-gray-800 p-8 rounded-xl shadow-md border border-gray-300">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-gray-600">📄</div>
              <p className="text-2xl font-bold mt-4">No Exam Selected</p>
              <p className="text-md mt-2 text-gray-600">Please select an exam from the dropdown above to view the report.</p>
            </div>
          )}

          {selectedExamIdForMarks && !examReports && !loading && (
            <div className="flex flex-col items-center justify-center bg-white text-gray-800 p-8 rounded-xl shadow-md border border-gray-300">
              <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center text-4xl font-bold text-red-500">⏳</div>
              <p className="text-2xl font-bold mt-4 text-red-600">Result Not Published</p>
              <p className="text-md mt-2 text-gray-600">The result for the selected exam has not been published yet. Please check back later.</p>
            </div>
          )}

          {selectedExamIdForMarks && examReports && (
            <div ref={reportRef} className="p-8 bg-purple-50 rounded-lg shadow-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bottom-0 grid grid-cols-5 grid-rows-20 gap-4 opacity-10 pointer-events-none select-none">
                {Array.from({ length: 300 }).map((_, index) => (
                  <p key={index} className="text-xs text-purple-400 text-center">Satyam Xaviers English School</p>
                ))}
              </div>

              <div className="text-center mb-8 relative z-10">
                <img src="logo.jpeg" alt="School Logo" className="w-28 h-28 mx-auto rounded-full shadow-lg" />
                <h1 className="text-4xl font-bold text-purple-900 mt-4">Satyam Xaviers English School</h1>
                <p className="text-2xl text-purple-700 font-medium">{examReports.exam}</p>
                <p className="text-md text-gray-600 italic">Bharatpur-3, Aaanandamargh</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-purple-800 text-md relative z-10">
                <p><strong>Name:</strong> {examReports.student.first_name} {examReports.student.last_name}</p>
                <p><strong>Class:</strong> {examReports.student.class_code?.class_name || 'N/A'}</p>
                <p><strong>Roll Number:</strong> {examReports.student.roll_number || 'N/A'}</p>
                <p><strong>Attendance:</strong> {examReports.student.attendance || 'N/A'}%</p>
                <p><strong>DOB:</strong> {DOB}</p>
                <p><strong>Parent name:</strong> {parentsName}</p>
                <p><strong>Email:</strong> {userEmail}</p>
                <p><strong>Contact:</strong> {phone}</p>
              </div>

              <h2 className="text-2xl font-semibold text-purple-800 mt-8">Subject Marks</h2>
              <table className="w-full mt-4 table-auto text-md border-collapse border border-purple-400 shadow-md relative z-10">
                <thead>
                  <tr className="bg-purple-200 text-purple-900">
                    <th className="px-4 py-2 border">Subject</th>
                    <th className="px-4 py-2 border">Full Marks</th>
                    <th className="px-4 py-2 border">Pass Marks</th>
                    <th className="px-4 py-2 border">Theory Marks</th>
                    <th className="px-4 py-2 border">Practical Marks</th>
                    <th className="px-4 py-2 border">Obtained Marks</th>
                    <th className="px-4 py-2 border">Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {examReports.results.map((item, index) => (
                    <tr key={index} className="hover:bg-purple-50">
                      <td className="px-4 py-2 border text-center">{item.subject || 'N/A'}</td>
                      <td className="px-4 py-2 border text-center">{item.full_marks || 'N/A'}</td>
                      <td className="px-4 py-2 border text-center">{item.pass_marks || 'N/A'}</td>
                      <td className="px-4 py-2 border text-center">{item.theory_marks || 'N/A'}</td>
                      <td className="px-4 py-2 border text-center">{item.practical_marks || 'N/A'}</td>
                      <td className="px-4 py-2 border text-center">{item.total_marks || 'N/A'}</td>
                      <td className="px-4 py-2 border text-center">{item.remarks || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 text-purple-800 text-lg relative z-10">
                <p><strong>Total Marks Obtained:</strong> {examReports.total_marks_obtained || 'N/A'}</p>
                <p><strong>Percentage:</strong> {examReports.percentage || 'N/A'}%</p>
                <p><strong>Grade:</strong> {examReports.gpa || 'N/A'}</p>
                <p><strong>Result:</strong> {examReports.result || 'N/A'}</p>
              </div>

              <div className="mt-6 text-gray-700 text-md relative z-10">
                <p><strong>Published Date:</strong> {examReports.published_date || 'N/A'}</p>
                <p><strong>Signature:</strong> __________________________</p>
              </div>

                            <div className="mt-6 text-sm text-gray-600">
                <p><strong>Remarks Key:</strong></p>
                <ul className="list-disc ml-6">
                  <li><strong>F</strong> - Fail</li>
                  <li><strong>P</strong> - Pass</li>
                  <li><strong>A</strong> - Absent</li>
                  <li><strong>W</strong> - Withheld</li>
                  <li><strong>G</strong> - Good</li>
                  <li><strong>E</strong> - Excellent</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentReports;