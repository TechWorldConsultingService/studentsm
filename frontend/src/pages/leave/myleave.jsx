import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { Space, Table } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { RiDeleteBin5Line } from "react-icons/ri";
import toast from "react-hot-toast";
import moment from "moment";
import { useSelector } from "react-redux";
import { DatePicker } from "antd";

const Myleave = () => {
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newRequests, setNewRequests] = useState([]);
  const [updatedRequests, setUpdatedRequests] = useState([]);
  const [editLeaveId, setEditLeaveId] = useState(null);
  const [editedLeaveDate, setEditedLeaveDate] = useState(null);
  const [editedMessage, setEditedMessage] = useState("");
  const { access } = useSelector((state) => state.user);

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

  // Handle Apply Leave
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
            className="text-lg text-purple-700 hover:underline"
          >
            View
          </Link>
          <button
            onClick={() =>
              handleEditLeave(record.id, record.leave_date, record.message)
            }
            className="bg-purple-700 text-white rounded-md shadow-md p-1.5 text-sm"
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
            className="text-lg text-purple-700 hover:underline"
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
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">My Leave</h1>
          <p className="mt-4 text-gray-600">
            View and manage your leave requests here.
          </p>

          {errorMessage ? (
            <p className="text-red-600">{errorMessage}</p>
          ) : isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              {editLeaveId ? (
         <div className="bg-purple-50 p-6">
         <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
           <h2 className="text-3xl font-extrabold text-purple-800 text-center mb-6">
             Edit Leave Request
           </h2>
           <form
             onSubmit={handleUpdateLeave}
             className="flex flex-col gap-6"
           >
             <div className="flex gap-3 items-center">
               <label className="text-purple-900 text-sm">Leave Date:</label>
               <DatePicker
                 value={editedLeaveDate ? moment(editedLeaveDate) : null}
                 onChange={(date) => setEditedLeaveDate(date)}
                 format="YYYY-MM-DD"
                 className="w-full border rounded-md p-2"
                 disabledDate={(current) =>
                   current && current < moment().startOf("day")
                 }
               />
             </div>
       
             <div className="flex gap-3 items-center">
               <label className="text-purple-900 text-sm">Message:</label>
               <textarea
                 className="w-full border rounded-md p-2"
                 value={editedMessage}
                 onChange={(e) => setEditedMessage(e.target.value)}
               />
             </div>
       
             <div className="mt-6 text-center">
               <button
                 type="submit"
                 className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none"
               >
                 Update Leave
               </button>
             </div>
           </form>
         </div>
       </div>
       
              ) : (
                <>
                  <div className="flex justify-end items-center mr-24 w-full">
                    <button
                      onClick={handleApplyLeave}
                      className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
                    >
                      Apply For Leave
                    </button>
                  </div>

                  <h4 className="text-purple-800 font-semibold text-lg">
                    New Requests
                  </h4>
                  {newRequests.length > 0 ? (
                    <Table
                      className="min-w-full mt-4"
                      columns={newRequestscolumns}
                      dataSource={newRequests}
                    />
                  ) : (
                    <p className="text-gray-600 mt-4">No new leave requests found.</p>
                  )}

                  {updatedRequests.length > 0 && (
                    <>
                      <h4 className="text-purple-800 font-semibold text-lg">
                        Reviewed Requests
                      </h4>
                      <Table
                        className="min-w-full mt-4"
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
      </div>
    </MainLayout>
  );
};

export default Myleave;
