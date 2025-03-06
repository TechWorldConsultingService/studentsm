import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import MainLayout from "../../layout/MainLayout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ReceiptModal = ({ paymentNumber, onClose }) => {
  const { access } = useSelector((state) => state.user);
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);
  const receiptRef = useRef(null); // Ref for the receipt content

  useEffect(() => {
    const fetchReceipt = async () => {
      if (!paymentNumber) return;
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/payments/detail/${paymentNumber}/`,
          { headers: { Authorization: `Bearer ${access}` } }
        );
        setReceiptData(data);
      } catch (error) {
        toast.error("Error fetching receipt details");
      } finally {
        setLoading(false);
      }
    };

    fetchReceipt();
  }, [paymentNumber, access]);

  // Download PDF instead of printing
  const downloadPDF = () => {
    if (!receiptRef.current) return;

    html2canvas(receiptRef.current, {
      scale: 2, 
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      const fileName = receiptData
        ? `Receipt_${receiptData.student?.name || paymentNumber}.pdf`
        : `Receipt_${paymentNumber}.pdf`;
      pdf.save(fileName);
    });
  };

  return (
    <MainLayout>
      <div className="fixed inset-0 z-50 bg-gray-700 bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-full overflow-auto">
          <div ref={receiptRef} className="p-4">
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
                  <h2 className="text-lg font-bold text-red-700">RECEIPT</h2>
                  <p className="text-xs">
                    <span className="font-semibold">PAN:</span> 301566090
                  </p>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p>
                      <span className="font-semibold">A/C No:</span>{" "}
                      {receiptData.student?.account_number || "--"}
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
                      {receiptData.student?.name}
                    </p>
                    <p>
                      <span className="font-semibold">Class:</span>{" "}
                      {receiptData.student?.class_name || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Pre Balance:</span>{" "}
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
                      Received from: {receiptData.student?.name}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p>No Receipt data available.</p>
            )}
          </div>

          {/* Download & Close Buttons */}
          {!loading && receiptData && (
            <div className="p-4 pt-0 flex justify-end space-x-2">
              <button
                onClick={downloadPDF}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Download PDF
              </button>
              <button
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default ReceiptModal;
