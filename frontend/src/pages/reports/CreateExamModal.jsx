import React, { useState, useEffect } from 'react';

const CreateExamModal = ({ exam, onSave, onCancel }) => {
  const [examName, setExamName] = useState('');

  useEffect(() => {
    if (exam) {
      setExamName(exam.name);
    }
  }, [exam]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (examName) {
      onSave({ name: examName });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-purple-300">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">
          {exam ? 'Edit Exam' : 'Add New Exam'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="examName">
              Exam Name
            </label>
            <input
              id="examName"
              type="text"
              value={examName}
              onChange={(e) => setExamName(e.target.value)}
              className="p-2 border border-purple-300 rounded w-full"
              required
            />
          </div>

          <div className="mt-4 flex justify-end gap-4">
            <button onClick={onCancel} className="text-sm text-gray-500">Cancel</button>
            <button
              type="submit"
              className="text-sm bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Save Exam
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateExamModal;
