import React, { useEffect, useState } from "react";
import axios from "axios";  
import { useSelector } from "react-redux";

import MainLayout from "../layout/MainLayout";
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

// Fee Collection by Class Data
const feesData = [
  { name: "Class 1", collected: 5200, outstanding: 180 },
  { name: "Class 2", collected: 4800, outstanding: 250 },
  { name: "Class 3", collected: 5500, outstanding: 120 },
  { name: "Class 4", collected: 5000, outstanding: 300 },
  { name: "Class 5", collected: 5300, outstanding: 200 },
];

// Monthly Fee Collection Data
const monthlyFeeData = [
  { month: "Jan", collected: 26000 },
  { month: "Feb", collected: 28000 },
  { month: "Mar", collected: 31000 },
  { month: "Apr", collected: 29000 },
  { month: "May", collected: 33000 },
  { month: "Jun", collected: 32000 },
  { month: "Jul", collected: 34000 },
];

// Fee Breakdown Data
const feeBreakdownData = [
  { name: "Tuition", value: 65 },
  { name: "Transport", value: 15 },
  { name: "Lab", value: 10 },
  { name: "Misc", value: 10 },
];

const COLORS = ["#2B6CB0", "#2C7A7B", "#9B2C2C", "#718096"];

// Quick Stats for Accountant Dashboard
const statsData = [
  { label: "Total Fees Collected", value: "$280,000" },
  { label: "Total Outstanding", value: "$18,000" },
  { label: "Transactions", value: 1500 },
  { label: "Refunds Processed", value: 45 },
  { label: "Pending Refunds", value: 5 },
];

// Financial Tools / Quick Actions
const quickActions = [
  {
    title: "Record Payment",
    description: "Enter new fee payment details",
  },
  {
    title: "Issue Refund",
    description: "Process student refund requests",
  },
  {
    title: "Generate Report",
    description: "Download monthly financial summary",
  },
  {
    title: "View Receipts",
    description: "Access and verify payment receipts",
  },
  {
    title: "Manage Dues",
    description: "Track outstanding fee dues",
  },
  {
    title: "Update Fees",
    description: "Modify fee and discount details",
  },
];

// Recent Financial Activities
const financialActivities = [
  {
    id: 1,
    title: "Payment Received",
    date: "2025-02-16",
    description: "Received $500 from Class 1.",
  },
  {
    id: 2,
    title: "Refund Processed",
    date: "2025-02-17",
    description: "Processed a $100 refund for Class 3.",
  },
  {
    id: 3,
    title: "Dues Updated",
    date: "2025-02-18",
    description: "Revised outstanding fees for Class 2.",
  },
];

// Pending Tasks for Accountant
const tasks = [
  { id: 1, task: "Verify transaction #2345", status: "Pending" },
  { id: 2, task: "Reconcile bank statement", status: "In Progress" },
  { id: 3, task: "Review refund approvals", status: "Completed" },
];

const AccountantDashboard = () => {
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { access } = useSelector((state) => state.user);

  // Fetch data from API
  useEffect(() => {
    const fetchFinanceSummary = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/finance-summary/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
        setFinanceData(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching finance summary:", err);
        setError("Failed to load finance data.");
        setLoading(false);
      }
    };

    fetchFinanceSummary();
  }, []);

  // Loading state
  if (loading) {
    return <div className="p-6 text-center text-gray-700">Loading financial data...</div>;
  }

  // Error state
  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <MainLayout>
      <div className="p-4 w-full h-full bg-gray-50">
        {/* Hero Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-6 border-l-4 border-blue-600">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Welcome, Accountant!
          </h1>
          <p className="text-gray-600">
            Your financial dashboard provides a snapshot of the school's revenue,
            dues, and transactions.
          </p>
        </div>

        {/* Quick Stats */}
        {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          {statsData.map((stat, index) => (
            <div
              key={index}
              className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center border-t-2 border-blue-600"
            >
              <span className="text-sm text-gray-500">{stat.label}</span>
              <span className="text-2xl font-bold text-blue-700">
                {stat.value}
              </span>
            </div>
          ))}
        </div> */}
        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center border-t-2 border-blue-600">
            <span className="text-sm text-gray-500">Total Fees Collected</span>
            <span className="text-2xl font-bold text-blue-700">${financeData?.total_fees_collected}</span>
          </div>

          <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center border-t-2 border-blue-600">
            <span className="text-sm text-gray-500">Total Outstanding</span>
            <span className="text-2xl font-bold text-red-700">${financeData?.total_outstanding_amount}</span>
          </div>

          <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center border-t-2 border-blue-600">
            <span className="text-sm text-gray-500">Transactions</span>
            <span className="text-2xl font-bold text-blue-700">{financeData?.total_transaction_count}</span>
          </div>

          <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center border-t-2 border-blue-600">
            <span className="text-sm text-gray-500">Refunds Processed</span>
            {/* <span className="text-2xl font-bold text-green-700">{financeData.refunds_processed}</span> */}
            <span className="text-2xl font-bold text-green-700">0</span>
          </div>

          <div className="bg-white shadow rounded-lg p-4 flex flex-col items-center justify-center border-t-2 border-blue-600">
            <span className="text-sm text-gray-500">Pending Refunds</span>
            {/* <span className="text-2xl font-bold text-yellow-700">{financeData.pending_refunds}</span> */}
            <span className="text-2xl font-bold text-yellow-700">0</span>
          </div>
        </div>

        {/* Charts Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Fee Collection by Class Bar Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Fee Collection by Class
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={feesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="collected" fill="#2B6CB0" name="Collected" />
                <Bar dataKey="outstanding" fill="#E53E3E" name="Outstanding" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Monthly Fee Collection Line Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Monthly Fee Collection
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyFeeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="collected"
                  stroke="#2C7A7B"
                  strokeWidth={2}
                  activeDot={{ r: 8 }}
                  name="Collected"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Fee Breakdown Pie Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Fee Breakdown
            </h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={feeBreakdownData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={100}
                  fill="#2B6CB0"
                  label
                >
                  {feeBreakdownData.map((entry, index) => (
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

        {/* Financial Tools / Quick Actions */}
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Financial Tools
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions.map((action, i) => (
              <div
                key={i}
                className="bg-blue-50 hover:bg-blue-100 cursor-pointer border border-blue-200 rounded-lg p-4 text-center transition-all"
              >
                <p className="font-bold text-blue-700">{action.title}</p>
                <p className="text-sm text-gray-600 mt-1">
                  {action.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Financial Activities & Pending Tasks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Financial Activities */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Recent Financial Activities
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
                  {financialActivities.map((activity) => (
                    <tr
                      key={activity.id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="p-3">{activity.title}</td>
                      <td className="p-3">{activity.date}</td>
                      <td className="p-3">{activity.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pending Tasks */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Pending Tasks
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

export default AccountantDashboard;
