import React, { useEffect, useState } from 'react';
import { Table, Input } from 'antd';
import MainLayout from '../layout/MainLayout';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

const MyStudents = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState(""); // New state for search query

  // Get class_id from the URL query parameters
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const classId = searchParams.get('class_id');

  // Fetch data from API when component mounts
  useEffect(() => {
    if (classId) {
      setLoading(true);
      axios.get(`http://localhost:8000/api/students/?class_id=${classId}`)
        .then(response => {
          const students = response.data.map((student, index) => ({
            key: index,
            name: `${student.user.first_name} ${student.user.last_name}`,
            email: student.user.email,
            username: student.user.username,
            phone: student.phone,
            address: student.address,
            gender: student.gender,
            date_of_birth: student.date_of_birth,
            is_student: student.user.is_student ? 'Yes' : 'No',
          }));
          setData(students);
        })
        .catch(error => {
          console.error('Error fetching students:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [classId]);

  // Filter data based on search text
  const filteredData = data.filter(student =>
    student.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Username', dataIndex: 'username' },
    { title: 'Email', dataIndex: 'email' },
    { title: 'Gender', dataIndex: 'gender' },
    { title: 'Address', dataIndex: 'address' },
    { title: 'Parents Phone', dataIndex: 'phone' },
    { title: 'Date of Birth', dataIndex: 'date_of_birth' },
  ];

  return (
    <MainLayout>
      <div>
        <span>Search By Name:</span>
        <Input
          placeholder="Aakash Singh"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)} // Update searchText on input change
          style={{ marginBottom: 16, width: 200 }} // Add some styling to the input
        />
        <Table
          columns={columns}
          dataSource={filteredData} // Use filtered data
          loading={loading}
          onChange={(pagination, filters, sorter, extra) => {
            console.log('params', pagination, filters, sorter, extra);
          }}
        />
      </div>
    </MainLayout>
  );
};

export default MyStudents;
