import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';

const CreateExamDetailModal = ({ examDetail, exams, classes, onSave, onCancel }) => {
  const { access } = useSelector((state) => state.user);
  const [selectedClassCode, setSelectedClassCode] = useState('');
  const [subjects, setSubjects] = useState([]);
  const [formData, setFormData] = useState({
    exam: exams.id || '',
    subject: '',
    class_assigned: '',
    full_marks: '',
    pass_marks: '',
    exam_date: ''
  });

  // Effect to fetch subjects based on selected class
  useEffect(() => {
    const fetchSubjects = async () => {
      if (selectedClassCode) {
        try {
          const response = await axios.get(`http://localhost:8000/api/classes/${selectedClassCode}/`, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access}`,
            },
          });
          setSubjects(response.data.subject_details); 
        } catch (error) {
          console.error('Error fetching subjects:', error);
        }
      }
    };

    fetchSubjects();
  }, [selectedClassCode, access]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeClass = (e) => {
    const { value } = e.target;
    setSelectedClassCode(value); 
    setFormData((prev) => ({ ...prev, class_assigned: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed  inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-h-full md:w-1/2 lg:w-1/3 overflow-auto">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">
          {examDetail ? 'Edit Exam Detail' : 'Add New Exam Detail'}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Exam */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">Exam</label>
            <select
              id="exam"
              name="exam"
              value={formData.exam}
              onChange={handleChange}
              className="p-2 border border-purple-300 rounded w-full"
              required
            >
              <option value="">Select Exam</option>
                <option key={exams.id} value={exams.id}>
                  {exams.name}
                </option>
            </select>
          </div>

          {/* Class Assigned */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2">
              Class Assigned
            </label>
            <select
              id="class_assigned"
              name="class_assigned"
              value={formData.class_assigned}
              onChange={handleChangeClass}
              className="p-2 border border-purple-300 rounded w-full"
              required
            >
              <option value="">Select Class</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.class_name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" >
              Subject
            </label>
            <select
              id="subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="p-2 border border-purple-300 rounded w-full"
              required
            >
              <option value="">Select Subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.subject_name}
                </option>
              ))}
            </select>
          </div>

          {/* Full Marks */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="full_marks">
              Full Marks
            </label>
            <input
              type="number"
              id="full_marks"
              name="full_marks"
              value={formData.full_marks}
              onChange={handleChange}
              className="p-2 border border-purple-300 rounded w-full"
              required
            />
          </div>

          {/* Pass Marks */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="pass_marks">
              Pass Marks
            </label>
            <input
              type="number"
              id="pass_marks"
              name="pass_marks"
              value={formData.pass_marks}
              onChange={handleChange}
              className="p-2 border border-purple-300 rounded w-full"
              required
            />
          </div>

          {/* Exam Date*/}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" >
              Exam Date
            </label>
            <input
              type="date"
              id="exam_date"
              name="exam_date"
              value={formData.exam_date}
              onChange={handleChange}
              className="p-2 border border-purple-300 rounded w-full"
              required
            />
          </div>

          {/* Actions */}
          <div className="mt-4 flex justify-end gap-4">
            <button
              onClick={onCancel}
              className="text-sm text-gray-500 px-4 py-2 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="text-sm bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExamDetailModal;
