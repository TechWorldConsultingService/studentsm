import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { useSelector } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// Sample Data
const attendanceData = [
  { name: "Class 1", present: 40, absent: 5 },
  { name: "Class 2", present: 35, absent: 10 },
  { name: "Class 3", present: 50, absent: 8 },
  { name: "Class 4", present: 38, absent: 7 },
  { name: "Class 5", present: 42, absent: 6 },
];

const monthlyAdmissionsData = [
  { month: "Jan", admissions: 30 },
  { month: "Feb", admissions: 45 },
  { month: "Mar", admissions: 60 },
  { month: "Apr", admissions: 50 },
  { month: "May", admissions: 70 },
  { month: "Jun", admissions: 65 },
  { month: "Jul", admissions: 75 },
];

const staffDistributionData = [
  { name: "Teachers", value: 45 },
  { name: "Admin Staff", value: 15 },
  { name: "Support Staff", value: 20 },
  { name: "Management", value: 5 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

// Quick Stats
// const statsData = [
//   { label: "Total Students", value: 1200 },
//   { label: "Total Teachers", value: 45 },
//   { label: "Total Subject", value: 30 },
//   { label: "Total Class", value: 5 },
//   { label: "pending_leaves", value: 2 },
// ];

const quickActions = [
  {
    title: "Manage Teachers",
    description: "View, add, or update teacher records",
  },
  {
    title: "Manage Students",
    description: "Enroll, update or delete student records",
  },
  {
    title: "Approve Leaves",
    description: "View and approve leave requests",
  },
  {
    title: "Manage Classes",
    description: "Create or update class sections and timetables",
  },
  {
    title: "Finance/Fees",
    description: "Track fee payments and other financial records",
  },
  {
    title: "School Notices",
    description: "Broadcast notices to students and staff",
  },
];

// Announcements
const announcements = [
  {
    id: 1,
    title: "Annual Sports Day",
    date: "2025-02-15",
    description: "All classes to participate in sports events.",
  },
  {
    id: 2,
    title: "Midterm Exam Schedule",
    date: "2025-02-20",
    description: "Midterm exams for all classes start next week.",
  },
  {
    id: 3,
    title: "Workshop on Teaching Tech",
    date: "2025-02-25",
    description: "Workshop for teachers on integrating technology in lessons.",
  },
];

// Tasks (To-Do) Section
const tasks = [
  { id: 1, task: "Approve Class 5 field trip request", status: "Pending" },
  { id: 2, task: "Review Monthly Budget", status: "In Progress" },
  { id: 3, task: "Prepare Staff Meeting Agenda", status: "Completed" },
];

const PrincipalHomePage = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { access } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchPrincipalDashboardSummary = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/dashboard-stats/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching Dashboard summary:", err);
        setError("Failed to load Dashboard data.");
        setLoading(false);
      }
    };

    fetchPrincipalDashboardSummary();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  return (
    <MainLayout>
      <div className="p-4 w-full h-full bg-gray-100">
        {/* Hero Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, Principal!
          </h1>
          <p className="text-gray-600">
            This is your all-in-one dashboard for managing school operations.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <Link
            to={`/studentList`}
            className="text-purple-700  hover:no-underline"
          >
            <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center group-hover:bg-gray-200">
              <span className="text-sm text-gray-500">Total Students</span>
              <span className="text-2xl font-bold text-purple-700">
                {dashboardData?.total_students}
              </span>
            </div>
          </Link>

          <Link to={`/teacherList`} className="text-purple-700 hover:underline">
            <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Total Teachers</span>
              <span className="text-2xl font-bold text-purple-700">
                {dashboardData?.total_teachers}
              </span>
            </div>
          </Link>

          <Link to={`/subjectList`} className="text-purple-700 hover:underline">
            <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Total Subjects</span>
              <span className="text-2xl font-bold text-purple-700">
                {dashboardData?.total_subjects}
              </span>
            </div>
          </Link>

          <Link to={`/classList`} className="text-purple-700 hover:underline">
            <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Total Classes</span>
              <span className="text-2xl font-bold text-purple-700">
                {dashboardData?.total_classes}
              </span>
            </div>
          </Link>

          <Link
            to={`/manage-leaves`}
            className="text-purple-700 hover:underline"
          >
            <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center">
              <span className="text-sm text-gray-500">Pending Leaves</span>
              <span className="text-2xl font-bold text-purple-700">
                {dashboardData?.pending_leaves}
              </span>
            </div>
          </Link>
        </div>

        {/* Charts Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Attendance Bar Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Class Attendance
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={attendanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="absent" fill="#f87171" name="Absent" />
                <Bar dataKey="present" fill="#34d399" name="Present" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Admissions Line Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Monthly Admissions
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyAdmissionsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="admissions"
                  stroke="#8884d8"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="Admissions"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Staff Distribution Pie Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Staff Distribution
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={staffDistributionData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  fill="#8884d8"
                  label
                >
                  {staffDistributionData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, i) => (
              <div
                key={i}
                className="bg-purple-50 hover:bg-purple-100 cursor-pointer border border-purple-100 rounded-lg p-4 text-center transition-all"
              >
                <p className="font-bold text-purple-700">{action.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Announcements & Tasks (Split into two columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Announcements */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Announcements
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="p-3 text-gray-600">Title</th>
                    <th className="p-3 text-gray-600">Date</th>
                    <th className="p-3 text-gray-600">Description</th>
                  </tr>
                </thead>
                <tbody>
                  {announcements.map((announcement) => (
                    <tr
                      key={announcement.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">{announcement.title}</td>
                      <td className="p-3">{announcement.date}</td>
                      <td className="p-3">{announcement.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Admin Tasks / To-Do */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Your Tasks
            </h3>
            <ul>
              {tasks.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between py-2 border-b last:border-b-0"
                >
                  <div className="text-gray-700">{item.task}</div>
                  <div
                    className={`text-sm font-semibold px-2 py-1 rounded ${
                      item.status === "Pending"
                        ? "bg-red-100 text-red-700"
                        : item.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {item.status}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PrincipalHomePage;
