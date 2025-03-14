import React, { useState, useEffect } from "react";
import NewAssignment from "./NewAssignment";
import AssignmentSubmissions from "./AssignmentSubmission";
import EditAssignment from "./EditAssignment";
import DeleteAssignment from "./DeleteAssignment";
import ViewAssignment from "./ViewAssignment";
import { useSelector } from "react-redux";
import useFetchData from "../../../hooks/useFetch";
import ClassLayout from "../../../layout/ClassLayout";

const ClassHomework = () => {
  const [newHomeworkModal, setNewHomeworkModal] = useState(false);
  const [showSubmissionsModal, setShowSubmissionsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  const [previousAssignments, setPreviousAssignments] = useState([]);
  const [runningAssignments, setRunningAssignments] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const user = useSelector((state) => state.user);
  const { access } = user;
  const teacher_id = user?.id;
  const selectedClass = user?.selectedClassName;
  const todayDate = new Date().toISOString().split("T")[0];

  useEffect(() => {
      if (access && teacher_id && selectedClass) {
        fetch(
          `http://localhost:8000/api/filter-subjects/?teacher=${teacher_id}&class_assigned=${selectedClass}`
        )
          .then((response) => response.json())
          .then((data) => {
            if (data?.subjects) {
              setSubjectList(data.subjects);
            }
          })
          .catch((error) => {
            console.error("Error fetching subjects:", error);
          });
      }
    }, [access, teacher_id, selectedClass]);

  // Custom fetch hook to get assignments
  const {
    fetchedData: homeworkList = [],
    loadingData,
    fetchData: fetchHomeworkList,
  } = useFetchData("http://localhost:8000/api/teacher/assignments/");

  // Fetch subjects the teacher can assign
  useEffect(() => {
    if (access && teacher_id && selectedClass) {
      fetch(
        `http://localhost:8000/api/filter-subjects/?teacher=${teacher_id}&class_assigned=${selectedClass}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data?.subjects) {
            setSubjects(data.subjects);
          }
        })
        .catch((error) => {
          console.error("Error fetching subjects:", error);
        });
    } else {
      console.error("Teacher ID or class is undefined");
    }
  }, [access, teacher_id, selectedClass]);

  // Divide homework into running vs previous based on due date
  useEffect(() => {
    if (homeworkList && todayDate && selectedClass) {
      const running = [];
      const previous = [];
      homeworkList.forEach((homework) => {
        if (selectedClass === homework.class_assigned) {
          const dueDate = new Date(homework.due_date);
          const today = new Date(todayDate);
          if (dueDate >= today) {
            running.push(homework);
          } else {
            previous.push(homework);
          }
        }
      });
      setRunningAssignments(running);
      setPreviousAssignments(previous);
    }
  }, [homeworkList, todayDate, selectedClass]);

  const toggleNewHomeworkModal = () =>
    setNewHomeworkModal(!newHomeworkModal);

  // Functions to open modals for different actions
  const openEditModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowEditModal(true);
  };

  const openDeleteModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDeleteModal(true);
  };

  const openViewModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewModal(true);
  };

  const openSubmissionsModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmissionsModal(true);
  };

  if (loadingData) {
    return <div>Loading...</div>;
  }

  return (
    <ClassLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-2xl font-extrabold text-purple-800">
            Homework Of Class: {selectedClass}
          </h1>

          {/* New Homework Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={toggleNewHomeworkModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none"
            >
              Create New Homework
            </button>
          </div>

          {/* Running Homework Table */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">
              Running Homework
            </h2>
            {runningAssignments.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead>
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Subject</th>
                    <th className="px-4 py-2">Topic</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Due Date</th>
                    <th className="px-4 py-2">Assigned On</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {runningAssignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td className="px-4 py-2">{assignment.id}</td>
                      <td className="px-4 py-2">{assignment.subject}</td>
                      <td className="px-4 py-2">{assignment.assignment_name}</td>
                      <td className="px-4 py-2">{assignment.description}</td>
                      <td className="px-4 py-2">{assignment.due_date}</td>
                      <td className="px-4 py-2">
                        {new Date(assignment.assigned_on)
                          .toISOString()
                          .split("T")[0]}
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => openEditModal(assignment)}
                          className="text-blue-600 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => openViewModal(assignment)}
                          className="text-green-600 hover:underline"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openDeleteModal(assignment)}
                          className="text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600 mt-4">No Running Homework.</p>
            )}
          </div>

          {/* Previously Given Homework Table */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700">
              Previously Given Homework
            </h2>
            {previousAssignments.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 mt-4">
                <thead>
                  <tr>
                    <th className="px-4 py-2">ID</th>
                    <th className="px-4 py-2">Subject</th>
                    <th className="px-4 py-2">Topic</th>
                    <th className="px-4 py-2">Description</th>
                    <th className="px-4 py-2">Due Date</th>
                    <th className="px-4 py-2">Assigned On</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {previousAssignments.map((assignment) => (
                    <tr key={assignment.id}>
                      <td className="px-4 py-2">{assignment.id}</td>
                      <td className="px-4 py-2">{assignment.subject}</td>
                      <td className="px-4 py-2">{assignment.assignment_name}</td>
                      <td className="px-4 py-2">{assignment.description}</td>
                      <td className="px-4 py-2">{assignment.due_date}</td>
                      <td className="px-4 py-2">
                        {new Date(assignment.assigned_on)
                          .toISOString()
                          .split("T")[0]}
                      </td>
                      <td className="px-4 py-2 space-x-2">
                        <button
                          onClick={() => openViewModal(assignment)}
                          className="text-green-600 hover:underline"
                        >
                          View
                        </button>
                        <button
                          onClick={() => openSubmissionsModal(assignment)}
                          className="text-purple-600 hover:underline"
                        >
                          View Submissions
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600 mt-4">
                No Previously Given Homework.
              </p>
            )}
          </div>

          {/* New Homework Modal */}
          {newHomeworkModal && (
            <NewAssignment
              closeModal={toggleNewHomeworkModal}
              access={access}
              subjects={subjects}
              selectedClass={selectedClass}
              fetchHomeworkList={fetchHomeworkList}
            />
          )}

          {/* Edit Assignment Modal */}
          {showEditModal && selectedAssignment && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 max-h-[90vh] overflow-y-auto relative">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="absolute top-2 right-2 text-2xl text-blue-700 hover:text-blue-900"
                >
                  X
                </button>
                <h2 className="text-xl font-bold mb-4">Edit Assignment</h2>
                <EditAssignment
                  assignment={selectedAssignment}
                  closeModal={() => setShowEditModal(false)}
                  fetchHomeworkList={fetchHomeworkList}
                />
              </div>
            </div>
          )}

          {/* Delete Assignment Modal */}
          {showDeleteModal && selectedAssignment && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 max-h-[90vh] overflow-y-auto relative">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="absolute top-2 right-2 text-2xl text-red-700 hover:text-red-900"
                >
                  X
                </button>
                <h2 className="text-xl font-bold mb-4">Delete Assignment</h2>
                <DeleteAssignment
                  assignment={selectedAssignment}
                  closeModal={() => setShowDeleteModal(false)}
                  fetchHomeworkList={fetchHomeworkList}
                />
              </div>
            </div>
          )}

          {/* View Assignment Modal */}
          {showViewModal && selectedAssignment && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 max-h-[90vh] overflow-y-auto relative">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="absolute top-2 right-2 text-2xl text-green-700 hover:text-green-900"
                >
                  X
                </button>
                <h2 className="text-xl font-bold mb-4">View Assignment Details</h2>
                <ViewAssignment
                  assignment={selectedAssignment}
                  closeModal={() => setShowViewModal(false)}
                />
              </div>
            </div>
          )}

          {/* Assignment Submissions Modal */}
          {showSubmissionsModal && selectedAssignment && (
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-3/4 max-h-[90vh] overflow-y-auto relative">
                <button
                  onClick={() => setShowSubmissionsModal(false)}
                  className="absolute top-2 right-2 text-2xl text-purple-700 hover:text-purple-900"
                >
                  X
                </button>
                <AssignmentSubmissions
                  assignmentId={selectedAssignment.id}
                  closeModal={() => setShowSubmissionsModal(false)}
                />
              </div>
            </div>
          )}

        </div>
      </div>
    </ClassLayout>
  );
};

export default ClassHomework;
