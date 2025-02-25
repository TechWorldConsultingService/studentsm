import React, { useState } from "react";
import SelectStudent from "./SelectStudent";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";

const FeePayment = () => {
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const navigate = useNavigate();

  const handleMakePayment = () => {
    if (!selectedStudentId) {
      setErrorMessage("Please select a student.");
      return;
    }
    navigate(`/payment/${selectedStudentId}`, { state: { classId: selectedClassId } });
  };

  return (
    <MainLayout>
      <div className="p-6">
        {/* Payment Button and Error Message */}
        <div className="flex flex-col items-end mb-4">
          <button
            onClick={handleMakePayment}
            className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg"
          >
            Make Payment
          </button>
          {errorMessage && (
            <span className="text-sm text-red-500 mt-2">{errorMessage}</span>
          )}
        </div>

        {/* Reusing the same SelectStudent component */}
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

export default FeePayment;
