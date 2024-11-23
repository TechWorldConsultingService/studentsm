import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { Space, Table } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { format } from "date-fns";
import { RiDeleteBin5Line } from "react-icons/ri";
import toast from 'react-hot-toast';


const Myleave = () => {
  const navigate = useNavigate();
  const [leaveData, setLeaveData] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [newRequests, setNewRequests] = useState([]);
  const [updatedRequests, setUptatedRequests] = useState([]);

  const token = localStorage.getItem("token"); // Get token from localStorage

  // Fetch self-applied leave data
  const fetchLeaveData = async () => {
    if (!token) {
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
            Authorization: `Bearer ${token}`,
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
        setUptatedRequests(updatedRequest);
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
  }, [token]);

  console.log(leaveData)

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
          <button  className="bg-blue-700 text-white rounded-md shadow-md p-1.5 text-sm">
            Edit
          </button>
          <button onClick={()=>hanldeDeleteLeave(record.id)} className="bg-red-700 text-white rounded-md shadow-md p-1.5 text-lg">
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
        // Format the date using date-fns
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

  const hanldeDeleteLeave = async (id) => {
    if (!id) {
      toast.error("Leave ID is missing or invalid.");
      return;
    }

      if (!token) {
        setErrorMessage("User is not authenticated. Please Login.");
        return;
      }
      try {
        await axios.delete(
          `http://localhost:8000/api/leave-applications/${id}/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        toast.success(" Deleted successfully.");
        fetchLeaveData()
      } catch (error) {
        const errorMsg = error.response?.data?.message || error.message || 'An unknown error occurred';
        toast.error(errorMsg);
      }
    

    
  }


  

  return (
    <MainLayout>
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="flex justify-end items-center mr-24 w-full ">
          <button
            onClick={handleApplyLeave}
            className="  bg-purple-800 p-2 rounded-md shadow-lg  text-white"
          >
            Applied For Leave
          </button>
        </div>

        {errorMessage ? (
          <p>{errorMessage}</p>
        ) : isLoading ? (
          <p>Loading...</p>
        ) : (
          <>
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
                  dataSource={updatedRequests.sort(
                    (a, b) => new Date(b.updated_at) - new Date(a.updated_at)
                  )}
                />
              </>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Myleave;
