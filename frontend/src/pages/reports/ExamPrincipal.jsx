import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import MainLayout from '../../layout/MainLayout';
import CreateExamModal from './CreateExamModal';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom'; // Add Link for navigation

const ExamPrincipal = () => {
  const { access } = useSelector((state) => state.user);
  const [exams, setExams] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedExam, setSelectedExam] = useState(null);

  // Fetch exams from the server
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

  // Open modal for adding a new exam
  const openAddExamModal = () => {
    setSelectedExam(null); // Clear selected exam
    setIsModalOpen(true);
  };

  // Open modal for editing selected exam
  const openEditExamModal = (exam) => {
    setSelectedExam(exam);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedExam(null);
  };

  // Handle saving a new or edited exam (POST Request)
  const handleSaveExam = async (exam) => {
    try {
      const response = await axios.post(
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
      closeModal();
    } catch (error) {
      toast.error('Error creating exam.');
    }
  };

  // Handle deleting an exam (DELETE Request)
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
    } catch (error) {
      toast.error('Error deleting exam.');
    }
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Exams</h1>
          <p className="mt-4 text-gray-600">List of all available exams.</p>

          {/* Button to add a new exam */}
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
            <table className="min-w-full mt-4">
              <thead>
                <tr className="bg-purple-100 text-purple-700">
                  <th className="px-6 py-3 border">Exam Name</th>
                  <th className="px-6 py-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.id} className="border-b hover:bg-gray-100">
                    <td className="px-6 py-4">
                      <Link
                        to={`/exam-details/${exam.id}`} // Link to exam details page
                        className="text-purple-700 hover:underline"
                      >
                        {exam.name}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openEditExamModal(exam)}
                        className="text-purple-700 hover:underline mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteExam(exam.id)}
                        className="text-purple-700 hover:underline"
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

      {/* Exam Modal for Adding/Editing Exam */}
      {isModalOpen && (
        <CreateExamModal
          exam={selectedExam}
          onSave={handleSaveExam}
          onCancel={closeModal}
        />
      )}
    </MainLayout>
  );
};

export default ExamPrincipal;
