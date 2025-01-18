import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useParams, Link } from 'react-router-dom';
import MainLayout from '../../layout/MainLayout';
import { useSelector } from 'react-redux';
import CreateExamDetailModal from './CreateExamDetailModal'; 

const AddExamDetailsByPrincipal = () => {
  const { access } = useSelector((state) => state.user);
  const { examId } = useParams();
  const [examDetails, setExamDetails] = useState([]);
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  
  // Fetch exam details from the server
  useEffect(() => {
    const fetchData = async () => {
      if (!access) {
        toast.error('User is not authenticated. Please log in.');
        return;
      }

      try {
        // Fetch exam details for the specific examId
        const { data: examData } = await axios.get(`http://localhost:8000/api/exam-details/?exam_id=${examId}`, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
          },
        });
        setExamDetails(examData);

        // Fetch available exams, subjects, and classes
        const { data: examsData } = await axios.get('http://localhost:8000/api/exams/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
          },
        });
        setExams(examsData);

        const { data: subjectsData } = await axios.get('http://localhost:8000/api/subjects/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
          },
        });
        setSubjects(subjectsData);

        const { data: classesData } = await axios.get('http://localhost:8000/api/classes/', {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${access}`,
          },
        });
        setClasses(classesData);

      } catch (error) {
        toast.error('Error fetching data.');
      }
    };

    fetchData();
  }, [access, examId]);

  // Open modal for adding new exam detail
  const openAddDetailModal = () => {
    setSelectedDetail(null); // Clear selected detail for adding new
    setIsModalOpen(true);
  };

  // Open modal for editing selected exam detail
  const openEditDetailModal = (detail) => {
    setSelectedDetail(detail);
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDetail(null);
  };

  // Handle deleting an exam detail
  const handleDeleteDetail = async (detailId) => {
    try {
      await axios.delete(`http://localhost:8000/api/exam-details/${detailId}/`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${access}`,
        },
      });
      setExamDetails(examDetails.filter((detail) => detail.id !== detailId));
      toast.success('Exam detail deleted successfully!');
    } catch (error) {
      toast.error('Error deleting exam detail.');
    }
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Exam Details</h1>
          <p className="mt-4 text-gray-600">Details for the selected exam.</p>

          {/* Button to add new exam detail */}
          <div className="mt-6 text-right">
            <button
              onClick={openAddDetailModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Enter Details
            </button>
          </div>

          {/* List of exam details */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">Exam Details List</h2>
            <table className="min-w-full mt-4">
              <thead>
                <tr className="bg-purple-100 text-purple-700">
                  <th className="px-6 py-3 border">Subject</th>
                  <th className="px-6 py-3 border">Class Assigned</th>
                  <th className="px-6 py-3 border">Full Marks</th>
                  <th className="px-6 py-3 border">Pass Marks</th>
                  <th className="px-6 py-3 border">Exam Date</th>
                  <th className="px-6 py-3 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {examDetails.map((detail) => (
                  <tr key={detail.id} className="border-b hover:bg-gray-100">
                    <td className="px-6 py-4">{detail.subject}</td>
                    <td className="px-6 py-4">{detail.class_assigned}</td>
                    <td className="px-6 py-4">{detail.full_marks}</td>
                    <td className="px-6 py-4">{detail.pass_marks}</td>
                    <td className="px-6 py-4">{detail.exam_date}</td>
                    <td className="px-6 py-4 flex gap-2">
                      {/* View Details */}
                      <Link
                        to={`/exam-detail/${detail.id}`} // Link to view detailed information
                        className="text-purple-700 hover:underline"
                      >
                        View Details
                      </Link>
                      {/* Edit Detail */}
                      <button
                        onClick={() => openEditDetailModal(detail)}
                        className="text-purple-700 hover:underline"
                      >
                        Edit
                      </button>
                      {/* Delete Detail */}
                      <button
                        onClick={() => handleDeleteDetail(detail.id)}
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

      {/* Modal for Adding/Editing Exam Details */}
      {isModalOpen && (
        <CreateExamDetailModal
          examDetail={selectedDetail}
          exams={exams}
          subjects={subjects}
          classes={classes}
          onSave={async (newDetail) => {
            try {
              if (selectedDetail) {
                // Update exam detail
                await axios.put(`http://localhost:8000/api/exam-details/${selectedDetail.id}/`, newDetail, {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access}`,
                  },
                });
                toast.success('Exam detail updated successfully!');
              } else {
                // Create new exam detail
                await axios.post('http://localhost:8000/api/exam-details/', newDetail, {
                  headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${access}`,
                  },
                });
                toast.success('Exam detail added successfully!');
              }
              // Fetch updated exam details
              const { data } = await axios.get(`http://localhost:8000/api/exam-details/?exam_id=${examId}`, {
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${access}`,
                },
              });
              setExamDetails(data);
              closeModal(); // Close modal after saving
            } catch (error) {
              toast.error('Error saving exam detail.');
            }
          }}
          onCancel={closeModal}
        />
      )}
    </MainLayout>
  );
};

export default AddExamDetailsByPrincipal;
