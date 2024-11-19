import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { Space, Table } from "antd";
import axios from "axios";
import { Link } from "react-router-dom";

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
        <Link className="text-lg text-blue-500">View</Link>
        <button   className="bg-green-700 text-white rounded-md shadow-md p-1 text-sm">
          Accept
        </button>
        <button className="bg-red-700 text-white rounded-md shadow-md p-1 text-sm">
          Reject
        </button>
      </Space>
    ),
  },
  {
    title: "status",
    dataIndex: "status",
  },
];


const ViewLeave = () => {
  const [leaveData, setLeaveData] = useState([]);
  const [leaveError, setLeaveError] = useState(null);
  // const [leaveStatus, setLeaveStatus] = useState('pending')

  // const handeleLeaveStatus = (value) => {
  //     setLeaveStatus(value);
  //     console.log(value);
  //   };

  useEffect(() => {
    async function getLeaveData() {
      try {
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
          console.log(data)
        }
      } catch (error) {
        setLeaveError("Error fetching leave data");
        console.log(error);
      }
    }
    getLeaveData();
  }, []);


  return (
    <MainLayout>
      <div className="flex flex-col items-center gap-2 w-full">
        <h4 className="text-purple-800 font-semibold text-lg ">
          Leave Request
        </h4>
        {
        leaveError ? (
          <p>{leaveError}</p>
        ):
         leaveData.length > 0 ? (
              <Table className="w-full"  columns={columns} dataSource={leaveData} />
        ) : (
          <p>No leave applications found.</p>
        )
      }

      </div>
    </MainLayout>
  );
};

export default ViewLeave;
