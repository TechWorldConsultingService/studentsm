import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { Space, Table, Input, Button, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { RiDeleteBin5Line } from "react-icons/ri";
import toast from "react-hot-toast";
import moment from "moment"; // Import moment.js for date handling
import { useSelector } from "react-redux";



const Myleave = () => {
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newRequests, setNewRequests] = useState([]);
  const [updatedRequests, setUpdatedRequests] = useState([]);
  const [editLeaveId, setEditLeaveId] = useState(null); // Store the leave ID to edit
  const [editedLeaveDate, setEditedLeaveDate] = useState(null); // Store the new leave date
  const [editedMessage, setEditedMessage] = useState(""); // Store the new message

  const {access} = useSelector((state) => state.user);

  // Fetch self-applied leave data
  const fetchLeaveData = async () => {
    if (!access) {
      setErrorMessage("User is not authenticated. Please Login.");
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        "http://localhost:8000/api/leave-applications/",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      const newRequest = data.filter((leave) => leave.status === "Pending");
      const updatedRequest = data
        .filter(
          (leave) =>
            leave.status === "Approved" || leave.status === "Disapproved"
        )
        .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

      if (data) {
        setLeaveData(data);
        setNewRequests(newRequest);
        setUpdatedRequests(updatedRequest);
      }
    } catch (error) {
      console.error("Error fetching leave data:", error);
      setErrorMessage("Error fetching leave data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaveData();
  }, [access]);

  // Handle  to apply leave page
  const handleApplyLeave = () => {
    navigate("/applyLeave");
  };

  const newRequestscolumns = [
    {
      title: "Applied Date",
      dataIndex: "applied_on",
    },
    {
      title: "Leave Date",
      dataIndex: "leave_date",
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space size="middle">
          <Link
            to={`/leave-view/${record.id}`}
            className="text-lg text-blue-500"
          >
            View
          </Link>
          <button
            onClick={() =>
              handleEditLeave(record.id, record.leave_date, record.message)
            }
            className="bg-blue-700 text-white rounded-md shadow-md p-1.5 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteLeave(record.id)}
            className="bg-red-700 text-white rounded-md shadow-md p-1.5 text-lg"
          >
            <RiDeleteBin5Line />
          </button>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const updatedRequestsColumns = [
    {
      title: "Leave Date",
      dataIndex: "leave_date",
    },
    {
      title: "Reviewed Date",
      render: (_, record) => {
        return format(new Date(record.updated_at), "yyyy-MM-dd");
      },
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "Action",
      render: (_, record) => (
        <Space size="middle">
          <Link
            to={`/leave-view/${record.id}`}
            className="text-lg text-blue-500"
          >
            View
          </Link>
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
    },
  ];

  const handleDeleteLeave = async (id) => {
    if (!id) {
      toast.error("Leave ID is missing or invalid.");
      return;
    }

    if (!access) {
      setErrorMessage("User is not authenticated. Please Login.");
      return;
    }
    try {
      await axios.delete(
        `http://localhost:8000/api/leave-applications/${id}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      toast.success("Deleted successfully.");
      fetchLeaveData();
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      toast.error(errorMsg);
    }
  };

  const handleEditLeave = (id, leaveDate, message) => {
    // Set the leave ID to constant (once clicked, it should not change)
    setEditLeaveId(id);
    setEditedLeaveDate(leaveDate);
    setEditedMessage(message);
  };

  const handleUpdateLeave = async () => {
    if (!editedLeaveDate || !editedMessage) {
      toast.error("Please fill in both fields.");
      return;
    }

    if (!access) {
      setErrorMessage("User is not authenticated. Please Login.");
      return;
    }

    try {
      await axios.put(
        `http://localhost:8000/api/leave-applications/${editLeaveId}/`,
        {
          leave_date: editedLeaveDate,
          message: editedMessage,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      toast.success("Leave updated successfully.");
      setEditLeaveId(null); // Reset the edit state after update
    } catch (error) {
      const errorMsg =
        error.response?.data?.message ||
        error.message ||
        "An unknown error occurred";
      toast.error(errorMsg);
    }
  };

  
  return (
    <MainLayout>
      <div className="flex flex-col items-center gap-2 w-full">
        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
            {editLeaveId ? (
              <div className="flex  items-center justify-self-center bg-purple-300 w-[45%]   m-10 rounded-md shadow-2xl">
                <div className="flex flex-col items-center justify-center w-full rounded-md  ">
                  <h2 className="bg-purple-800  w-full p-4 text-white font-semibold text-center text-lg ">
                    Edit Leave Request
                  </h2>

                  {errorMessage && (
                    <p style={{ color: "red" }}>{errorMessage}</p>
                  )}

                  <form
                    onSubmit={handleUpdateLeave}
                    className="flex flex-col items-center w-full "
                  >
                    <div className="flex flex-col  gap-4 m-5 p-5 w-full">
                      <div className="flex gap-3 items-center ">
                        <label className={`text-purple-900`}>Leave Date:</label>
                        <DatePicker
                          value={
                            editedLeaveDate ? moment(editedLeaveDate) : null
                          }
                          onChange={(date) => setEditedLeaveDate(date)}
                          format="YYYY-MM-DD"
                          className="w-full"
                          disabledDate={(current) =>
                            current && current < moment().startOf("day")
                          }
                        />
                      </div>

                      <div className="flex gap-3 items-center ">
                        <label className="text-purple-900">Message:</label>
                        <textarea
                          className="w-full rounded-md p-1"
                          value={editedMessage}
                          onChange={(e) => setEditedMessage(e.target.value)}
                        />
                      </div>
                    </div>
                    <button
                      className="bg-purple-800 text-white p-2  rounded-md mb-10"
                      type="submit"
                    >
                      Update Leave
                    </button>
                  </form>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-end items-center mr-24 w-full ">
                  <button
                    onClick={handleApplyLeave}
                    className="bg-purple-800 p-2 rounded-md shadow-lg text-white"
                  >
                    Apply For Leave
                  </button>
                </div>
                <h4 className="text-purple-800 font-semibold text-lg">
                  New Requests
                </h4>
                {newRequests.length > 0 ? (
                  <Table
                    className="w-full"
                    columns={newRequestscolumns}
                    dataSource={newRequests}
                  />
                ) : (
                  <p>No new leave requests found.</p>
                )}

                {updatedRequests.length > 0 && (
                  <>
                    <h4 className="text-purple-800 font-semibold text-lg">
                      Reviewed Requests
                    </h4>
                    <Table
                      className="w-full"
                      columns={updatedRequestsColumns}
                      dataSource={updatedRequests}
                    />
                  </>
                )}
              </>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Myleave;
