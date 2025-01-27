import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import axios from "axios";
import { Radio } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const StudentReports = () => {
  const { access, id: StudentId, date_of_birth: DOB, email: userEmail, phone, parents: parentsName } = useSelector((state) => state.user);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedExamIdForMarks, setSelectedExamIdForMarks] = useState(null);
  const [examReports, setExamReports] = useState(null);

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

  // Fetch student result when the exam id changes
  useEffect(() => {
    const fetchExams = async () => {
      if (!access) {
        toast.error("User is not authenticated. Please log in.");
        return;
      }

      try {
        setLoading(true);
        const { data } = await axios.get(
          `http://localhost:8000/api/marksheet/${StudentId}/${selectedExamIdForMarks}/`,
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
        toast.error("Error fetching exam reports.");
      }
    };
    fetchExams();
  }, [access, selectedExamIdForMarks]);

  const handleExamChange = (id) => {
    setSelectedExamIdForMarks(id);
    setExamReports(null);
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          {exams.length > 0 ? (
            <Radio.Group
              block
              options={exams.map((option) => ({
                label: option.name,
                value: option.id,
              }))}
              defaultValue={exams[exams.length - 1]?.id}
              optionType="button"
              buttonStyle="solid"
              onChange={(e) => handleExamChange(e.target.value)}
            />
          ) : (
            <span>Exam has not been added yet.</span>
          )}

          {selectedExamIdForMarks && examReports ? (
            <div>
              <div className="mb-6">
                {/* Result Title */}
                <p className="text-2xl font-semibold text-center text-purple-800 bg-purple-100 p-4 rounded-lg shadow-md">
                  Result of <span className="text-xl text-purple-700">{examReports.exam}</span>
                </p>
              </div>

              {/* Other sections */}
              <div className="flex justify-between items-center mb-6">
                <img src="logo.jpeg" alt="School Logo" className="w-24 h-24" />
                <div className="text-center">
                  <h1 className="text-3xl font-extrabold text-purple-800">
                    Satyam Xaviers English School
                  </h1>
                  <p className="text-lg text-purple-700">{examReports.exam}</p>
                  <p className="text-sm text-gray-600">Bharatpur-3, Aaanandamargh</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    <strong>Reg No:</strong> 98765
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Year:</strong> {examReports.student.year}
                  </p>
                </div>
              </div>

              {/* Personal Details Section */}
              <div>
                <div className="flex items-center justify-center mb-6">
                  <h2 className="font-semibold text-purple-700">Student Information</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-purple-700 text-sm">
                      <strong>Name:</strong> {examReports.student.first_name} {examReports.student.last_name}
                    </p>
                    <p className="text-purple-700 text-sm">
                      <strong>Class:</strong> {examReports.student.class_code.class_name}
                    </p>
                    <p className="text-purple-700 text-sm">
                      <strong>Roll Number:</strong> 22
                    </p>
                    <p className="text-purple-700 text-sm">
                      <strong>Attendance:</strong> {examReports.student.attendance}%
                    </p>
                  </div>
                  <div>
                    <p className="text-purple-700 text-sm">
                      <strong>DOB:</strong> {DOB}
                    </p>
                    <p className="text-purple-700 text-sm">
                      <strong>Parent name:</strong> {parentsName}
                    </p>
                    <p className="text-purple-700 text-sm">
                      <strong>Email:</strong> {userEmail}
                    </p>
                    <p className="text-purple-700 text-sm">
                      <strong>Contact:</strong> {phone}
                    </p>
                  </div>
                </div>
              </div>

              {/* Report Card Section */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-purple-700">Subject Marks</h2>
                <table className="min-w-full mt-4 table-auto text-xs">
                  <thead>
                    <tr className="bg-purple-100 text-purple-700">
                      <th className="px-2 py-1 border text-left">Subject</th>
                      <th className="px-2 py-1 border text-center">Full Marks</th>
                      <th className="px-2 py-1 border text-center">Pass Marks</th>
                      <th className="px-2 py-1 border text-center">Theory Marks</th>
                      <th className="px-2 py-1 border text-center">Practical Marks</th>
                      <th className="px-2 py-1 border text-center">Obtained Marks</th>
                      <th className="px-2 py-1 border text-left">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {examReports.results.map((item, index) => (
                      <tr key={index} className="border-b hover:bg-gray-100">
                        <td className="px-2 py-1">{item.subject}</td>
                        <td className="px-2 py-1 text-center">{item.full_marks}</td>
                        <td className="px-2 py-1 text-center">{item.pass_marks}</td>
                        <td className="px-2 py-1 text-center">{item.theory_marks}</td>
                        <td className="px-2 py-1 text-center">{item.practical_marks}</td>
                        <td className="px-2 py-1 text-center">{item.total_marks}</td>
                        <td className="px-2 py-1">{item.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Overall Marks and Remarks Section */}
              <div className="mt-6">
                <h2 className="text-xl font-semibold text-purple-700">Overall Summary</h2>
                <div className="mt-4 flex justify-between items-center">
                  <div className="text-sm text-purple-700">
                    <p>
                      <strong>Total Obtained Marks:</strong> {examReports.total_marks_obtained}
                    </p>
                    <p>
                      <strong>Percentage:</strong> {examReports.percentage}%
                    </p>
                  </div>
                  <div className="text-sm text-purple-700 font-semibold">
                    <p>
                      <strong>Result:</strong> Passed
                    </p>
                    <p>
                      <strong>Grade:</strong> {examReports.gpa}
                    </p>
                  </div>
                </div>
              </div>

              {/* Published Date and Signature Section */}
              <div className="mt-6 flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  <p>
                    <strong>Published Date:</strong> 225-01-25
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">
                    <strong>Signature:</strong> __________________________
                  </p>
                </div>
              </div>

              {/* Remarks Key Section */}
              <div className="mt-6 text-sm text-gray-600">
                <p>
                  <strong>Remarks Key:</strong>
                </p>
                <ul className="list-disc ml-6">
                  <li>
                    <strong>F</strong> - Fail
                  </li>
                  <li>
                    <strong>P</strong> - Pass
                  </li>
                  <li>
                    <strong>A</strong> - Absent
                  </li>
                  <li>
                    <strong>W</strong> - Withheld
                  </li>
                  <li>
                    <strong>G</strong> - Good
                  </li>
                  <li>
                    <strong>E</strong> - Excellent
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="bg-yellow-100 text-yellow-700 border-l-4 border-yellow-500 p-4 flex items-center mb-6">
              <ExclamationCircleOutlined className="text-2xl mr-2" />
              <p className="text-lg font-semibold">
                Result has not been published yet.
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default StudentReports;
