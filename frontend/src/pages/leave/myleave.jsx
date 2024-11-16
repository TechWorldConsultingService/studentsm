import React from "react";
import MainLayout from "../../layout/MainLayout";
import { Space, Table } from "antd";
import {  useNavigate } from "react-router-dom";


const columns = [
  {
    title: "S.N.",
    dataIndex: "key",
    key: "key",
  },
  {
    title: "Applied Date",
    dataIndex: "appliedDate",
    key: "appliedDate",
  },
  {
    title: "Leave Date",
    dataIndex: "leaveDate",
    key: "leaveDate",
  },
  {
    title: "Message",
    dataIndex: "message",
    key: "message",
  },
  {
    title: "Edit",
    key: "edit",
    dataIndex: "edit",
  },
  {
    title: "Status",
    key: "status",
    dataIndex: "status",
  }

];

const data = [
  {
    key: "1",
    appliedDate: "One",
    leaveDate: "All Day",
    message: "25",
    edit: "Edit",
    status:"Pending"
  },
  {
    key: "2",
    appliedDate: "Two",
    leaveDate: "All Day",
    message: "55",
    edit: "Edit",
    status:"Pending"
  },
  {
    key: "3",
    appliedDate: "Three",
    leaveDate: "All Day",
    message: "55",
    edit: "Edit",
    status:"Pending"
  },
  {
    key: "4",
    appliedDate: "Four",
    leaveDate: "All Day",
    message: "55",
    edit: "Edit",
    status:"Pending"
  },
  {
    key: "5",
    appliedDate: "Five",
    leaveDate: "All Day",
    message: "55",
    edit: "Edit",
    status:"Pending"
  },
  {
    key: "6",
    appliedDate: "Six",
    leaveDate: "All Day",
    message: "55",
    edit: "Edit",
    status:"Pending"
  },
  {
    key: "7",
    appliedDate: "Seven",
    leaveDate: "All Day",
    message: "55",
    edit: "Edit",
    status:"Pending"
  },
];

const Myleave = () => {
    const navigate = useNavigate();


    const handleApplyLeave = () =>{
        navigate("/applyLeave");
    }
  return (
    <MainLayout>
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="flex justify-end items-center mr-24 w-full ">
        <button onClick={handleApplyLeave} className="  bg-purple-800 p-2 rounded-md shadow-lg  text-white">Applied For Leave</button>
        </div>
        <h4 className="text-purple-800 font-semibold text-lg ">My Leave Request</h4>
        <Table className="w-full" columns={columns} dataSource={data} />
      </div>
    </MainLayout>
  );
};

export default Myleave;
