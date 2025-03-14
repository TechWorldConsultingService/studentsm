   import React, { useState, useEffect } from "react";
   import { useSelector } from "react-redux";
   import AssignmentCard from "./AssignmentCard";
   import SubmitModal from "./SubmitModal";
   import ViewModal from "./ViewModal";
import useFetchData from "../../../hooks/useFetch";
import SubjectLayout from "../../../layout/SubjectLayout";
   
   const StudentAssignmentsPage = () => {
     const user = useSelector((state) => state.user);
     const { access, selectedSubjectName , selectedSubject} = user || {};
   
     const [runningAssignments, setRunningAssignments] = useState([]);
     const [previousAssignments, setPreviousAssignments] = useState([]);
        const [showSubmitModal, setShowSubmitModal] = useState(false);
     const [showViewModal, setShowViewModal] = useState(false);
     const [selectedAssignment, setSelectedAssignment] = useState(null);
   

     const [submissions, setSubmissions] = useState({});
   
     const todayDate = new Date().toISOString().split("T")[0];
   
     const {
       fetchedData: homeworkList = [],
       loadingData,
       errorFetch,
     } = useFetchData(
       `http://localhost:8000/api/student/assignments/subject/?subject_id=${selectedSubject}`,
       [selectedSubject]
     );
   
     useEffect(() => {
       if (!homeworkList?.length) return;
   
       const running = [];
       const previous = [];
       const today = new Date(todayDate);
   
       homeworkList.forEach((hw) => {
         if (hw.subject === selectedSubjectName) {
           const due = new Date(hw.due_date);
           due >= today ? running.push(hw) : previous.push(hw);
         }
       });
   
       setRunningAssignments(running);
       setPreviousAssignments(previous);
     }, [homeworkList, selectedSubjectName, todayDate]);
   
     const openSubmitModal = (assignment) => {
       setSelectedAssignment(assignment);
       setShowSubmitModal(true);
     };
     const openViewModal = (assignment) => {
       setSelectedAssignment(assignment);
       setShowViewModal(true);
     };
     const closeAllModals = () => {
       setShowSubmitModal(false);
       setShowViewModal(false);
       setSelectedAssignment(null);
     };
   
     const handleAssignmentSubmit = ({ file, text, assignment }) => {
       setSubmissions((prev) => ({
         ...prev,
         [assignment.id]: { file, text },
       }));
     };
   
     if (errorFetch) {
       return (
         <SubjectLayout>
           <div className="text-center p-6 text-red-600">
             Oops! Error: {errorFetch}
           </div>
         </SubjectLayout>
       );

     }
     if (loadingData) {
       return (
         <SubjectLayout>
           <div className="text-center p-6">Loading assignments...</div>
         </SubjectLayout>
       );
     }
   
     return (
       <SubjectLayout>
         <div className="bg-purple-50 min-h-screen py-8">
           <div className="container mx-auto p-4 bg-white shadow-lg rounded-lg">
             <h1 className="text-2xl font-bold text-purple-800 mb-6 text-center">
               {selectedSubjectName} - Your Homework
             </h1>

             <section className="mb-8">
               <h2 className="text-xl font-semibold text-purple-700 mb-4">
                 New Homework
               </h2>
               {runningAssignments.length === 0 ? (
                 <p className="text-gray-600 italic">No new homework.</p>
               ) : (
                 runningAssignments.map((assignment) => (
                   <AssignmentCard
                     key={assignment.id}
                     assignment={assignment}
                     actionText="Submit"
                     onActionClick={() => openSubmitModal(assignment)}
                   />
                 ))
               )}
             </section>

             <section>
               <h2 className="text-xl font-semibold text-purple-700 mb-4">
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
                     onActionClick={() => openViewModal(assignment)}
                   />
                 ))
               )}
             </section>
           </div>
         </div>
   

         {showSubmitModal && selectedAssignment && (
           <SubmitModal
             assignment={selectedAssignment}
             access={access}
             onSubmit={handleAssignmentSubmit}
             onClose={closeAllModals}
           />
         )}
   

         {showViewModal && selectedAssignment && (
           <ViewModal
             assignment={selectedAssignment}
             submission={submissions[selectedAssignment.id]}
             onClose={closeAllModals}
           />
         )}
       </SubjectLayout>
     );
   };
   
   export default StudentAssignmentsPage;
   