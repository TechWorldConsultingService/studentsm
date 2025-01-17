import React, { useState, useEffect } from 'react';

const EnterMarks = ({ students, subjects, selectedSubject, onSaveMarks, onCancel, selectedStudent, isEditing }) => {
  const [marksData, setMarksData] = useState({});

  useEffect(() => {
    const initialMarks = students.reduce((acc, student) => {
      acc[student.id] = { theoryMarks: '', practicalMarks: '' };
      return acc;
    }, {});
    setMarksData(initialMarks);
  }, [students]);

  const handleTheoryMarksChange = (studentId, value) => {
    if (isEditing) {
      setMarksData((prev) => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          theoryMarks: value,
        },
      }));
    }
  };

  const handlePracticalMarksChange = (studentId, value) => {
    if (isEditing) {
      setMarksData((prev) => ({
        ...prev,
        [studentId]: {
          ...prev[studentId],
          practicalMarks: value,
        },
      }));
    }
  };

  const handleSubmit = () => {
    if (isEditing) {
      Object.keys(marksData).forEach((studentId) => {
        const { theoryMarks, practicalMarks } = marksData[studentId];
        onSaveMarks(studentId, theoryMarks, practicalMarks);
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto border border-purple-300">
        <h2 className="text-2xl font-semibold text-purple-700 mb-4">
          {selectedStudent ? (isEditing ? `Edit Marks for ${selectedStudent.name}` : `View Marks for ${selectedStudent.name}`) : 'Enter Marks for Students'}
        </h2>
        <table className="w-full table-auto text-sm">
          <thead>
            <tr className="bg-purple-100 text-purple-700">
              <th className="px-6 py-3 border">Student Name</th>
              <th className="px-6 py-3 border">Full Marks</th>
              <th className="px-6 py-3 border">Pass Marks</th>
              <th className="px-6 py-3 border">Theory Marks</th>
              <th className="px-6 py-3 border">Practical Marks</th>

            </tr>
          </thead>
          <tbody>
            {selectedStudent ? (
              <tr key={selectedStudent.id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4">{selectedStudent.name}</td>
                <td className="px-6 py-4">
                  {selectedSubject
                    ? subjects.find((subject) => subject.name === selectedSubject)?.fullMarks || 'N/A'
                    : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  {selectedSubject
                    ? subjects.find((subject) => subject.name === selectedSubject)?.passMarks || 'N/A'
                    : 'N/A'}
                </td>
                <td className="px-6 py-4">
                  {isEditing ? (
                    <input
                      type="number"
                      value={marksData[selectedStudent.id]?.theoryMarks || ''}
                      onChange={(e) => handleTheoryMarksChange(selectedStudent.id, e.target.value)}
                      className="p-2 border border-purple-300 rounded"
                    />
                  ) : (
                    selectedStudent.theoryMarks
                  )}
                </td>
                <td className="px-6 py-4">
                  {isEditing ? (
                    <input
                      type="number"
                      value={marksData[selectedStudent.id]?.practicalMarks || ''}
                      onChange={(e) => handlePracticalMarksChange(selectedStudent.id, e.target.value)}
                      className="p-2 border border-purple-300 rounded"
                    />
                  ) : (
                    selectedStudent.practicalMarks
                  )}
                </td>
 
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="border-b hover:bg-gray-100">
                  <td className="px-6 py-4">{student.name}</td>
                  <td className="px-6 py-4">
                    {selectedSubject
                      ? subjects.find((subject) => subject.name === selectedSubject)?.fullMarks || 'N/A'
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    {selectedSubject
                      ? subjects.find((subject) => subject.name === selectedSubject)?.passMarks || 'N/A'
                      : 'N/A'}
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={marksData[student.id]?.theoryMarks || ''}
                      onChange={(e) => handleTheoryMarksChange(student.id, e.target.value)}
                      className="p-2 border border-purple-300 rounded"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <input
                      type="number"
                      value={marksData[student.id]?.practicalMarks || ''}
                      onChange={(e) => handlePracticalMarksChange(student.id, e.target.value)}
                      className="p-2 border border-purple-300 rounded"
                    />
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className="mt-4 flex justify-end gap-4">
          <button onClick={onCancel} className="text-sm text-gray-500">Cancel</button>
          {isEditing && (
            <button
              onClick={handleSubmit}
              className="text-sm bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Save Marks
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnterMarks;
