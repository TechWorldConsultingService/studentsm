import React from "react";


const ViewNotesModal = ({ tip, onClose }) => {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto">
          <h2 className="text-2xl font-bold text-purple-800 border-b pb-2">
            View Notes
          </h2>
  
          <div className="mt-4 space-y-3">
  
            
            <p className="text-gray-700">
              <strong>Class:</strong> {tip.class_code.class_name} ({tip.class_code.class_code})
            </p>
  
            <p className="text-gray-700">
              <strong>Subject:</strong> {tip.subject.subject_name} ({tip.subject.subject_code})
            </p>
  
            <p className="text-gray-700">
              <strong>Teacher:</strong> {tip.created_by}
            </p>
  
            <p className="text-gray-700">
              <strong>Date:</strong> {new Date(tip.created_at).toISOString().split("T")[0]}
            </p>
            <p className="text-gray-700">
              <strong>Chapter:</strong> {tip.chapter}
            </p>
  
            <p className="text-gray-700">
              <strong>Title:</strong> {tip.title}
            </p>
            <p className="text-gray-700">
              <strong>Description:</strong> {tip.description}
            </p>
  
            {tip.file ? (
              <p className="text-blue-600 underline">
        <a
          href={`http://localhost:8000${tip.file}`} 
          target="_blank"
          rel="noopener noreferrer"
        >                View Attached File
                </a>
              </p>
            ) : (
              <p className="text-gray-500 italic">No file attached</p>
            )}
          </div>
  
          <div className="flex justify-center mt-6">
            <button
              onClick={onClose}
              className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };
 
  export default ViewNotesModal;