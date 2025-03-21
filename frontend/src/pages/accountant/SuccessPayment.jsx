import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import ReceiptModal from "./ReceiptModal";

const SuccessPayment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const paymentNumber = searchParams.get("paymentNumber");

  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const handleViewDetails = () => {
    setShowReceiptModal(true);
  };

  const handleGoBack = () => {
    navigate("/feePayment");
  };

  if (showReceiptModal) {
    return (
      <ReceiptModal paymentNumber={paymentNumber} onClose={handleGoBack} />
    );
  }

  return (
    <MainLayout>
      <div className=" flex justify-center  bg-gradient-to-br from-purple-100 to-purple-200 p-4">
        <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-md text-center border border-green-300">
          <div className="mb-4">
            <svg
              className="mx-auto h-16 w-16 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-green-700 mb-4">
            Successful!
          </h1>
          <p className="mb-6">Your payment was processed successfully.</p>
          <p className="mb-6">
            Would you like to view the payment receipt details?
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleViewDetails}
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
            >
              Yes
            </button>
            <button
              onClick={handleGoBack}
              className="bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SuccessPayment;
