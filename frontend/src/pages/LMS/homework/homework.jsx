import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useFetchData from "../../../hooks/useFetch";
import SubmitModal from "./SubmitModal";
import ViewModal from "./ViewModal";

const AssignmentPage = () => {
  const userData = useSelector((state) => state.user);
  const todayDate = new Date().toISOString().split("T")[0];
  const [previousAssignments, setPreviousAssignments] = useState([]);
  const [runningAssignments, setRunningAssignments] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [submissions, setSubmissions] = useState({});

  const access = userData.access;
  const selectedSubject = userData.selectedSubject;

  const { fetchedData: homeworkList = [], loadingData, errorFetch, fetchData } = useFetchData(
    `http://localhost:8000/api/student/assignments/subject/?subject_id=${selectedSubject}`,
    [selectedSubject]
  )

  useEffect(() => {
    if (homeworkList && todayDate && selectedSubject) {
      const running = [];
      const previous = [];

      homeworkList.forEach((homework) => {
        if(selectedSubject === homework.subject){
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
    },[homeworkList,todayDate,selectedSubject]);

  const handleAssignmentSubmit = ({ file, text, assignment }) => {
    const submission = { file: file ? URL.createObjectURL(file) : null, text };
    setSubmissions((prev) => ({
      ...prev,
      [assignment.id]: submission,
    }));
  };

  const openSubmitModal = (assignment) => {
    if (assignment) {
      setSelectedAssignment(assignment);
      setShowSubmitModal(true);
    }
  };

  const openViewModal = (assignment) => {
    if (assignment) {
      setSelectedAssignment(assignment);
      setShowViewModal(true);
    }
  };

  const closeModals = () => {
    setShowSubmitModal(false);
    setShowViewModal(false);
  }

  if (loadingData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-purple-100 py-8">
      <div className="container mx-auto p-4 bg-white shadow-xl rounded-lg">
        <h1 className="text-2xl font-bold text-center text-purple-800 mb-8">
          Your Homework
        </h1>

        <div className="space-y-4">
          <section>
            <h2 className="text-2xl font-semibold text-purple-800 mb-4">
              New Homework
            </h2>
            {runningAssignments.length === 0 ? (
              <p className="text-gray-600">No new homework</p>
            ) : (
              runningAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-6 rounded-lg shadow-lg mb-4 border border-gray-300"
                >
                  <span className="flex">
                    <strong className="block text-purple-800 mr-2">
                      Class:
                    </strong>
                    {assignment.class_assigned}
                  </span>
                  <span className="flex">
                    <strong className="block text-purple-800 mr-2">
                      Subject:
                    </strong>
                    {assignment.subject}
                  </span>
                  <span className="flex">
                    <strong className="block text-purple-800 mr-2">
                      Topic:
                    </strong>
                    {assignment.assignment_name}
                  </span>
                  <span className="flex">
                    <strong className="block text-purple-800 mr-2">
                      Description:
                    </strong>
                    <p className="italic">{assignment.description}</p>
                  </span>
                  <span className="text-gray-500 block mt-2">
                    Due: {assignment.due_date}
                  </span>
                  <span className="text-gray-500 block ">
                    Assign Date:{" "}
                    {
                      new Date(assignment.assigned_on)
                        .toISOString()
                        .split("T")[0]
                    }
                  </span>
                  <button
                    className="mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-800"
                    onClick={() => openSubmitModal(assignment)}
                  >
                    Submit
                  </button>
                </div>
              ))
            )}
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-purple-800 mb-4">
              Previous Homework
            </h2>
            {previousAssignments.length === 0 ? (
              <p className="text-gray-600">No previous homework</p>
            ) : (
              previousAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="p-6 rounded-lg shadow-lg mb-4 border border-gray-300"
                >
                  <span className="flex">
                    <strong className="block text-purple-800 mr-2">
                      Class:
                    </strong>
                    {assignment.class_assigned}
                  </span>
                  <span className="flex">
                    <strong className="block text-purple-800 mr-2">
                      Subject:
                    </strong>
                    {assignment.subject}
                  </span>
                  <span className="flex">
                    <strong className="block text-purple-800 mr-2">
                      Topic:
                    </strong>
                    {assignment.assignment_name}
                  </span>
                  <span className="flex">
                    <strong className="block text-purple-800 mr-2">
                      Description:
                    </strong>
                    <p className="italic">{assignment.description}</p>
                  </span>
                  <span className="text-gray-500 block mt-2">
                    Due: {assignment.due_date}
                  </span>
                  <span className="text-gray-500 block ">
                    Assign Date:{" "}
                    {
                      new Date(assignment.assigned_on)
                        .toISOString()
                        .split("T")[0]
                    }
                  </span>
                  <button
                    className="mt-4 bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-800"
                    onClick={() => openViewModal(assignment)}
                  >
                    View
                  </button>
                </div>
              ))
            )}
          </section>
        </div>
      </div>

{
  showSubmitModal && (
    <SubmitModal
    assignment={selectedAssignment}
    handleClose={closeModals}
    onSubmit={handleAssignmentSubmit}
  />
  )
}

      {showViewModal && (
        <ViewModal
          assignment={selectedAssignment}
          handleClose={closeModals}
          submission={submissions[selectedAssignment?.id]}
        />
      )}
    </div>
  );
};

export default AssignmentPage;
