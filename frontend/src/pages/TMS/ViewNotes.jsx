import React from "react";
import { useNavigate } from "react-router-dom";

const ViewNotes = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  const handleBack = () => {
    navigate(-1); // Go back to the previous page
  };

  return (
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">Tip Details</h1>
        <p className="mt-4 text-gray-600">
          This is the detailed view of the selected tip.
        </p>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <button
            onClick={handleBack}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none"
          >
            Back to Notes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewNotes;
