import React, { useState } from 'react';
import SelectStudent from './SelectStudent';
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";


const Invoicing = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const navigate = useNavigate();

  const handleViewLedger = () => {
    if (!selectedStudentId) {
      setErrorMessage("Please select a student.");
      return;
    }
    navigate(`/invoicing/${selectedStudentId}`, { state: { classId: selectedClassId } });
  };

  return (
    <MainLayout >
    <div >
      {/* View Ledger Button and Error Message */}
      <div className="flex flex-col justify-self-end pt-4 pr-16">
        <button
          onClick={handleViewLedger}
          className="bg-purple-700 hover:bg-purple-800 w-fit text-white px-6 py-2 rounded-lg"
        >
          View Ledger
        </button>
        {errorMessage && <span className="text-sm text-red-500">{errorMessage}</span>}
      </div>


      <SelectStudent 
        setErrorMessage={setErrorMessage}
        selectedClassId={selectedClassId}
        setSelectedClassId={setSelectedClassId}
        selectedStudentId={selectedStudentId}
        setSelectedStudentId={setSelectedStudentId}
      />
      

    </div>
    </MainLayout>
  );
};

export default Invoicing;
