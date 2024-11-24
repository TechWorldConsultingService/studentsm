import React, { useEffect, useState, useMemo } from "react";
import MainLayout from "../../layout/MainLayout";
import { Space, Table, Popconfirm, message, Spin } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";

const ViewLeave = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [leaveError, setLeaveError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [newRequests, setNewRequests] = useState([]);
  const [updatedRequests, setUpdatedRequests] = useState([]);
  const [role, setUserRole] = useState("");

  useEffect(() => {
    async function getLeaveData() {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("User is not authenticated. Please log in.");
        }

        const [leaveResponse, roleResponse] = await Promise.all([
          axios.get("http://localhost:8000/api/total-leave-applications/", {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get("http://localhost:8000/api/role/", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        const role = roleResponse.data.role;
        setUserRole(role);

        const data = leaveResponse.data;

        const newRequest = data.filter((leave) => leave.status === "Pending").sort((a, b) => new Date(b.applied_on) - new Date(a.applied_on));
        const updatedRequest = data
          .filter((leave) => leave.status !== "Pending")
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

        setLeaveData(data);
        setNewRequests(newRequest);
        setUpdatedRequests(updatedRequest);
      } catch (error) {
        setLeaveError(error.message || "Error fetching leave data");
      } finally {
        setIsLoading(false);
      }
    }

    getLeaveData();
    const intervalId = setInterval(getLeaveData, 9000);
    return () => clearInterval(intervalId);
  }, []);

  const handleStatusChange = async (leaveId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("User is not authenticated. Please log in.");
      }

      const response = await axios.patch(
        `http://localhost:8000/api/leave-applications/${leaveId}/update-status/`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data) {
        message.success(`Status updated to ${newStatus}`);
        setLeaveData((prevData) =>
          prevData.map((leave) =>
            leave.id === leaveId ? { ...leave, status: newStatus } : leave
          )
        );
      }
    } catch (error) {
      message.error("Error updating status. Please try again.");
    }
  };

  const getColumns = useMemo(
    () => (role) => [
      {
        title: "Applicant Name",
        dataIndex: "applicant_name",
      },
      {
        title: "Role",
        dataIndex: "applicant_type",
      },
      {
        title: "Applied Date",
        dataIndex: "applied_on",
        render: (date) => format(new Date(date), "dd MMM yyyy"),
      },
      {
        title: "Leave Date",
        dataIndex: "leave_date",
        render: (date) => format(new Date(date), "dd MMM yyyy"),
      },
      {
        title: "Message",
        dataIndex: "message",
      },
      ...(role === "student"
        ? [
            {
              title: "Status",
              dataIndex: "status",
            },
            {
              title: "Action",
              render: (_, record) => (
                <Space size="middle">
                  <Link to={`/leave-view/${record.id}`} className="text-lg text-blue-500">
                    View
                  </Link>
                </Space>
              ),
            },
          ]
        : [
            {
              title: "Action",
              render: (_, record) => (
                <Space size="middle">
                  <Link to={`/leave-view/${record.id}`} className="text-lg text-blue-500">
                    View
                  </Link>
                  {/* Only principals or teachers should see the approve/disapprove buttons */}
                  {(role === "principal" || (role === "teacher" && record.applicant_type === "Student")) && (
                    <>
                      <Popconfirm
                        title="Approve this request?"
                        onConfirm={() => handleStatusChange(record.id, "Approved")}
                        okText="Yes"
                        cancelText="No"
                      >
                        <button className="bg-green-700 text-white rounded-md shadow-md p-1.5 text-sm">
                          Approve
                        </button>
                      </Popconfirm>
                      <Popconfirm
                        title="Disapprove this request?"
                        onConfirm={() => handleStatusChange(record.id, "Disapproved")}
                        okText="Yes"
                        cancelText="No"
                      >
                        <button className="bg-red-700 text-white rounded-md shadow-md p-1.5 text-sm">
                          Disapprove
                        </button>
                      </Popconfirm>
                    </>
                  )}
                </Space>
              ),
            },
            {
              title: "Status",
              dataIndex: "status",
            },
          ]),
    ],
    []
  );

  return (
    <MainLayout>
      <div className="flex flex-col items-center gap-2 w-full">
        <h4 className="text-purple-800 font-semibold text-xl">Leave Requests</h4>
        {leaveError ? (
          <p>{leaveError}</p>
        ) : isLoading ? (
          <Spin size="large" />
        ) : (
          <>
            <h4 className="text-purple-800 font-semibold text-lg">New Requests</h4>
            {newRequests.length > 0 ? (
              <Table
                className="w-full"
                columns={getColumns(role)}
                dataSource={newRequests}
                rowKey="id"
              />
            ) : (
              <p>No new leave requests found.</p>
            )}
            {updatedRequests.length > 0 && (
              <>
                <h4 className="text-purple-800 font-semibold text-lg">Reviewed Requests</h4>
                <Table
                  className="w-full"
                  columns={getColumns(role)}
                  dataSource={updatedRequests}
                  rowKey="id"
                />
              </>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ViewLeave;
