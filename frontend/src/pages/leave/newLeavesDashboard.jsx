import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { useSelector } from "react-redux";
import axios from "axios";

const LeavesDashboard = () => {
  const { access } = useSelector((state) => state.user);
  const [stats, setStats] = useState({
    totalPending: 0,
    totalApproved: 0,
    totalDisapproved: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchStats = async () => {
    if (!access) return;
    try {
      setLoading(true);
      // Example endpoint that returns all leave applications
      const { data } = await axios.get(
        "http://localhost:8000/api/total-leave-applications/",
        { headers: { Authorization: `Bearer ${access}` } }
      );

      const totalPending = data.filter((d) => d.status === "Pending").length;
      const totalApproved = data.filter((d) => d.status === "Approved").length;
      const totalDisapproved = data.filter((d) => d.status === "Disapproved").length;

      setStats({ totalPending, totalApproved, totalDisapproved });
      setLoading(false);
    } catch (err) {
      setError("Error fetching leave stats");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [access]);

  return (
    <MainLayout>
      <div className="p-6 bg-purple-50 min-h-screen">
        <h1 className="text-3xl font-bold text-purple-800 mb-6">Leaves Overview</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Pending */}
            <div className="bg-white p-4 rounded shadow flex flex-col items-center">
              <h2 className="text-gray-700 mb-1">Pending Leaves</h2>
              <p className="text-2xl font-bold text-yellow-600">{stats.totalPending}</p>
            </div>
            {/* Approved */}
            <div className="bg-white p-4 rounded shadow flex flex-col items-center">
              <h2 className="text-gray-700 mb-1">Approved Leaves</h2>
              <p className="text-2xl font-bold text-green-600">{stats.totalApproved}</p>
            </div>
            {/* Disapproved */}
            <div className="bg-white p-4 rounded shadow flex flex-col items-center">
              <h2 className="text-gray-700 mb-1">Disapproved Leaves</h2>
              <p className="text-2xl font-bold text-red-600">{stats.totalDisapproved}</p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default LeavesDashboard;
