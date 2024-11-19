import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { Space, Table } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";




const ViewLeave = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [leaveError, setLeaveError] = useState(null);
const [isLoading, setIsLoading] = useState(false)



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

        if (data) {
          setLeaveData(data);
        }

      } catch (error) {
        setLeaveError("Error fetching leave data");
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    }
    getLeaveData();
  }, []);

  const handleStatusChange = async (leaveId,newStatus) => {
    try {
      const token = localStorage.getItem("token");
      if(!token) {
        setLeaveError("User is not authenticated. Please Log in.");
        return;
      }

      const response = await axios.patch(
        `http://localhost:8000/api/leave-applications/${leaveId}/`,
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
      }
    } catch (error){
      console.error("Error updating status",error);
    }
  };



  const columns = [
    {
      title: "ID",
      dataIndex: "applicant",
    },
    {
      title: "Applicant Name",
      dataIndex: "applicant_name",
    },
    {
      title: "Role",
      dataIndex: "applicant_type",
    },
    {
      title: "Class",
      dataIndex: "class",
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
          {record.status ==="Pending" && (
            <>
             <button
                onClick={() => handleStatusChange(record.id, "Accepted")}
                className="bg-green-700 text-white rounded-md shadow-md p-1 text-sm"
              >
                 Accept
              </button>
              <button
                onClick={() => handleStatusChange(record.id, "Disapproved")}
                className="bg-red-700 text-white rounded-md shadow-md p-1 text-sm"
              >
                Reject
              </button>
            </>
          )}
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
        <h4 className="text-purple-800 font-semibold text-lg">Leave Request</h4>
        {leaveError ? (
          <p>{leaveError}</p>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : leaveData.length > 0 ? (
          <Table className="w-full" columns={columns} dataSource={leaveData} />
        ) : (
          <p>No leave applications found.</p>
        )}
      </div>
    </MainLayout>
  );
};

export default ViewLeave;
