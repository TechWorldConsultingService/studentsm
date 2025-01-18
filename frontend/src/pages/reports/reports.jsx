import React from "react";
import MainLayout from "../../layout/MainLayout";

const StudentReports = () => {
  // Sample student data
  const student = {
    name: "John Doe",
    rollNumber: "12345",
    symbolNumber: "54321",
    school: "XYZ Secondary School",
    address: "Kathmandu, Nepal",
    year: "2024",
    exam: "SEE (Secondary Education Examination)",
    grade: "A",
    attendance: 90, // Percentage attendance
  };

  const subjects = [
    {
      name: "Mathematics",
      theory: { fullMarks: 100, obtainedMarks: 75 },
      practical: { fullMarks: 50, obtainedMarks: 40 },
      remarks: "Good Performance",
    },
    {
      name: "Science",
      theory: { fullMarks: 100, obtainedMarks: 80 },
      practical: { fullMarks: 50, obtainedMarks: 45 },
      remarks: "Excellent",
    },
    {
      name: "English",
      theory: { fullMarks: 100, obtainedMarks: 60 },
      practical: { fullMarks: 50, obtainedMarks: 30 },
      remarks: "Average",
    },
    {
      name: "Social Studies",
      theory: { fullMarks: 100, obtainedMarks: 85 },
      practical: { fullMarks: 50, obtainedMarks: 50 },
      remarks: "Very Good",
    },
  ];

  // Calculate Total Marks, Obtained Marks, and Percentage
  const totalFullMarks = subjects.reduce(
    (acc, subject) =>
      acc + subject.theory.fullMarks + subject.practical.fullMarks,
    0
  );
  const totalObtainedMarks = subjects.reduce(
    (acc, subject) =>
      acc + subject.theory.obtainedMarks + subject.practical.obtainedMarks,
    0
  );
  const percentage = ((totalObtainedMarks / totalFullMarks) * 100).toFixed(2);
  const overallRemarks = percentage >= 35 ? "Passed" : "Failed";

  // Current date for published date
  const currentDate = new Date().toLocaleDateString();

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          {/* Top Section - School Details */}
          <div className="flex justify-between items-center mb-6">
            <img
              src="your-logo-url.png"
              alt="School Logo"
              className="w-24 h-24"
            />
            <div className="text-center">
              <h1 className="text-3xl font-extrabold text-purple-800">
                XYZ Secondary School
              </h1>
              <p className="text-lg text-purple-700">
                SEE (Secondary Education Examination)
              </p>
              <p className="text-sm text-gray-600">{student.address}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">
                <strong>Reg No:</strong> 98765
              </p>
              <p className="text-sm text-gray-600">
                <strong>Year:</strong> {student.year}
              </p>
            </div>
          </div>

          {/* Personal Details Section */}
          <div className="">
            <div className="flex items-center justify-center">
              <h2 className="font-semibold text-purple-700">
                Student Information
              </h2>
            </div>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-purple-700 text-sm">
                  <strong>Name:</strong> {student.name}
                </p>
                <p className="text-purple-700 text-sm">
                  <strong>Roll Number:</strong> {student.rollNumber}
                </p>
                <p className="text-purple-700 text-sm">
                  <strong>Symbol Number:</strong> {student.symbolNumber}
                </p>
                <p className="text-purple-700 text-sm">
                  <strong>Grade:</strong> {student.grade}
                </p>
                <p className="text-purple-700 text-sm">
                  <strong>Exam:</strong> {student.exam}
                </p>
              </div>
              <div>
                <p className="text-purple-700 text-sm">
                  <strong>Attendance:</strong> {student.attendance}%
                </p>
                <p className="text-purple-700 text-sm">
                  <strong>DOB:</strong> 2058-08-18
                </p>
                <p className="text-purple-700 text-sm">
                  <strong>Parent name:</strong> Binod Singh
                </p>
                <p className="text-purple-700 text-sm">
                  <strong>Email:</strong> aksah@gmail.com
                </p>
                <p className="text-purple-700 text-sm">
                  <strong>Contact:</strong> 98989898989
                </p>
              </div>
            </div>
          </div>

          {/* Report Card Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">
              Subject Marks
            </h2>
            <table className="min-w-full mt-4 table-auto text-xs">
              <thead>
                <tr className="bg-purple-100 text-purple-700">
                  <th className="px-2 py-1 border">Subject</th>
                  <th className="px-2 py-1 border">Theory Full Marks</th>
                  <th className="px-2 py-1 border">Theory Obtained Marks</th>
                  <th className="px-2 py-1 border">Practical Full Marks</th>
                  <th className="px-2 py-1 border">Practical Obtained Marks</th>
                  <th className="px-2 py-1 border">Remarks</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject, index) => (
                  <tr key={index} className="border-b hover:bg-gray-100">
                    <td className="px-2 py-1">{subject.name}</td>
                    <td className="px-2 py-1">{subject.theory.fullMarks}</td>
                    <td className="px-2 py-1">
                      {subject.theory.obtainedMarks}
                    </td>
                    <td className="px-2 py-1">{subject.practical.fullMarks}</td>
                    <td className="px-2 py-1">
                      {subject.practical.obtainedMarks}
                    </td>
                    <td className="px-2 py-1">{subject.remarks}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Overall Marks and Remarks Section */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">
              Overall Summary
            </h2>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-purple-700">
                <p>
                  <strong>Total Full Marks:</strong> {totalFullMarks}
                </p>
                <p>
                  <strong>Total Obtained Marks:</strong> {totalObtainedMarks}
                </p>
                <p>
                  <strong>Percentage:</strong> {percentage}%
                </p>
                <p>
                  <strong>Overall Remarks:</strong> {overallRemarks}
                </p>
              </div>
              <div className="text-sm text-purple-700 font-semibold">
                <p>
                  <strong>Grade:</strong> {student.grade}
                </p>
                <p>
                  <strong>Remarks:</strong>{" "}
                  {overallRemarks === "Passed"
                    ? "Congratulations!"
                    : "Try Again!"}
                </p>
              </div>
            </div>
          </div>

          {/* Published Date and Signature Section */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              <p>
                <strong>Published Date:</strong> {currentDate}
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
      </div>
    </MainLayout>
  );
};

export default StudentReports;
