import React, { useState } from 'react';
import axios from 'axios';
import MainLayout from '../../layout/MainLayout';

const ApplyLeave = () => {
  const [leaveDate, setLeaveDate] = useState('');
  const [message, setMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log form data to the console
    console.log("Form Data:");
    console.log("Leave Date:", leaveDate);
    console.log("Message:", message);

    // Retrieve token from local storage within handleSubmit function
    const token = localStorage.getItem('token');
    console.log("Token:", token); // Check if token is available
    if (!token) {
      setErrorMessage("User is not authenticated. Please log in.");
      return;
    }


    

    try {
      // const response = await axios.post(
        await axios.post('http://localhost:8000/api/leave-applications/create/',{leave_date: leaveDate, message:message},
        {
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in local storage
            Authorization: `Bearer ${token}`, // Assuming token is stored in local storage
          },
        }
      );

      setSuccessMessage('Leave application submitted successfully!');
      setErrorMessage('');
      setLeaveDate('');
      setMessage('');
    } catch (error) {
      setErrorMessage(
        error.response?.data?.error || 'Error submitting leave application. Please try again.'
      );
      setSuccessMessage('');
    }
  };

  return (
    <MainLayout>
      <div className='flex  items-center justify-self-center bg-purple-300 w-[45%]   m-10 rounded-md shadow-2xl'>
       <div className='flex flex-col items-center justify-center w-full rounded-md  ' >
        <h2 className='bg-purple-800  w-full p-4 text-white font-semibold text-center text-lg '>Apply for Leave</h2>
       
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
       
       
        <form onSubmit={handleSubmit} className='flex flex-col items-center w-full '>
          <div className='flex flex-col  gap-4 m-5 p-5 w-full'>
          <div className='flex gap-3 items-center '>
            <label className='text-purple-900'>Leave Date:</label>
            <input
            className='w-full p-1'
              type="date"
              value={leaveDate}
              onChange={(e) => setLeaveDate(e.target.value)}
              required
            />
          </div>
          
          <div className='flex gap-3 items-center '>
            <label className='text-purple-900'>Message:</label>
            <textarea
            className='w-full p-1'
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>

          </div>
          <button type="submit" className='bg-purple-800 text-white p-2  rounded-md mb-10'>SUBMIT</button>
          
       </form>
      </div>
      </div>
    </MainLayout>
  );
};

export default ApplyLeave;
