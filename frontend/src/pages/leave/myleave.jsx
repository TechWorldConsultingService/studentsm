import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { Space, Table,Button } from "antd";
import {  useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";


const Myleave = () => {
    const navigate = useNavigate();
    const [leaveData, setLeaveData] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');  // Define errorMessage state
    const token = localStorage.getItem('token');  // Get token from localStorage

    // Fetch self-applied leave data
    const fetchLeaveData = async () => {
      if (!token) {
        setErrorMessage("User is not authenticated");
        return;
      }
      try {
        const response = await axios.get("http://localhost:8000/api/leave-applications/",{
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }); 
        console.log("Received response:", response);
        const formattedData = response.data.map((item, index) => ({
          key: index + 1, // Serial number
          leaveDate: item.leave_date,
          // reviewedDate: item.reviewed_date || "Not Reviewed", // Assume reviewed_date might be null
          message: item.message,
          status: item.status || "Pending", // Fallback to Pending if status is undefined
          // action: item.status === "Pending" ? "Edit" : "View",
        }));
        setLeaveData(formattedData);
      } catch (error) {
        console.error("Error fetching leave data:", error);
        setErrorMessage("Failed to load leave data. Please try again.");
      }
    };
    useEffect(() => {
      fetchLeaveData();
    }, [token]);

    // Handle navigation to apply leave page
    const handleApplyLeave = () =>{
        navigate("/applyLeave");
    }

    const columns = [
      {
        title: "Leave Date",
        dataIndex: "leaveDate",
        key: "leaveDate",
      },
      // {
      //   title: "Reviewed Date",
      //   dataIndex: "reviewedDate",
      //   key: "reviewedDate",
      // },
      {
        title: "Message",
        dataIndex: "message",
        key: "message",
      },
      {
        title: "Action",
        key: "action",
        // dataIndex: "action",
        render: (_, record) => (
          // <Button
          //   type="link"
          //   onClick={() => {
          //     console.log("Viewing Leave Details");
          //     // if (record.action === "Edit") {
          //     //   navigate(/editLeave/${record.key});
          //     // } else {
          //     //   console.log("Viewing Leave Details");
          //     // }
          //   }}
          // >
          //   {/* {record.action} */}
          //   {record.status === "Pending" ? "Edit" : "View"}
          // </Button>
          <Space size="middle">
          <Link to={`/leave-view/${record.id}`} className="text-lg text-blue-500">View</Link>
          </Space>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        key: "status",
      },
    ];


  return (
    <MainLayout>
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="flex justify-end items-center mr-24 w-full ">
        <button onClick={handleApplyLeave} className="  bg-purple-800 p-2 rounded-md shadow-lg  text-white">Applied For Leave</button>
        </div>

        <h4 className="text-purple-800 font-semibold text-lg ">My Leave Request</h4>
        
        {/* Display error message if there is one */}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}

        <Table className="w-full" columns={columns} dataSource={leaveData} />
      </div>
    </MainLayout>
  );
};

export default Myleave;