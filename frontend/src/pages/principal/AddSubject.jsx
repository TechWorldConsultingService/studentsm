import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddSubject = () => {
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Save subject logic here
    const newSubject = { subject_code: subjectCode, subject_name: subjectName };
    console.log('New Subject Added:', newSubject);

    // Reset form
    setSubjectCode('');
    setSubjectName('');

    // Redirect to the subjects page
    navigate('/subjects');
  };

  return (
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">Add New Subject</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold" htmlFor="subjectCode">Subject Code</label>
            <input
              type="text"
              id="subjectCode"
              value={subjectCode}
              onChange={(e) => setSubjectCode(e.target.value)}
              className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold" htmlFor="subjectName">Subject Name</label>
            <input
              type="text"
              id="subjectName"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mt-6 text-center">
            <button type="submit" className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800">
              Add Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSubject;
