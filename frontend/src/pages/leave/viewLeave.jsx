import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { Space, Table } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from 'date-fns';

const ViewLeave = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [leaveError, setLeaveError] = useState(null);
  const [isLoading, setIsLoading] = useState(false)
  const [newRequests, setNewRequests] = useState([]);
  const [updatedRequests, setUptatedRequests] = useState([]);



  useEffect(() => {

    async function getLeaveData() {
      try {
        setIsLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          setLeaveError("User is not authenticated. Please log in.");
          return;
        }

        const { data } = await axios.get(
          "http://localhost:8000/api/total-leave-applications/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newRequest = data.filter((leave) => leave.status === "Pending");
        const updatedRequest = data
          .filter((leave) => leave.status === "Approved" || leave.status === "Disapproved")
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at)); // Sort by updated_at
        

        if (data) {
          setLeaveData(data);
          console.log (data)
          setNewRequests(newRequest);
          setUptatedRequests(updatedRequest);
        }

      } catch (error) {
        setLeaveError("Error fetching leave data");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }

    getLeaveData();
    // Set an interval to refresh data every 10 seconds
    const intervalId = setInterval(getLeaveData, 9000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []);

  const handleStatusChange = async (leaveId,newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if(!token) {
        setLeaveError("User is not authenticated. Please Log in.");
        return;
      }

      const response = await axios.patch(
        `http://localhost:8000/api/leave-applications/${leaveId}/update-status/`,
        {status:newStatus},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,

          },
        }
      );


      if (response.data) {
        const updatedLeaveData = leaveData.map((leave) =>
        leave.id === leaveId ? {...leave, status:newStatus} : leave
        );
        setLeaveData(updatedLeaveData);

        setNewRequests(updatedLeaveData.filter((leave) => leave.status === "Pending"));
        setUptatedRequests(
          updatedLeaveData.filter(
            (leave) => leave.status === "Approved" || leave.status === "Disapproved"
          )
        );
      }
    } catch (error){
      console.error("Error updating status",error);
    }
  };



  const newRequestscolumns = [

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
          <Link to={`/leave-view/${record.id}`} className="text-lg text-blue-500">View</Link>
          <button
            onClick={() => handleStatusChange(record.id, "Approved")}
            className="bg-green-700 text-white rounded-md shadow-md p-1.5 text-sm"
          >
            Approved
          </button>
          <button
            onClick={() => handleStatusChange(record.id, "Disapproved")}
            className="bg-red-700 text-white rounded-md shadow-md p-1.5 text-sm"
          >
            Disapproved
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
      title: "Applicant Name",
      dataIndex: "applicant_name",
    },
    {
      title: "Role",
      dataIndex: "applicant_type",
    },
    {
      title: "Leave Date",
      dataIndex: "leave_date",
    },
    {
      title: "Reviewed Date",
      render: (_, record) => {
        // Format the date using date-fns
        return format(new Date(record.updated_at), 'yyyy-MM-dd');
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
          <Link to={`/leave-view/${record.id}`} className="text-lg text-blue-500">View</Link>
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
    <div className="flex flex-col items-center gap-2 w-full">
      <h4 className="text-purple-800 font-semibold text-xl">Leave Request</h4>
      {leaveError ? (
        <p>{leaveError}</p>
      ) : isLoading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h4 className="text-purple-800 font-semibold text-lg">New Requests </h4>
          {newRequests.length > 0 ? (
            <Table className="w-full" columns={newRequestscolumns} dataSource={newRequests} />
          ) : (
            <p>No new leave requests found.</p>
          )}

          <h4 className="text-purple-800 font-semibold text-lg">Approved/Disapproved Requests</h4>
          {updatedRequests.length > 0 && (
            <Table className="w-full" columns={updatedRequestsColumns} dataSource={updatedRequests.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))} />
          )}
        </>
      )}
    </div>
  </MainLayout>
  );
};

export default ViewLeave;
