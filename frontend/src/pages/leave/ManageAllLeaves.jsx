import React, { useEffect, useState, useMemo } from "react";
import MainLayout from "../../layout/MainLayout";
import { Table, message, Spin, Space } from "antd";
import axios from "axios";
import { format } from "date-fns";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

// Our modals
import ViewLeaveModal from "./ViewLeaveModal";
import ConfirmationModal from "./ConfirmationModal";
import EditStatusModal from "./EditStatusModal";

const ManageAllLeaves = () => {
  const { access } = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [leaveError, setLeaveError] = useState("");

  const [leaveData, setLeaveData] = useState([]);
  const [newRequests, setNewRequests] = useState([]);
  const [updatedRequests, setUpdatedRequests] = useState([]);
  const [userRole, setUserRole] = useState("");

  // Modals
  const [showViewModal, setShowViewModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showEditStatusModal, setShowEditStatusModal] = useState(false);

  const [selectedLeave, setSelectedLeave] = useState(null);
  const [confirmAction, setConfirmAction] = useState(""); // "Approved" or "Disapproved"

  useEffect(() => {
    async function loadData() {
      try {
        setIsLoading(true);
        if (!access) {
          throw new Error("User is not authenticated. Please log in.");
        }

        const [leaveRes, roleRes] = await Promise.all([
          axios.get("http://localhost:8000/api/total-leave-applications/", {
            headers: { Authorization: `Bearer ${access}` },
          }),
          axios.get("http://localhost:8000/api/role/", {
            headers: { Authorization: `Bearer ${access}` },
          }),
        ]);

        const data = leaveRes.data;
        setUserRole(roleRes.data.role || "");

        const pending = data
          .filter((leave) => leave.status === "Pending")
          .sort((a, b) => new Date(b.applied_on) - new Date(a.applied_on));

        const reviewed = data
          .filter((leave) => leave.status !== "Pending")
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        setLeaveData(data);
        setNewRequests(pending);
        setUpdatedRequests(reviewed);
      } catch (err) {
        setLeaveError(err.message || "Error fetching leave data");
      } finally {
        setIsLoading(false);
      }
    }

    loadData();
    // eslint-disable-next-line
  }, [access]);

  // =============== ACTION HANDLERS ===============
  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      if (!access) return;

      await axios.patch(
        `http://localhost:8000/api/leave-applications/${leaveId}/update-status/`,
        { status: newStatus },
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );
      message.success(`Status updated to ${newStatus}`);

      // Update local state
      setLeaveData((prev) =>
        prev.map((l) => (l.id === leaveId ? { ...l, status: newStatus } : l))
      );
      setNewRequests((prev) =>
        prev.map((l) => (l.id === leaveId ? { ...l, status: newStatus } : l))
      );
      setUpdatedRequests((prev) =>
        prev.map((l) => (l.id === leaveId ? { ...l, status: newStatus } : l))
      );
    } catch (err) {
      message.error("Error updating status.");
    }
  };

  // Confirmation modal "Yes"
  const handleConfirmAction = async () => {
    if (!selectedLeave || !confirmAction) return;
    await handleStatusChange(selectedLeave.id, confirmAction);
    setShowConfirmModal(false);
    setSelectedLeave(null);
    setConfirmAction("");
  };

  // For editing an already Approved/Disapproved request's status
  const handleUpdateStatus = (leaveId, newStatus) => {
    handleStatusChange(leaveId, newStatus);
    toast.success("Status updated successfully.");
  };

  // =============== TABLE COLUMNS ===============
  const buildColumns = useMemo(() => {
    return (role) => [
      {
        title: "Applicant",
        dataIndex: "applicant_name",
      },
      {
        title: "Role",
        dataIndex: "applicant_type",
      },
      {
        title: "Applied On",
        dataIndex: "applied_on",
        render: (val) => format(new Date(val), "yyyy-MM-dd"),
      },
      {
        title: "Leave Date",
        dataIndex: "leave_date",
        render: (val) => format(new Date(val), "yyyy-MM-dd"),
      },
      {
        title: "Message",
        dataIndex: "message",
      },
      {
        title: "Action",
        render: (_, record) => {
          const isStudentLeave = record.applicant_type === "Student";
          // Show Approve/Disapprove if principal or (teacher & student leave)
          const canApproveOrDisapprove =
            role === "principal" || (role === "teacher" && isStudentLeave);

          // "Edit Status" only if record.status is Approved or Disapproved
          const canEdit =
            record.status === "Approved" || record.status === "Disapproved";

          return (
            <Space wrap>
              {/* View */}
              <button
                onClick={() => {
                  setSelectedLeave(record);
                  setShowViewModal(true);
                }}
                className="bg-purple-700 text-white px-3 py-1 rounded hover:bg-purple-800"
              >
                View
              </button>

              {/* Approve/Disapprove for pending leaves */}
              {canApproveOrDisapprove && record.status === "Pending" && (
                <>
                  <button
                    onClick={() => {
                      setSelectedLeave(record);
                      setConfirmAction("Approved");
                      setShowConfirmModal(true);
                    }}
                    className="bg-green-700 text-white px-3 py-1 rounded hover:bg-green-800"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      setSelectedLeave(record);
                      setConfirmAction("Disapproved");
                      setShowConfirmModal(true);
                    }}
                    className="bg-red-700 text-white px-3 py-1 rounded hover:bg-red-800"
                  >
                    Disapprove
                  </button>
                </>
              )}

              {/* Edit Status if Already Approved or Disapproved */}
              {canEdit && (
                <button
                  onClick={() => {
                    setSelectedLeave(record);
                    setShowEditStatusModal(true);
                  }}
                  className="bg-blue-700 text-white px-3 py-1 rounded hover:bg-blue-800"
                >
                  Edit Status
                </button>
              )}
            </Space>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "status",
      },
    ];
  }, []);

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Manage Leaves</h1>
          {leaveError && <p className="mt-2 text-red-500">{leaveError}</p>}

          {isLoading ? (
            <div className="mt-6 text-center">
              <Spin size="large" />
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-purple-800 mt-6">New Requests</h2>
              {newRequests.length > 0 ? (
                <Table
                  className="mt-4"
                  columns={buildColumns(userRole)}
                  dataSource={newRequests}
                  rowKey="id"
                />
              ) : (
                <p className="mt-4 text-gray-600">No new leave requests found.</p>
              )}

              {updatedRequests.length > 0 && (
                <>
                  <h2 className="text-2xl font-bold text-purple-800 mt-6">
                    Reviewed Requests
                  </h2>
                  <Table
                    className="mt-4"
                    columns={buildColumns(userRole)}
                    dataSource={updatedRequests}
                    rowKey="id"
                  />
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* ========== View Leave Modal ========== */}
      <ViewLeaveModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        leaveRecord={selectedLeave}
      />

      {/* ========== Approve/Disapprove Confirmation Modal ========== */}
      <ConfirmationModal
        isOpen={showConfirmModal}
        onClose={() => {
          setShowConfirmModal(false);
          setConfirmAction("");
        }}
        onConfirm={handleConfirmAction}
        actionName={confirmAction === "Approved" ? "Approve" : "Disapprove"}
      />

      {/* ========== Edit Status Modal (Approved <-> Disapproved) ========== */}
      <EditStatusModal
        isOpen={showEditStatusModal}
        onClose={() => setShowEditStatusModal(false)}
        leaveRecord={selectedLeave}
        onUpdateStatus={handleUpdateStatus}
      />
    </MainLayout>
  );
};

export default ManageAllLeaves;
