import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { Space, Table } from "antd";
import axios from "axios";
import toast from "react-hot-toast";
import moment from "moment";
import { useSelector } from "react-redux";

// Modals
import ApplyLeaveModal from "./ApplyLeaveModal";
import EditLeaveModal from "./EditLeaveModal";
import ViewLeaveModal from "./ViewLeaveModal";

const MyLeaves = () => {
  const { access } = useSelector((state) => state.user);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [leaveData, setLeaveData] = useState([]);
  const [newRequests, setNewRequests] = useState([]);
  const [updatedRequests, setUpdatedRequests] = useState([]);

  // Modal states
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // For the record we are viewing or editing
  const [selectedRecord, setSelectedRecord] = useState(null);

  // Fetch self-applied leaves
  const fetchLeaveData = async () => {
    if (!access) {
      setErrorMessage("User is not authenticated. Please log in.");
      return;
    }
    try {
      setIsLoading(true);
      const res = await axios.get("http://localhost:8000/api/leave-applications/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });

      const data = res.data;
      const pending = data.filter((item) => item.status === "Pending");
      const reviewed = data.filter((item) => item.status !== "Pending");

      setLeaveData(data);
      setNewRequests(pending);
      setUpdatedRequests(
        reviewed.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
      );
    } catch (err) {
      console.error(err);
      setErrorMessage("Failed to fetch leave data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, [access]);


  // (A) Apply Leave
  const handleApplyLeave = (leave_date, message) => {
    if (!access) return;
    axios
      .post(
        "http://localhost:8000/api/leave-applications/create/",
        { leave_date, message },
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      )
      .then(() => {
        toast.success("Leave applied successfully.");
        fetchLeaveData();
      })
      .catch(() => {
        toast.error("Error applying leave.");
      });
  };

  // (B) Delete Leave
  const handleDeleteLeave = async (id) => {
    if (!access) return;
    try {
      await axios.delete(`http://localhost:8000/api/leave-applications/${id}/`, {
        headers: { Authorization: `Bearer ${access}` },
      });
      toast.success("Leave deleted successfully.");
      fetchLeaveData();
    } catch (error) {
      toast.error("Failed to delete leave.");
    }
  };

  // (C) Update Leave
  const handleUpdateLeave = (id, leave_date, message) => {
    if (!access) return;
    axios
      .put(
        `http://localhost:8000/api/leave-applications/${id}/`,
        { leave_date, message },
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      )
      .then(() => {
        toast.success("Leave updated successfully.");
        fetchLeaveData();
      })
      .catch(() => {
        toast.error("Error updating leave.");
      });
  };

  // TABLE COLUMNS
  const pendingColumns = [
    {
      title: "Applied On",
      dataIndex: "applied_on",
      render: (value) => moment(value).format("YYYY-MM-DD"),
    },
    {
      title: "Leave Date",
      dataIndex: "leave_date",
      render: (value) => moment(value).format("YYYY-MM-DD"),
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <button
            onClick={() => {
              setSelectedRecord(record);
              setShowViewModal(true);
            }}
            className="text-purple-700 underline"
          >
            View
          </button>
          <button
            onClick={() => {
              setSelectedRecord(record);
              setShowEditModal(true);
            }}
            className="bg-purple-700 text-white px-3 py-1 rounded"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteLeave(record.id)}
            className="bg-red-700 text-white px-3 py-1 rounded"
          >
            Delete
          </button>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const reviewedColumns = [
    {
      title: "Leave Date",
      dataIndex: "leave_date",
      render: (value) => moment(value).format("YYYY-MM-DD"),
    },
    {
      title: "Reviewed On",
      dataIndex: "updated_at",
      render: (value) => moment(value).format("YYYY-MM-DD"),
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space>
          <button
            onClick={() => {
              setSelectedRecord(record);
              setShowViewModal(true);
            }}
            className="text-purple-700 underline"
          >
            View
          </button>
          {/* Usually you don't edit after it's approved or disapproved, 
              but if you want to allow partial changes, show an Edit button or not.
              We'll leave it out for reviewed leaves in MyLeaves. 
              If you DO want it, just add the same pattern as above. */}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">My Leaves</h1>
          <p className="mt-1 text-gray-600">Manage your leave requests.</p>

          {errorMessage && (
            <p className="mt-2 text-red-500">{errorMessage}</p>
          )}

          <div className="text-right my-4">
            <button
              onClick={() => setShowApplyModal(true)}
              className="bg-purple-700 text-white px-6 py-2 rounded hover:bg-purple-800"
            >
              Apply For Leave
            </button>
          </div>

          {isLoading ? (
            <p className="text-gray-600">Loading...</p>
          ) : (
            <>
              <h3 className="text-xl font-bold text-purple-800">Pending Requests</h3>
              {newRequests.length > 0 ? (
                <Table
                  dataSource={newRequests}
                  columns={pendingColumns}
                  rowKey="id"
                  className="mt-4"
                />  
              ) : (
                <p className="mt-2 text-gray-600">No pending leaves found.</p>
              )}

              <h3 className="text-xl font-bold text-purple-800 mt-8">Reviewed Requestss</h3>
              {updatedRequests.length > 0 ? (
                <Table
                  dataSource={updatedRequests}
                  columns={reviewedColumns}
                  rowKey="id"
                  className="mt-4"
                />
              ) : (
                <p className="mt-2 text-gray-600">No reviewed leaves found.</p>
              )}
            </>
          )}
        </div>
      </div>

      {/*  Modals: Apply, Edit, View  */}
      <ApplyLeaveModal
        isOpen={showApplyModal}
        onClose={() => setShowApplyModal(false)}
        onApplyLeave={handleApplyLeave}
      />

      <EditLeaveModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        leaveRecord={selectedRecord}
        onUpdateLeave={handleUpdateLeave}
      />

      <ViewLeaveModal
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
        leaveRecord={selectedRecord}
      />
    </MainLayout>
  );
};

export default MyLeaves;
