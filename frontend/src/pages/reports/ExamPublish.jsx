import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import MainLayout from '../../layout/MainLayout';
import { useSelector } from 'react-redux';

const ExamPublish = () => {
  const { access } = useSelector((state) => state.user);
  const [exams, setExams] = useState([]);

  useEffect(() => {
    const fetchExams = async () => {
      if (!access) {
        toast.error('User is not authenticated. Please log in.');
        return;
      }

      try {
        const { data } = await axios.get('http://localhost:8000/api/exams/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
          },
        });
        setExams(data);
      } catch (error) {
        toast.error('Error fetching exams.');
      }
    };

    fetchExams();
  }, [access]);

  const handlePublishToggle = async (exam, type) => {
    const updatedStatus = !exam[`is_${type}_published`];
    try {
      await axios.put(
        `http://localhost:8000/api/exams/${exam.id}/`,
        { [`is_${type}_published`]: updatedStatus },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
          },
        }
      );
      toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} ${updatedStatus ? 'published' : 'unpublished'} successfully!`);
      setExams((prevExams) =>
        prevExams.map((ex) =>
          ex.id === exam.id ? { ...ex, [`is_${type}_published`]: updatedStatus } : ex
        )
      );
    } catch (error) {
      toast.error(`Error updating ${type} status.`);
    }
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Exam Publish Panel</h1>
          <p className="mt-4 text-gray-600">Manage Routine and Result .</p>

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full divide-y divide-purple-300 shadow-sm">
              <thead className="bg-purple-700 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-lg font-semibold">Exam Name</th>
                  <th className="px-6 py-3 text-center text-lg font-semibold">Routine</th>
                  <th className="px-6 py-3 text-center text-lg font-semibold">Result</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {exams.map((exam) => (
                  <tr key={exam.id} className="hover:bg-gray-50 transition duration-300">
                    <td className="px-6 py-4 font-medium text-purple-800 text-lg">{exam.name}</td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <span className={`px-4 py-1 rounded-full text-sm font-semibold ${exam.is_timetable_published ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-800'}`}>
                          {exam.is_timetable_published ? 'Published' : 'Unpublished'}
                        </span>
                        <button
                          onClick={() => handlePublishToggle(exam, 'timetable')}
                          className={`px-4 py-2 rounded-lg text-white font-semibold ${exam.is_timetable_published ? 'bg-purple-700 hover:bg-purple-800' : 'bg-gray-500 hover:bg-gray-600'} transition duration-300`}
                        >
                          {exam.is_timetable_published ? 'Unpublish' : 'Publish'}
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col items-center space-y-2">
                        <span className={`px-4 py-1 rounded-full text-sm font-semibold ${exam.is_result_published ? 'bg-purple-200 text-purple-800' : 'bg-gray-200 text-gray-800'}`}>
                          {exam.is_result_published ? 'Published' : 'Unpublished'}
                        </span>
                        <button
                          onClick={() => handlePublishToggle(exam, 'result')}
                          className={`px-4 py-2 rounded-lg text-white font-semibold ${exam.is_result_published ? 'bg-purple-700 hover:bg-purple-800' : 'bg-gray-500 hover:bg-gray-600'} transition duration-300`}
                        >
                          {exam.is_result_published ? 'Unpublish' : 'Publish'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default ExamPublish;
