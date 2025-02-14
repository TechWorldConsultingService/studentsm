import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import axios from "axios";
import { useSelector } from "react-redux";
import { format } from "date-fns";

const ManageLeaves = () => {
  const { access } = useSelector((state) => state.user);

  const [role, setRole] = useState("");
  const [leaveError, setLeaveError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [leaveData, setLeaveData] = useState([]);
  const [newRequests, setNewRequests] = useState([]);
  const [updatedRequests, setUpdatedRequests] = useState([]);

  // For viewing details in a modal
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [detailRecord, setDetailRecord] = useState(null);

  const fetchLeaves = async () => {
    try {
      setIsLoading(true);
      if (!access) throw new Error("User not authenticated");

      // Fetch role
      const roleRes = await axios.get("http://localhost:8000/api/role/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      setRole(roleRes.data.role);

      // Fetch all leaves
      const leavesRes = await axios.get(
        "http://localhost:8000/api/total-leave-applications/",
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );

      let data = leavesRes.data || [];

      // Filter for teacher => see only student leaves
      if (roleRes.data.role === "teacher") {
        data = data.filter((leave) => leave.applicant_type === "Student");
      }
      // If principal => can see teacher + students (here we keep all data)

      const pending = data
        .filter((l) => l.status === "Pending")
        .sort((a, b) => new Date(b.applied_on) - new Date(a.applied_on));
      const reviewed = data
        .filter((l) => l.status !== "Pending")
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      setLeaveData(data);
      setNewRequests(pending);
      setUpdatedRequests(reviewed);
    } catch (err) {
      setLeaveError(err.message || "Error fetching leaves");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApproveOrDisapprove = async (id, newStatus) => {
    if (!access) {
      setLeaveError("Not authenticated");
      return;
    }
    // Simple confirm using window.confirm
    const confirmMsg =
      newStatus === "Approved"
        ? "Are you sure you want to approve?"
        : "Are you sure you want to disapprove?";
    const confirmAction = window.confirm(confirmMsg);
    if (!confirmAction) return;

    try {
      await axios.patch(
        `http://localhost:8000/api/leave-applications/${id}/update-status/`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );
      // Refresh data
      fetchLeaves();
    } catch (err) {
      setLeaveError("Error updating leave status");
    }
  };

  const handleViewDetail = (record) => {
    setDetailRecord(record);
    setDetailModalOpen(true);
  };

  return (
    <MainLayout>
      <div className="p-4 bg-purple-50 min-h-screen">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Manage Leaves</h2>
        {leaveError && <p className="text-red-500 mb-2">{leaveError}</p>}
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* Pending Requests */}
            <section className="mb-6">
              <h3 className="text-lg font-semibold text-purple-700">New Requests (Pending)</h3>
              {newRequests.length > 0 ? (
                <div className="overflow-x-auto mt-3">
                  <table className="min-w-full bg-white shadow rounded-lg">
                    <thead className="bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="p-3 text-left text-sm font-semibold">Applicant</th>
                        <th className="p-3 text-left text-sm font-semibold">Role</th>
                        <th className="p-3 text-left text-sm font-semibold">Applied On</th>
                        <th className="p-3 text-left text-sm font-semibold">Leave Date</th>
                        <th className="p-3 text-left text-sm font-semibold">Status</th>
                        <th className="p-3 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {newRequests.map((req) => (
                        <tr key={req.id} className="border-b last:border-0">
                          <td className="p-3 text-sm">{req.applicant_name}</td>
                          <td className="p-3 text-sm">{req.applicant_type}</td>
                          <td className="p-3 text-sm">
                            {format(new Date(req.applied_on), "dd MMM yyyy")}
                          </td>
                          <td className="p-3 text-sm">
                            {format(new Date(req.leave_date), "dd MMM yyyy")}
                          </td>
                          <td className="p-3 text-sm">{req.status}</td>
                          <td className="p-3 text-sm">
                            <button
                              onClick={() => handleViewDetail(req)}
                              className="text-blue-600 underline mr-3"
                            >
                              View
                            </button>
                            {(role === "principal" ||
                              (role === "teacher" &&
                                req.applicant_type === "Student")) && (
                              <>
                                <button
                                  onClick={() =>
                                    handleApproveOrDisapprove(req.id, "Approved")
                                  }
                                  className="text-white bg-green-600 px-2 py-1 rounded mr-2"
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() =>
                                    handleApproveOrDisapprove(req.id, "Disapproved")
                                  }
                                  className="text-white bg-red-600 px-2 py-1 rounded"
                                >
                                  Disapprove
                                </button>
                              </>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-2 text-gray-600">No new requests.</p>
              )}
            </section>

            {/* Reviewed Requests */}
            <section>
              <h3 className="text-lg font-semibold text-purple-700">Reviewed Requests</h3>
              {updatedRequests.length > 0 ? (
                <div className="overflow-x-auto mt-3">
                  <table className="min-w-full bg-white shadow rounded-lg">
                    <thead className="bg-gray-100 border-b border-gray-300">
                      <tr>
                        <th className="p-3 text-left text-sm font-semibold">Applicant</th>
                        <th className="p-3 text-left text-sm font-semibold">Role</th>
                        <th className="p-3 text-left text-sm font-semibold">Applied On</th>
                        <th className="p-3 text-left text-sm font-semibold">Leave Date</th>
                        <th className="p-3 text-left text-sm font-semibold">Status</th>
                        <th className="p-3 text-left text-sm font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {updatedRequests.map((req) => (
                        <tr key={req.id} className="border-b last:border-0">
                          <td className="p-3 text-sm">{req.applicant_name}</td>
                          <td className="p-3 text-sm">{req.applicant_type}</td>
                          <td className="p-3 text-sm">
                            {format(new Date(req.applied_on), "dd MMM yyyy")}
                          </td>
                          <td className="p-3 text-sm">
                            {format(new Date(req.leave_date), "dd MMM yyyy")}
                          </td>
                          <td className="p-3 text-sm">{req.status}</td>
                          <td className="p-3 text-sm">
                            <button
                              onClick={() => handleViewDetail(req)}
                              className="text-blue-600 underline"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="mt-2 text-gray-600">No reviewed requests.</p>
              )}
            </section>
          </>
        )}

        {/* Detail Modal */}
        {detailModalOpen && detailRecord && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-white rounded shadow p-6 w-11/12 md:w-1/2 relative">
              <button
                onClick={() => setDetailModalOpen(false)}
                className="absolute top-2 right-2 text-gray-600 hover:text-black"
              >
                ✕
              </button>
              <h2 className="text-xl font-semibold text-purple-800 mb-4">Leave Details</h2>
              <p>
                <strong>Applicant:</strong> {detailRecord.applicant_name}
              </p>
              <p>
                <strong>Role:</strong> {detailRecord.applicant_type}
              </p>
              <p>
                <strong>Applied On:</strong>{" "}
                {format(new Date(detailRecord.applied_on), "dd MMM yyyy")}
              </p>
              <p>
                <strong>Leave Date:</strong>{" "}
                {format(new Date(detailRecord.leave_date), "dd MMM yyyy")}
              </p>
              <p>
                <strong>Message:</strong> {detailRecord.message}
              </p>
              <p>
                <strong>Status:</strong> {detailRecord.status}
              </p>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default ManageLeaves;
