import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import MainLayout from '../layout/MainLayout';
import axios from 'axios';
import { useLocation } from 'react-router-dom';


const MyStudents = () => {
  // State to store student data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);


  //Get class_id from the URL query parameters
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const classId = searchParams.get('class_id');



  // Fetch data from API when component mounts
  useEffect(() => {

    if (classId){
      setLoading(true); //set loading true before fetching new data
      axios.get(`http://localhost:8000/api/students/?class_id=${classId}`)
        .then(response => {
          //map the api response  to table format
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
        })
        .catch(error =>{
          console.error('Error fetching students:',error)
        })
        .finally(()=>{
          setLoading(false); // Set loading to false after fetching data
        })
    }
  },[classId]); //RUns this effect whenever classid changes
    


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
}

export default MyStudents;
