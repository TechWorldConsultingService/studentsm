import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import ClassLayout from "../../../layout/ClassLayout";
import AssignmentTable from "./components/AssignmentTable";
import NewAssignmentModal from "./components/NewAssignmentModal";
import EditAssignmentModal from "./components/EditAssignmentModal";
import ViewAssignmentModal from "./components/ViewAssignmentModal";
import DeleteAssignmentModal from "./components/DeleteAssignmentModal";
import useFetchData from "../../../hooks/useFetch";

const TeacherHomeworkDashboard = () => {
  const user = useSelector((state) => state.user);
  const { access, id: teacherId, selectedClassName } = user || {};

  const [showNewModal, setShowNewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("All");

  const {
    fetchedData: homeworkList = [],
    loadingData,
    fetchData: fetchHomeworkList,
  } = useFetchData("http://localhost:8000/api/teacher/assignments/");

  const todayDate = new Date().toISOString().split("T")[0];

  const [runningAssignments, setRunningAssignments] = useState([]);
  const [previousAssignments, setPreviousAssignments] = useState([]);

  useEffect(() => {
    if (access && teacherId && selectedClassName) {
      fetch(
        `http://localhost:8000/api/filter-subjects/?teacher=${teacherId}&class_assigned=${selectedClassName}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data?.subjects) setSubjectList(data.subjects);
        })
        .catch((err) => {
          console.error("Error fetching subjects:", err);
        });
    }
  }, [access, teacherId, selectedClassName]);

  useEffect(() => {
    if (!homeworkList?.length) return;

    const running = [];
    const previous = [];
    const today = new Date(todayDate);

    homeworkList.forEach((hw) => {
      if (hw.class_assigned === selectedClassName) {
        const due = new Date(hw.due_date);
        if (due >= today) {
          running.push(hw);
        } else {
          previous.push(hw);
        }
      }
    });
    setRunningAssignments(running);
    setPreviousAssignments(previous);
  }, [homeworkList, todayDate, selectedClassName]);

  const filterBySubject = (assignments) => {
    if (selectedSubject === "All") return assignments;
    return assignments.filter((a) => a.subject === selectedSubject);
  };

  const openNewModal = () => setShowNewModal(true);
  const closeNewModal = () => setShowNewModal(false);

  const openEditModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowEditModal(true);
  };
  const closeEditModal = () => {
    setSelectedAssignment(null);
    setShowEditModal(false);
  };

  const openViewModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewModal(true);
  };
  const closeViewModal = () => {
    setSelectedAssignment(null);
    setShowViewModal(false);
  };

  const openDeleteModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowDeleteModal(true);
  };
  const closeDeleteModal = () => {
    setSelectedAssignment(null);
    setShowDeleteModal(false);
  };

  if (loadingData) {
    return (
      <ClassLayout>
        <div className="p-6 text-center">Loading...</div>
      </ClassLayout>
    );
  }

  const filteredRunning = filterBySubject(runningAssignments);
  const filteredPrevious = filterBySubject(previousAssignments);

  return (
    <ClassLayout>
      <div className="p-6 bg-purple-50 min-h-screen">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-2xl font-extrabold text-purple-800 mb-2">
            Homework For Class: {selectedClassName}
          </h1>

          {/* Subject Filter */}
          <div className="mt-4 flex items-center space-x-2">
            <label className="font-semibold text-gray-600">
              Filter by Subject:
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="border border-gray-300 rounded px-3 py-1 focus:outline-none"
            >
              <option value="All">All</option>
              {subjectList.map((subj) => (
                <option key={subj.id} value={subj.subject_name}>
                  {subj.subject_name}
                </option>
              ))}
            </select>
          </div>

          {/* Create Homework Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={openNewModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none"
            >
               Create New Homework
            </button>
          </div>

          {/* Running Homework */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700 mb-2">
              Running Homework
            </h2>
            <AssignmentTable
              assignments={filteredRunning}
              onEdit={openEditModal}
              onView={openViewModal}
              onDelete={openDeleteModal}
              onViewSubmissions={(assignment) =>
                window.location.assign(
                  `/tms/assignments/${assignment.id}/submissions`
                )
              }
            //   showSubmissions={false} 
            />
            {!filteredRunning.length && (
              <p className="text-gray-500">No Running Homework.</p>
            )}
          </div>

          {/* Previous Homework */}
          <div className="mt-6">
            <h2 className="text-xl font-semibold text-purple-700 mb-2">
              Previously Given Homework
            </h2>
            <AssignmentTable
              assignments={filteredPrevious}
              onView={openViewModal}
              onViewSubmissions={(assignment) =>
                window.location.assign(
                  `/tms/assignments/${assignment.id}/submissions`
                )
              }
              showSubmissions={true}
            />
            {!filteredPrevious.length && (
              <p className="text-gray-500">No Previously Given Homework.</p>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showNewModal && (
        <NewAssignmentModal
          isOpen={showNewModal}
          onClose={closeNewModal}
          access={access}
          subjectList={subjectList}
          selectedClass={selectedClassName}
          fetchHomeworkList={fetchHomeworkList}
        />
      )}

      {showEditModal && selectedAssignment && (
        <EditAssignmentModal
          isOpen={showEditModal}
          onClose={closeEditModal}
          assignment={selectedAssignment}
          fetchHomeworkList={fetchHomeworkList}
        />
      )}

      {showViewModal && selectedAssignment && (
        <ViewAssignmentModal
          isOpen={showViewModal}
          onClose={closeViewModal}
          assignment={selectedAssignment}
        />
      )}

      {showDeleteModal && selectedAssignment && (
        <DeleteAssignmentModal
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          assignment={selectedAssignment}
          fetchHomeworkList={fetchHomeworkList}
        />
      )}
    </ClassLayout>
  );
};

export default TeacherHomeworkDashboard;
