import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import BillModal from "./BillModal";

const SuccessInvoice = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const billNumber = queryParams.get("billNumber");

  const [showBillModal, setShowBillModal] = useState(false);

  const handleViewDetails = () => {
    setShowBillModal(true);
  };

  const handleGoBack = () => {
    navigate("/invoicing");
  };

  if (showBillModal) {
    return <BillModal billNumber={billNumber} onClose={handleGoBack} />;
  }

  return (
    <MainLayout>
      <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3">
          <h1 className="text-3xl font-bold text-green-700 mb-4">
            Invoice Created Successfully!
          </h1>
          <p className="mb-6">Your invoice was created successfully.</p>
          <p className="mb-6">Would you like to view and print the invoice?</p>
          <div className="flex space-x-4 items-center justify-center">
            <button
              onClick={handleViewDetails}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
            >
              Yes
            </button>
            <button
              onClick={handleGoBack}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SuccessInvoice;
