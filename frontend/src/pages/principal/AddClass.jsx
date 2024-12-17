import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AddClass = () => {
  const [classCode, setClassCode] = useState('');
  const [className, setClassName] = useState('');
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const navigate = useNavigate();

  const subjects = [
    { subject_code: '104', subject_name: 'Computer' },
    { subject_code: '105', subject_name: 'Math' },
    { subject_code: '106', subject_name: 'Science' },
  ];

  const handleSubjectChange = (e) => {
    const value = e.target.value;
    setSelectedSubjects((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newClass = { class_code: classCode, class_name: className, subjects: selectedSubjects };
    console.log('New Class Added:', newClass);

    setClassCode('');
    setClassName('');
    setSelectedSubjects([]);

    navigate('/classes');
  };

  return (
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">Add New Class</h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold" htmlFor="classCode">Class Code</label>
            <input
              type="text"
              id="classCode"
              value={classCode}
              onChange={(e) => setClassCode(e.target.value)}
              className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold" htmlFor="className">Class Name</label>
            <input
              type="text"
              id="className"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
              className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="flex flex-col">
            <label className="text-purple-700 font-semibold" htmlFor="subjects">Select Subjects</label>
            <div className="mt-2">
              {subjects.map((subject) => (
                <div key={subject.subject_code}>
                  <input
                    type="checkbox"
                    id={subject.subject_code}
                    value={subject.subject_code}
                    onChange={handleSubjectChange}
                    className="mr-2"
                  />
                  <label htmlFor={subject.subject_code}>{subject.subject_name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 text-center">
            <button type="submit" className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800">
              Add Class
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClass;
