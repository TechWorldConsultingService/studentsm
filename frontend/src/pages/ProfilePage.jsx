import React from 'react';
import { Card } from 'antd';
import MainLayout from '../layout/MainLayout';
import '../components/profile.css';
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
            <h2 className="profile-name">{`${capitalize(first_name)} ${capitalize(last_name)}`}</h2>
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
