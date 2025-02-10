import React from 'react';
import { Card } from 'antd';
import MainLayout from '../layout/MainLayout';
import '../pages/profile.css';
import { useSelector } from 'react-redux';

const Profile = () => {
  // Retrieve user data from Redux store
  const user = useSelector((state) => state.user);
  console.log("User data from Redux:", user); // Debug log

  const {
    id,
    first_name,
    last_name,
    role,
    email,
    phone,
    date_of_birth,
    date_of_joining,
    address,
    parents,
    profilePicture
  } = user;

  // Function to capitalize the first letter of a string
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <MainLayout>
      <div className="profile-page">
        <Card className="profile-card">
          <div className="profile-picture-container">
            <div className="profile-picture">
              <img src={profilePicture || 'https://via.placeholder.com/150'} alt="Profile" />
            </div>
            {/* Corrected the string interpolation */}
            <h2 className="profile-name"> {capitalize(first_name)} {capitalize(last_name)} </h2>
          </div>
          <div className="profile-info">
            <p><strong>Role:</strong> {role}</p>
            <p><strong>Email:</strong> {email}</p>
            <p><strong>Contact Number:</strong> {phone}</p>
            
            {role.toLowerCase() === 'teacher' && (
              <p><strong>Date of Joining:</strong> {date_of_joining}</p>
            )}
            {role.toLowerCase() === 'student' && (
              <>
                <p><strong>Date of Birth:</strong> {date_of_birth}</p>
                <p><strong>Father's Name:</strong> {parents}</p>
              </>
            )}
            <p><strong>Address:</strong> {address}</p>
          </div>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Profile;

// import React, { useEffect, useState } from 'react';
// import { Table } from 'antd';
// import MainLayout from '../layout/MainLayout';
// import axios from 'axios';

// const MyStudents = () => {
//   // State to store student data
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch data from API when component mounts
//   useEffect(() => {
//     axios.get('your-backend-api-url')
//       .then(response => {
//         // Map the API response to table format
//         const students = response.data.map((student, index) => ({
//           key: index,  // Assign a unique key to each row
//           name: `${student.user.first_name} ${student.user.last_name}`,  // Full name
//           email: student.user.email,
//           phone: student.phone,
//           address: student.address,
//           date_of_birth: student.date_of_birth,
//           is_student: student.user.is_student ? 'Yes' : 'No',
//         }));
//         setData(students);
//         setLoading(false);
//       })
//       .catch(error => {
//         console.error('Error fetching students:', error);
//         setLoading(false);
//       });
//   }, []);  // Empty dependency array means this runs once on component mount

//   const columns = [
//     {
//       title: 'Name',
//       dataIndex: 'name',
//     },
//     {
//       title: 'Email',
//       dataIndex: 'email',
//     },
//     {
//       title: 'Phone',
//       dataIndex: 'phone',
//     },
//     {
//       title: 'Address',
//       dataIndex: 'address',
//     },
//     {
//       title: 'Date of Birth',
//       dataIndex: 'date_of_birth',
//     },
//     {
//       title: 'Is Student',
//       dataIndex: 'is_student',
//     },
//   ];

//   const onChange = (pagination, filters, sorter, extra) => {
//     console.log('params', pagination, filters, sorter, extra);
//   };

//   return (
//     <MainLayout>
//       <div>
//         <span>List of the students are:</span>
//         <Table
//           columns={columns}
//           dataSource={data}
//           loading={loading}
//           onChange={onChange}
//         />
//       </div>
//     </MainLayout>
//   );
// };

// export default MyStudents;

