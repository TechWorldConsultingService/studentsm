import React, { useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Select, Space, Table, DatePicker } from "antd";

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

  const selectedClass = (value) => {
    setSelectClass(value);
    console.log(value);
  };

  const selectedDate = (date, dateString) => {
    console.log(date, dateString);
  };

  const classData = {
    one: "http://localhost:3000/myStudents?class_id=9",
    two: "http://localhost:3000/myStudents?class_id=10",
    three: "http://localhost:3000/myStudents?class_id=11",
    four: "http://localhost:3000/myStudents?class_id=11",
    five: "http://localhost:3000/myStudents?class_id=12",
    six: "http://localhost:3000/myStudents?class_id=13",
    seven: "http://localhost:3000/myStudents?class_id=14",
  };

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
          <div>{classData[selectClass]}</div>
        ) : (
          <Table columns={columns} dataSource={data} />
        )}
      </div>
    </MainLayout>
  );
};

export default Attendence;
