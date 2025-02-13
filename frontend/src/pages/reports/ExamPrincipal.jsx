import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import MainLayout from '../../layout/MainLayout';
import CreateExamModal from './CreateExamModal';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ExamPrincipal = () => {
  const { access } = useSelector((state) => state.user);
  const [exams, setExams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);
  const [examDetails, setExamDetails] = useState(null);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false); 
  const [examToDelete, setExamToDelete] = useState(null); 

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

  const openAddExamModal = () => {
    setSelectedExam(null); 
    setIsModalOpen(true);
  };

  const openEditExamModal = (exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
  };


  const handleSaveExam = async (exam) => {
    try {
      let response;
      if (selectedExam) {
        response = await axios.put(
          `http://localhost:8000/api/exams/${selectedExam.id}/`,
          { name: exam.name },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access}`,
            },
          }
        );
        toast.success('Exam updated successfully!');
        setExams(
          exams.map((item) =>
            item.id === selectedExam.id ? { ...item, name: exam.name } : item
          )
        );
      } else {
        response = await axios.post(
          'http://localhost:8000/api/exams/',
          { name: exam.name },
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${access}`,
            },
          }
        );
        toast.success('Exam created successfully!');
        setExams([...exams, response.data]);
      }
      closeModal();
    } catch (error) {
      toast.error('Error saving exam.');
    }
  };

  const handleDeleteExam = async (examId) => {
    try {
      await axios.delete(`http://localhost:8000/api/exams/${examId}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
      });
      setExams(exams.filter((exam) => exam.id !== examId));
      toast.success('Exam deleted successfully!');
      setIsConfirmDeleteOpen(false);
    } catch (error) {
      toast.error('Error deleting exam.');
    }
  };


  const handleViewExam = async (examId) => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/exams/${examId}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
      });
      setExamDetails(data);
    } catch (error) {
      toast.error('Error fetching exam details.');
    }
  };

  const openConfirmDeleteModal = (exam) => {
    setExamToDelete(exam);
    setIsConfirmDeleteOpen(true);
  };

  const closeConfirmDeleteModal = () => {
    setIsConfirmDeleteOpen(false);
    setExamToDelete(null);
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Exams</h1>
          <p className="mt-4 text-gray-600">List of all available exams.</p>

          <div className="mt-6 text-right">
            <button
              onClick={openAddExamModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Add Exam
            </button>
          </div>

          {/* List of exams */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">Exam List</h2>
            <table className="min-w-full mt-4 table-auto">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-6 py-3 text-left">Exam Name</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <Link
                        to={`/exam-details/${exam.id}`} 
                        className="text-purple-700 hover:underline"
                      >
                        {exam.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4 space-x-3">
                    <button
                        onClick={() => handleViewExam(exam.id)}
                        className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openEditExamModal(exam)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => openConfirmDeleteModal(exam)}
                        className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800 mr-2"
                      >
                        Delete
                      </button>

                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <CreateExamModal
          exam={selectedExam}
          onSave={handleSaveExam}
          onCancel={closeModal}
        />
      )}

      {isConfirmDeleteOpen && examToDelete && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto border border-purple-300">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">Are you sure?</h2>
            <p className="mb-4">Do you really want to delete the exam "{examToDelete.name}"?</p>
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={closeConfirmDeleteModal}
                className="text-sm text-gray-500 px-4 py-2 border rounded-lg hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteExam(examToDelete.id)}
                className="text-sm bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {examDetails && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md">
            <h2 className="text-xl font-bold text-purple-700">Exam Details</h2>
            <p className="mt-4"><strong className="text-purple-700">Exam Name: </strong> {examDetails.name}</p>
            <p className=""><strong className="text-purple-700">Routine: </strong> {examDetails.is_timetable_published ? "Published" : "Not Published"}</p>
            <p className=""><strong className="text-purple-700">Result: </strong> {examDetails.is_result_published ? "Published" : "Not Published"}</p>
            <button
              onClick={() => setExamDetails(null)}
              className="flex justify-self-center mt-4 bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default ExamPrincipal;
