import React, { useState, useEffect } from 'react';
import MainLayout from '../../layout/MainLayout';

const SubjectList = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newSubject, setNewSubject] = useState({
    subject_code: '',
    subject_name: '',
    description: '',
    teacher: '',
    resources: '',
    schedule: '',
  });

  // Simulating fetching subjects by using sample data
  useEffect(() => {
    const fetchSubjects = async () => {
      setLoading(true);
      try {
        const sampleSubjects = [
          {
            subject_code: '104',
            subject_name: 'Computer Science',
            description: 'An introduction to the principles of computer science.',
            teacher: 'Prof. John Doe',
            resources: 'Textbooks, Slides, Exercises',
            schedule: 'Mon-Wed-Fri, 10:00 AM - 12:00 PM',
          },
          {
            subject_code: '105',
            subject_name: 'Mathematics',
            description: 'A deep dive into algebra, calculus, and geometry.',
            teacher: 'Dr. Alice Smith',
            resources: 'Online notes, Textbook, Practice Problems',
            schedule: 'Tue-Thu, 9:00 AM - 11:00 AM',
          },
        ];

        setSubjects(sampleSubjects);
      } catch (error) {
        console.error('Error fetching subjects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Handle showing the subject details
  const handleViewDetails = (subjectInfo) => {
    setSelectedSubject(subjectInfo);
  };

  const handleCloseDetails = () => {
    setSelectedSubject(null);
  };

  // Open modal for adding/editing a subject
  const handleShowModal = (subject = null) => {
    if (subject) {
      setNewSubject(subject);
    } else {
      setNewSubject({
        subject_code: '',
        subject_name: '',
        description: '',
        teacher: '',
        resources: '',
        schedule: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveSubject = () => {
    if (newSubject.subject_code && newSubject.subject_name) {
      if (newSubject.subject_code) {
        setSubjects((prev) =>
          prev.map((subject) =>
            subject.subject_code === newSubject.subject_code
              ? { ...newSubject }
              : subject
          )
        );
      } else {
        setSubjects((prev) => [...prev, newSubject]);
      }
      setShowModal(false);
    } else {
      alert('Please provide subject code and subject name.');
    }
  };

  const handleDeleteSubject = (subjectCode) => {
    setSubjects((prev) => prev.filter((subject) => subject.subject_code !== subjectCode));
  };

  return (
    <MainLayout >
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">Subjects</h1>
        <p className="mt-4 text-gray-600">
          Explore the subjects offered and their details here.
        </p>

        <div className="mt-6">
          <button
            onClick={() => handleShowModal()}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
          >
            Add Subject
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-purple-700">Available Subjects</h2>
          <p className="text-gray-600 mt-2">
            Browse through the subjects and click on "Details" to learn more. You can also edit or delete subjects.
          </p>
        </div>

        {loading ? (
          <div className="mt-6 text-center text-gray-600">Loading subjects...</div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-4 py-2 text-left">Subject Code</th>
                  <th className="px-4 py-2 text-left">Subject Name</th>
                  <th className="px-4 py-2 text-left">Teacher</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {subjects.map((subject) => (
                  <tr key={subject.subject_code} className="border-b hover:bg-purple-50">
                    <td className="px-4 py-2">{subject.subject_code}</td>
                    <td className="px-4 py-2">{subject.subject_name}</td>
                    <td className="px-4 py-2">{subject.teacher}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleViewDetails(subject)}
                        className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 mr-2"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleShowModal(subject)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSubject(subject.subject_code)}
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

      {/* Modal for subject details */}
      {selectedSubject && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-2xl font-bold text-purple-800">Subject Details</h2>
            <div className="mt-4">
              <p className="text-gray-700"><strong>Subject Code:</strong> {selectedSubject.subject_code}</p>
              <p className="text-gray-700"><strong>Subject Name:</strong> {selectedSubject.subject_name}</p>
              <p className="text-gray-700"><strong>Description:</strong> {selectedSubject.description}</p>
              <p className="text-gray-700"><strong>Teacher:</strong> {selectedSubject.teacher}</p>
              <p className="text-gray-700"><strong>Resources:</strong> {selectedSubject.resources}</p>
              <p className="text-gray-700"><strong>Schedule:</strong> {selectedSubject.schedule}</p>
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

      {/* Modal for Add/Edit Subject */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-2xl font-bold text-purple-800">{newSubject.subject_code ? 'Edit' : 'Add'} Subject</h2>
            <div className="mt-4">
              <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full mb-4"
                placeholder="Subject Code"
                value={newSubject.subject_code}
                onChange={(e) => setNewSubject({ ...newSubject, subject_code: e.target.value })}
              />
              <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full mb-4"
                placeholder="Subject Name"
                value={newSubject.subject_name}
                onChange={(e) => setNewSubject({ ...newSubject, subject_name: e.target.value })}
              />
              <textarea
                className="border border-gray-300 p-2 rounded w-full mb-4"
                placeholder="Description"
                value={newSubject.description}
                onChange={(e) => setNewSubject({ ...newSubject, description: e.target.value })}
              />
              <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full mb-4"
                placeholder="Teacher"
                value={newSubject.teacher}
                onChange={(e) => setNewSubject({ ...newSubject, teacher: e.target.value })}
              />
              <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full mb-4"
                placeholder="Resources"
                value={newSubject.resources}
                onChange={(e) => setNewSubject({ ...newSubject, resources: e.target.value })}
              />
              <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full mb-4"
                placeholder="Schedule"
                value={newSubject.schedule}
                onChange={(e) => setNewSubject({ ...newSubject, schedule: e.target.value })}
              />
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleSaveSubject}
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

export default SubjectList;
