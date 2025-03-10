import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import useFetchData from "../../../hooks/useFetch";
import SubjectLayout from "../../../layout/SubjectLayout";

import SubmitModal from "./SubmitModal";
import ViewModal from "./ViewModal";
import AssignmentCard from "./AssignmentCard";

const AssignmentPage = () => {
  const userData = useSelector((state) => state.user);
  const todayDate = new Date().toISOString().split("T")[0];

  const [previousAssignments, setPreviousAssignments] = useState([]);
  const [runningAssignments, setRunningAssignments] = useState([]);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  // Local store of submissions for "quick view" (client-side only)
  const [submissions, setSubmissions] = useState({});

  const access = userData.access;
  const selectedSubject = userData.selectedSubject;

  const {
    fetchedData: homeworkList = [],
    loadingData,
    errorFetch,
  } = useFetchData(
    `http://localhost:8000/api/student/assignments/subject/?subject_id=${selectedSubject}`,
    [selectedSubject]
  );

  useEffect(() => {
    if (homeworkList && selectedSubject) {
      const running = [];
      const previous = [];

      homeworkList.forEach((homework) => {
        if (selectedSubject === homework.subject) {
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
  }, [homeworkList, selectedSubject, todayDate]);

  const handleAssignmentSubmit = ({ file, text, assignment }) => {
    const submission = {
      file: file ? URL.createObjectURL(file) : null,
      text,
    };

    // Provide local preview, so the user sees they've submitted
    setSubmissions((prev) => ({
      ...prev,
      [assignment.id]: submission,
    }));
  };

  const openSubmitModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowSubmitModal(true);
  };

  const openViewModal = (assignment) => {
    setSelectedAssignment(assignment);
    setShowViewModal(true);
  };

  const closeModals = () => {
    setShowSubmitModal(false);
    setShowViewModal(false);
    setSelectedAssignment(null);
  };


  if (errorFetch) {
    return (
      <SubjectLayout>
        <div className="text-center p-4 text-red-600">
          Oops! Something went wrong: {errorFetch}
        </div>
      </SubjectLayout>
    );
  }

  return (
    <SubjectLayout>
      <div className="bg-purple-100 py-8 min-h-screen">
        <div className="container mx-auto p-4 bg-white shadow-xl rounded-lg">
          <h1 className="text-3xl font-bold text-center text-purple-800 mb-8">
            Your Homework
          </h1>

          <div className="space-y-8">
            {/* Running (New) Homework Section */}
            <section>
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">
                New Homework
              </h2>
              {runningAssignments.length === 0 ? (
                <p className="text-gray-600 italic">No new homework available.</p>
              ) : (
                runningAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    actionText="Submit"
                    onActionClick={openSubmitModal}
                  />
                ))
              )}
            </section>

            {/* Previous Homework Section */}
            <section>
              <h2 className="text-2xl font-semibold text-purple-800 mb-4">
                Previous Homework
              </h2>
              {previousAssignments.length === 0 ? (
                <p className="text-gray-600 italic">No previous homework.</p>
              ) : (
                previousAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    actionText="View"
                    onActionClick={openViewModal}
                  />
                ))
              )}
            </section>
          </div>
        </div>

        {/* Submit Assignment Modal */}
        {showSubmitModal && (
          <SubmitModal
            assignment={selectedAssignment}
            handleClose={closeModals}
            onSubmit={handleAssignmentSubmit}
            access={access}
          />
        )}

        {/* View Submission Modal */}
        {showViewModal && (
          <ViewModal
            assignment={selectedAssignment}
            handleClose={closeModals}
            submission={submissions[selectedAssignment?.id]}
          />
        )}
      </div>
    </SubjectLayout>
  );
};

export default AssignmentPage;
