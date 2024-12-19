import React, { useState, useEffect } from 'react';
import MainLayout from '../../layout/MainLayout';

const TeacherList = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newTeacher, setNewTeacher] = useState({
    teacher_id: '',
    teacher_name: '',
    subject: '',
    email: '',
    phone: '',
  });

  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      try {
        const sampleTeachers = [
          {
            teacher_id: 'T101',
            teacher_name: 'Dr. Mark Lee',
            subject: 'Web Development',
            email: 'mark.lee@example.com',
            phone: '123-555-7890',
          },
          {
            teacher_id: 'T102',
            teacher_name: 'Prof. Jane Doe',
            subject: 'Data Structures',
            email: 'jane.doe@example.com',
            phone: '987-555-4321',
          },
        ];
        setTeachers(sampleTeachers);
      } catch (error) {
        console.error('Error fetching teachers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  const handleViewDetails = (teacherInfo) => {
    setSelectedTeacher(teacherInfo);
  };

  const handleCloseDetails = () => {
    setSelectedTeacher(null);
  };

  const handleShowModal = (teacherInfo = null) => {
    if (teacherInfo) {
      setNewTeacher(teacherInfo);
    } else {
      setNewTeacher({
        teacher_id: '',
        teacher_name: '',
        subject: '',
        email: '',
        phone: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveTeacher = () => {
    if (newTeacher.teacher_id && newTeacher.teacher_name) {
      if (newTeacher.teacher_id) {
        setTeachers((prev) =>
          prev.map((teacherItem) =>
            teacherItem.teacher_id === newTeacher.teacher_id ? { ...newTeacher } : teacherItem
          )
        );
      } else {
        setTeachers((prev) => [...prev, newTeacher]);
      }
      setShowModal(false);
    } else {
      alert('Please provide teacher ID and teacher name.');
    }
  };

  const handleDeleteTeacher = (teacherId) => {
    setTeachers((prev) => prev.filter((teacherItem) => teacherItem.teacher_id !== teacherId));
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">Teachers</h1>
          <p className="mt-4 text-gray-600">
            Manage the teachers and their subjects here.
          </p>

          <div className="mt-6">
            <button
              onClick={() => handleShowModal()}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Add Teacher
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">Available Teachers</h2>
            <p className="text-gray-600 mt-2">
              Browse through the teachers and click on "Details" to learn more. You can also edit or delete teacher records.
            </p>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-gray-600">Loading teachers...</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-4 py-2 text-left">Teacher ID</th>
                    <th className="px-4 py-2 text-left">Teacher Name</th>
                    <th className="px-4 py-2 text-left">Subject</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacherItem) => (
                    <tr key={teacherItem.teacher_id} className="border-b hover:bg-purple-50">
                      <td className="px-4 py-2">{teacherItem.teacher_id}</td>
                      <td className="px-4 py-2">{teacherItem.teacher_name}</td>
                      <td className="px-4 py-2">{teacherItem.subject}</td>
                      <td className="px-4 py-2">
                        <button
                          onClick={() => handleViewDetails(teacherItem)}
                          className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 mr-2"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleShowModal(teacherItem)}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteTeacher(teacherItem.teacher_id)}
                          className="bg-red-700 text-white px-4 py-2 rounded-lg hover:bg-red-800"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal for teacher details */}
        {selectedTeacher && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold text-purple-800">Teacher Details</h2>
              <div className="mt-4">
                <p className="text-gray-700"><strong>Teacher ID:</strong> {selectedTeacher.teacher_id}</p>
                <p className="text-gray-700"><strong>Teacher Name:</strong> {selectedTeacher.teacher_name}</p>
                <p className="text-gray-700"><strong>Subject:</strong> {selectedTeacher.subject}</p>
                <p className="text-gray-700"><strong>Email:</strong> {selectedTeacher.email}</p>
                <p className="text-gray-700"><strong>Phone:</strong> {selectedTeacher.phone}</p>
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={handleCloseDetails}
                  className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal for Add/Edit Teacher */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
              <h2 className="text-2xl font-bold text-purple-800">{newTeacher.teacher_id ? 'Edit' : 'Add'} Teacher</h2>
              <div className="mt-4">
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                  placeholder="Teacher ID"
                  value={newTeacher.teacher_id}
                  onChange={(e) => setNewTeacher({ ...newTeacher, teacher_id: e.target.value })}
                />
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                  placeholder="Teacher Name"
                  value={newTeacher.teacher_name}
                  onChange={(e) => setNewTeacher({ ...newTeacher, teacher_name: e.target.value })}
                />
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                  placeholder="Subject"
                  value={newTeacher.subject}
                  onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
                />
                <input
                  type="email"
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                  placeholder="Email"
                  value={newTeacher.email}
                  onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
                />
                <input
                  type="text"
                  className="border border-gray-300 p-2 rounded w-full mb-4"
                  placeholder="Phone"
                  value={newTeacher.phone}
                  onChange={(e) => setNewTeacher({ ...newTeacher, phone: e.target.value })}
                />
              </div>
              <div className="mt-6 text-center">
                <button
                  onClick={handleSaveTeacher}
                  className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 mr-2"
                >
                  Save
                </button>
                <button
                  onClick={handleCloseModal}
                  className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default TeacherList;
