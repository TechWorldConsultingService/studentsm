import React, { useState, useEffect } from "react";
import MainLayout from "../../layout/MainLayout";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";



const StudentRoutine = () => {
  const { access } = useSelector((state) => state.user);
  const [exams, setExams] = useState([]);
    const [loading, setLoading] = useState(false);


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

  // Sample Exam Routine Data
  const examSchedule = [
    {
      subject: "Mathematics",
      date: "2025-03-10",
      time: "9:00 AM - 12:00 PM",
      location: "Room 101",
    },
    {
      subject: "Science",
      date: "2025-03-12",
      time: "1:00 PM - 4:00 PM",
      location: "Room 102",
    },
    {
      subject: "English",
      date: "2025-03-14",
      time: "9:00 AM - 12:00 PM",
      location: "Room 103",
    },
    {
      subject: "Social Studies",
      date: "2025-03-16",
      time: "1:00 PM - 4:00 PM",
      location: "Room 104",
    },
  ];

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800 mb-6">Exam Routine</h1>

          {/* Exam Routine Table */}
          <table className="min-w-full mt-4 table-auto text-sm">
            <thead>
              <tr className="bg-purple-100 text-purple-700">
                <th className="px-4 py-2 border">Subject</th>
                <th className="px-4 py-2 border">Date</th>
                <th className="px-4 py-2 border">Time</th>
                <th className="px-4 py-2 border">Location</th>
              </tr>
            </thead>
            <tbody>
              {examSchedule.map((exam, index) => (
                <tr key={index} className="border-b hover:bg-gray-100">
                  <td className="px-4 py-2">{exam.subject}</td>
                  <td className="px-4 py-2">{exam.date}</td>
                  <td className="px-4 py-2">{exam.time}</td>
                  <td className="px-4 py-2">{exam.location}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer Section */}
          <div className="mt-6 text-sm text-gray-600">
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
