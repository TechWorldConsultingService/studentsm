import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";

const ReceiptModal = ({ paymentNumber, onClose }) => {
  const { access } = useSelector((state) => state.user);
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReceipt = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/payments/detail/${paymentNumber}/`,
          { headers: { Authorization: `Bearer ${access}` } }
        );
        setReceiptData(data);
      } catch (error) {
        toast.error("Error fetching receipt details");
      }
      setLoading(false);
    };
    if (paymentNumber) {
      fetchReceipt();
    }
  }, [paymentNumber, access]);

  const handlePrint = () => {
    const printContents = document.getElementById("print-receipt").innerHTML;
    const newWindow = window.open("", "", "width=800,height=600");
    newWindow.document.write(`
      <html>
        <head>
          <title>Print Receipt</title>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">
          <style>
            body {
              background-color: #fff;
            }
            @page {
              margin: 1in;
            }
          </style>
        </head>
        <body class="p-4">
          ${printContents}
        </body>
      </html>
    `);
    newWindow.document.close();
    newWindow.focus();
    newWindow.print();
    newWindow.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-700 bg-opacity-50 flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-full overflow-auto">


        {/* Content */}
        <div className="p-4" id="print-receipt">
          {loading ? (
            <p>Loading Receipt...</p>
          ) : receiptData ? (
            <div
              className="border-4 border-red-600 p-4 text-sm md:text-base relative"
              style={{ minHeight: "600px" }}
            >
              {/* School Header */}
              <div className="text-center mb-2">
                <h1 className="text-xl font-bold uppercase text-red-700">
                  Satyam Xaviers English School
                </h1>
                <p className="text-xs">Bharatpur-3, Chitwan, Nepal</p>
                <p className="text-xs">Tel: 055-6554555</p>
              </div>

              {/* Receipt Title */}
              <div className="border-b border-red-700 pb-2 mb-2 flex justify-between items-center">
                <h2 className="text-lg font-bold text-red-700  ">
                  RECEIPT
                </h2>
                <p className="text-xs">
                  <span className="font-semibold">PAN:</span> 301566090
                </p>
              </div>

              {/* Basic Info Row */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p>
                    <span className="font-semibold">A/C No:</span>{" "}
                    {receiptData.student.account_number || "--"}
                  </p>
                  <p>
                    <span className="font-semibold">Receipt No:</span>{" "}
                    {receiptData.payment_number}
                  </p>
                  <p>
                    <span className="font-semibold">Date:</span>{" "}
                    {new Date(receiptData.date).toLocaleString()}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold">Name:</span>{" "}
                    {receiptData.student.name}
                  </p>
                  <p>
                    <span className="font-semibold">Class:</span>{" "}
                    {receiptData.student.class_name || "-"}
                  </p>
                  <p>
                    <span className="font-semibold">Pre Balance:</span>{" "}
                    {/* If your API provides it */}
                    Rs. {receiptData.pre_balance || "0"}
                  </p>
                </div>
              </div>

              {/* Paid Amount + Balance Info */}
              <div className="flex justify-between items-center mb-4 border border-red-600 p-2">
                <div>
                  <p>
                    <span className="font-semibold">Amount Paid:</span>{" "}
                    Rs. {receiptData.amount_paid}
                  </p>
                  <p>
                    <span className="font-semibold">Balance Due:</span>{" "}
                    {/* If your API provides it */}
                    Rs. {receiptData.balance_due || "0"}
                  </p>
                </div>
                <div>
                  <p>
                    <span className="font-semibold">Paid up to:</span>{" "}
                    {receiptData.paid_upto || "N/A"}
                  </p>
                </div>
              </div>

              {/* Remarks */}
              <div className="mb-4">
                <p>
                  <span className="font-semibold">Remarks:</span>{" "}
                  {receiptData.remarks || "-"}
                </p>
              </div>

              {/* Signatures */}
              <div className="flex justify-between mt-6">
                <div className="text-center">
                  <p className="font-semibold">Cashier</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">
                    Received from: {receiptData.student.name}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <p>No Receipt data available.</p>
          )}
        </div>

        {/* Print Button */}
        {!loading && receiptData && (
          <div className="p-4 pt-0 flex justify-end space-x-2">
            <button
              onClick={handlePrint}
              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
            >
              Print
            </button>
            <button
          onClick={onClose}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
        >
          Close
        </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReceiptModal;
