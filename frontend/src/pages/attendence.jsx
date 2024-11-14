import React, { useEffect, useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Select, Space, Table, DatePicker } from "antd";
import axios from "axios";

const columns = [
  {
    title: "S.N.",
    dataIndex: "key",
    key: "key",
  },
  {
    title: "Class",
    dataIndex: "class",
    key: "class",
  },
  {
    title: "Type",
    dataIndex: "type",
    key: "type",
  },
  {
    title: "Present",
    dataIndex: "present",
    key: "present",
  },
  {
    title: "Absent",
    key: "absent",
    dataIndex: "absent",
  },
  {
    title: "Take Attendence",
    key: "action",
    render: (_, record) => (
      <Space size="middle">
        <a>Track Attendence {record.name}</a>
        <a>Present All</a>
      </Space>
    ),
  },
];

const data = [
  {
    key: "1",
    class: "One",
    type: "All Day",
    present: "25",
    absent: "5",
  },
  {
    key: "2",
    class: "Two",
    type: "All Day",
    present: "55",
    absent: "5",
  },
  {
    key: "3",
    class: "Three",
    type: "All Day",
    present: "55",
    absent: "5",
  },
  {
    key: "4",
    class: "Four",
    type: "All Day",
    present: "55",
    absent: "5",
  },
  {
    key: "5",
    class: "Five",
    type: "All Day",
    present: "55",
    absent: "5",
  },
  {
    key: "6",
    class: "Six",
    type: "All Day",
    present: "55",
    absent: "5",
  },
  {
    key: "7",
    class: "Seven",
    type: "All Day",
    present: "55",
    absent: "5",
  },
];

const Attendence = () => {
  const [selectClass, setSelectClass] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);

  const [loading, setLoading] = useState(false); // For loading state

  const selectedClass = (value) => {
    setSelectClass(value);
    console.log(value);
  };

  const selectedDate = (date, dateString) => {
    console.log(date, dateString);
  };

  const classData = {
    one: "http://localhost:8000/api/students/?class_id=9",
    two: "http://localhost:8000/myStudents?class_id=10",
    three: "http://localhost:8000/myStudents?class_id=11",
    four: "http://localhost:8000/myStudents?class_id=11",
    five: "http://localhost:8000/myStudents?class_id=12",
    six: "http://localhost:8000/myStudents?class_id=13",
    seven: "http://localhost:8000/myStudents?class_id=14",
  };

  useEffect(() => {
    if (selectClass) {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await axios.get(classData[selectClass]);
          const fetchedData = response.data; // Assuming the API returns data in the expected format

          // Format the data if needed, and then set it to state
          const formattedData = fetchedData.map((item, index) => ({
            key: index + 1,
            class: item.class, // Assuming 'class' exists in the response
            type: item.type, // Assuming 'type' exists
            present: item.present, // Assuming 'present' exists
            absent: item.absent, // Assuming 'absent' exists
          }));

          setAttendanceData(formattedData);
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [selectClass]);

  return (
    <MainLayout>
      <div>
        <div className="flex justify-around">
          <div className="flex items-center gap-x-2">
            <h4 className="text-purple-800 font-semibold text-sm">
              Select the Class for Attendence:
            </h4>
            <Select
              showSearch
              placeholder="Select a Class"
              optionFilterProp="label"
              onChange={selectedClass}
              style={{ width: "150px" }}
              options={[
                { value: "one", label: "One" },
                { value: "two", label: "Two" },
                { value: "three", label: "Three" },
                { value: "four", label: "Four" },
                { value: "five", label: "Five" },
                { value: "six", label: "Six" },
                { value: "seven", label: "Seven" },
              ]}
            />
          </div>
          <DatePicker onChange={selectedDate} />
        </div>

        {selectClass ? (
          loading ? (
            <div>Loading...</div>
          ) : (
            <Table columns={columns} dataSource={attendanceData} />
          )
        ) : (
          <Table columns={columns} dataSource={data} />
        )}
      </div>
    </MainLayout>
  );
};

export default Attendence;
