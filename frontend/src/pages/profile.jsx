import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import MainLayout from '../layout/MainLayout';
import axios from 'axios';

const MyStudents = () => {
  // State to store student data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data from API when component mounts
  useEffect(() => {
    axios.get('your-backend-api-url')
      .then(response => {
        // Map the API response to table format
        const students = response.data.map((student, index) => ({
          key: index,  // Assign a unique key to each row
          name: `${student.user.first_name} ${student.user.last_name}`,  // Full name
          email: student.user.email,
          phone: student.phone,
          address: student.address,
          date_of_birth: student.date_of_birth,
          is_student: student.user.is_student ? 'Yes' : 'No',
        }));
        setData(students);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching students:', error);
        setLoading(false);
      });
  }, []);  // Empty dependency array means this runs once on component mount

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
    },
    {
      title: 'Address',
      dataIndex: 'address',
    },
    {
      title: 'Date of Birth',
      dataIndex: 'date_of_birth',
    },
    {
      title: 'Is Student',
      dataIndex: 'is_student',
    },
  ];

  const onChange = (pagination, filters, sorter, extra) => {
    console.log('params', pagination, filters, sorter, extra);
  };

  return (
    <MainLayout>
      <div>
        <span>List of the students are:</span>
        <Table
          columns={columns}
          dataSource={data}
          loading={loading}
          onChange={onChange}
        />
      </div>
    </MainLayout>
  );
};

export default MyStudents;
