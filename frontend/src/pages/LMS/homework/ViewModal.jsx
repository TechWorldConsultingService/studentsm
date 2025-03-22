   import React from "react";

   const ViewModal = ({ assignment, submission, onClose }) => {
     if (!assignment) return null;
   
     return (
       <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-70 
                       flex items-center justify-center p-4">
         <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg relative">
   
           <h2 className="text-2xl font-bold text-purple-800 mb-4">
             View Assignment
           </h2>
   
           <div className="text-sm space-y-1 mb-4">
             <div>
               <strong>Topic:</strong> {assignment.assignment_name}
             </div>
             <div>
               <strong>Class:</strong> {assignment.class_assigned}
             </div>
             <div>
               <strong>Subject:</strong> {assignment.subject}
             </div>
             <div>
               <strong>Due Date:</strong> {assignment.due_date}
             </div>
             <div>
               <strong>Description:</strong> {assignment.description}
             </div>
             <div>
               <strong>Assigned On:</strong>{" "}
               {new Date(assignment.assigned_on).toISOString().split("T")[0]}
             </div>
           </div>
   
           <div className="my-4 border-t border-gray-300 pt-4">
             <h3 className="font-semibold text-purple-700 mb-2">
               Your Submission:
             </h3>
   
             {!submission ? (
               <p className="text-red-500">Not submitted yet.</p>
             ) : submission.file ? (
               <div>
                 <strong>File:</strong>{" "}
                 <a
                   href={submission.file}
                   target="_blank"
                   rel="noopener noreferrer"
                   className="text-purple-600 underline ml-1"
                 >
                   View/Download
                 </a>
               </div>
             ) : (
               <div>
                 <strong>Answer:</strong>
                 <div className="bg-gray-100 p-2 rounded mt-1 text-sm whitespace-pre-wrap">
                   {submission.text}
                 </div>
               </div>
             )}
           </div>
   
           <div className="flex justify-center">
             <button
               onClick={onClose}
               className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded"
             >
               Close
             </button>
           </div>
         </div>
       </div>
     );
   };
   
   export default ViewModal;
   