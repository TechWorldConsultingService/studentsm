import React, { useState, useEffect } from 'react';

const CreateExamDetailModal = ({ examDetail, exams, subjects, classes, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    exam: '',
    subject: '',
    class_assigned: '',
    full_marks: '',
    pass_marks: '',
    exam_date: '',
  });

  useEffect(() => {
    if (examDetail) {
      setFormData({
        exam: examDetail.exam,
        subject: examDetail.subject,
        class_assigned: examDetail.class_assigned,
        full_marks: examDetail.full_marks,
        pass_marks: examDetail.pass_marks,
        exam_date: examDetail.exam_date,
      });
    }
  }, [examDetail]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData); // Save the data (passed as a prop)
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-purple-300">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">
          {examDetail ? 'Edit Exam Detail' : 'Add New Exam Detail'}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Select Exam */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="exam">
              Exam
            </label>
            <select
              id="exam"
              name="exam"
              value={formData.exam}
              onChange={handleChange}
              className="p-2 border border-purple-300 rounded w-full"
              required
            >
              <option value="">Select Exam</option>
              {exams.map((exam) => (
                <option key={exam.id} value={exam.id}>
                  {exam.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Subject */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="subject">
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
                  {subject.name}
                </option>
              ))}
            </select>
          </div>

          {/* Select Class Assigned */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="class_assigned">
              Class Assigned
            </label>
            <select
              id="class_assigned"
              name="class_assigned"
              value={formData.class_assigned}
              onChange={handleChange}
              className="p-2 border border-purple-300 rounded w-full"
              required
            >
              <option value="">Select Class</option>
              {classes.map((classItem) => (
                <option key={classItem.id} value={classItem.id}>
                  {classItem.name}
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

          {/* Exam Date */}
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="exam_date">
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
            <button onClick={onCancel} className="text-sm text-gray-500">Cancel</button>
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
