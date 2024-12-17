import React, { useState, useEffect } from 'react';
import MainLayout from '../../layout/MainLayout';

const ClassList = () => {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newClass, setNewClass] = useState({
    class_id: '',
    class_name: '',
    teacher: '',
    schedule: '',
    classroom: '',
    resources: '',
  });

  // Simulating fetching classes by using sample data
  useEffect(() => {
    const fetchClasses = async () => {
      setLoading(true);
      try {
        const sampleClasses = [
          {
            class_id: 'C101',
            class_name: 'Introduction to Web Development',
            teacher: 'Prof. Jane Doe',
            schedule: 'Mon-Wed, 11:00 AM - 1:00 PM',
            classroom: 'Room 305',
            resources: 'Online resources, Lecture Slides, Practical Assignments',
          },
          {
            class_id: 'C102',
            class_name: 'Advanced Data Structures',
            teacher: 'Dr. Mark Lee',
            schedule: 'Tue-Thu, 2:00 PM - 4:00 PM',
            classroom: 'Room 210',
            resources: 'Textbook, Research Papers, Code Examples',
          },
        ];

        setClasses(sampleClasses);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClasses();
  }, []);

  // Handle showing class details
  const handleViewDetails = (classInfo) => {
    setSelectedClass(classInfo);
  };

  const handleCloseDetails = () => {
    setSelectedClass(null);
  };

  // Open modal for adding/editing a class
  const handleShowModal = (classInfo = null) => {
    if (classInfo) {
      setNewClass(classInfo);
    } else {
      setNewClass({
        class_id: '',
        class_name: '',
        teacher: '',
        schedule: '',
        classroom: '',
        resources: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveClass = () => {
    if (newClass.class_id && newClass.class_name) {
      if (newClass.class_id) {
        setClasses((prev) =>
          prev.map((classItem) =>
            classItem.class_id === newClass.class_id ? { ...newClass } : classItem
          )
        );
      } else {
        setClasses((prev) => [...prev, newClass]);
      }
      setShowModal(false);
    } else {
      alert('Please provide class ID and class name.');
    }
  };

  const handleDeleteClass = (classId) => {
    setClasses((prev) => prev.filter((classItem) => classItem.class_id !== classId));
  };

  return (
    <MainLayout >
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">Classes</h1>
        <p className="mt-4 text-gray-600">
          Explore the available classes and their details here.
        </p>

        <div className="mt-6">
          <button
            onClick={() => handleShowModal()}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
          >
            Add Class
          </button>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-purple-700">Available Classes</h2>
          <p className="text-gray-600 mt-2">
            Browse through the classes and click on "Details" to learn more. You can also edit or delete classes.
          </p>
        </div>

        {loading ? (
          <div className="mt-6 text-center text-gray-600">Loading classes...</div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-4 py-2 text-left">Class ID</th>
                  <th className="px-4 py-2 text-left">Class Name</th>
                  <th className="px-4 py-2 text-left">Teacher</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {classes.map((classItem) => (
                  <tr key={classItem.class_id} className="border-b hover:bg-purple-50">
                    <td className="px-4 py-2">{classItem.class_id}</td>
                    <td className="px-4 py-2">{classItem.class_name}</td>
                    <td className="px-4 py-2">{classItem.teacher}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleViewDetails(classItem)}
                        className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800 mr-2"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleShowModal(classItem)}
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClass(classItem.class_id)}
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

      {/* Modal for class details */}
      {selectedClass && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-2xl font-bold text-purple-800">Class Details</h2>
            <div className="mt-4">
              <p className="text-gray-700"><strong>Class ID:</strong> {selectedClass.class_id}</p>
              <p className="text-gray-700"><strong>Class Name:</strong> {selectedClass.class_name}</p>
              <p className="text-gray-700"><strong>Teacher:</strong> {selectedClass.teacher}</p>
              <p className="text-gray-700"><strong>Schedule:</strong> {selectedClass.schedule}</p>
              <p className="text-gray-700"><strong>Classroom:</strong> {selectedClass.classroom}</p>
              <p className="text-gray-700"><strong>Resources:</strong> {selectedClass.resources}</p>
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

      {/* Modal for Add/Edit Class */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-2xl font-bold text-purple-800">{newClass.class_id ? 'Edit' : 'Add'} Class</h2>
            <div className="mt-4">
              <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full mb-4"
                placeholder="Class ID"
                value={newClass.class_id}
                onChange={(e) => setNewClass({ ...newClass, class_id: e.target.value })}
              />
              <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full mb-4"
                placeholder="Class Name"
                value={newClass.class_name}
                onChange={(e) => setNewClass({ ...newClass, class_name: e.target.value })}
              />
              <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full mb-4"
                placeholder="Teacher"
                value={newClass.teacher}
                onChange={(e) => setNewClass({ ...newClass, teacher: e.target.value })}
              />
              <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full mb-4"
                placeholder="Schedule"
                value={newClass.schedule}
                onChange={(e) => setNewClass({ ...newClass, schedule: e.target.value })}
              />
              <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full mb-4"
                placeholder="Classroom"
                value={newClass.classroom}
                onChange={(e) => setNewClass({ ...newClass, classroom: e.target.value })}
              />
              <input
                type="text"
                className="border border-gray-300 p-2 rounded w-full mb-4"
                placeholder="Resources"
                value={newClass.resources}
                onChange={(e) => setNewClass({ ...newClass, resources: e.target.value })}
              />
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleSaveClass}
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

export default ClassList;
