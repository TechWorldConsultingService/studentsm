import React, { useState } from 'react'
import MainLayout from '../../layout/MainLayout'
import {  Space, Table } from "antd";



const columns = [
    {
      title: "S.N.",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Class",
      dataIndex: "class",
      key: "class",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
    },
    {
      title: "Message",
      key: "message",
      dataIndex: "message",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space size="middle">
          <a>View </a>
          <a>Accept</a>
          <a>Reject</a>
        </Space>
      ),
    },
  ];


  const data = [
    {
      key: "1",
      name: "One",
      class: "All Day",
      date: "25",
      message: "5",
    },
    {
      key: "2",
      name: "Two",
      class: "All Day",
      date: "55",
      message: "5",
    },
    {
      key: "3",
      name: "Three",
      class: "All Day",
      date: "55",
      message: "5",
    },
    {
      key: "4",
      name: "Four",
      class: "All Day",
      date: "55",
      message: "5",
    },
    {
      key: "5",
      name: "Five",
      class: "All Day",
      date: "55",
      message: "5",
    },
    {
      key: "6",
      name: "Six",
      class: "All Day",
      date: "55",
      message: "5",
    },
    {
      key: "7",
      name: "Seven",
      class: "All Day",
      date: "55",
      message: "5",
    },
  ];
  




const ViewLeave = () => {

    const [leaveStatus, setLeaveStatus] = useState(null);

    // const handeleLeaveStatus = (value) => {
    //     setLeaveStatus(value);
    //     console.log(value);
    //   };

  return (
    <MainLayout>
       
          <div className="flex flex-col items-center gap-2 w-full">
            <h4 className="text-purple-800 font-semibold text-lg ">
             Leave Request
            </h4>
          <Table className='w-full' columns={columns} dataSource={data} />
      </div>
    </MainLayout>
   
  )
}

export default ViewLeave










 








      

