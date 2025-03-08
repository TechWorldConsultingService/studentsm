import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import MainLayout from "../../layout/MainLayout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";

const ReceiptModal = ({ paymentNumber, onClose }) => {
  const { access } = useSelector((state) => state.user);
  const [receiptData, setReceiptData] = useState(null);
  const [loading, setLoading] = useState(false);
  const receiptRef = useRef(null); 

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

  const onPrint = () => {
    {
      setTimeout(() => {
        window.print(); 
      }, 500); 
    }
  }

  return (
    <MainLayout>
      <div className="fixed inset-0 z-50 bg-gray-700 bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-full overflow-auto">
          <div ref={receiptRef} className="p-4">
            {loading ? (
              <p>Loading Receipt...</p>
            ) : receiptData ? (
              <div
                className="border-4 border-red-600 p-4 text-sm md:text-base h-fit"
              >
                {/* School Header */}
                <div className="text-center mb-2">
                  <h1 className="text-xl font-bold uppercase text-red-700">
                    Satyam Xaviers English School
                  </h1>
                  <p className="text-xm">Bharatpur-3, Chitwan, Nepal</p>
                  <p className="text-xm">Tel: 055-544545141</p>
                  <p className="text-xm">
                    <span className="text-xm">PAN:</span> 301566090
                  </p>
                </div>

                {/* Receipt Title */}
                <div className="border-b border-red-700 pb-2 mb-2 flex justify-between">
                <p>
                      <span className="font-semibold">Receipt No:</span>{" "}
                      {receiptData.payment_number}
                    </p>
                  <h2 className="text-lg font-bold text-red-700">RECEIPT</h2>
                  <p>
                      <span className="font-semibold">Date:</span>{" "}
                    {format(new Date(receiptData?.date), "yyyy-MM-dd")}
                    </p>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                  <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {receiptData.student?.name}
                    </p>
                    <p>
                      <span className="font-semibold">Parents Name:</span>{" "}
                      {receiptData.student?.parents}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">Class:</span>{" "}
                      {receiptData.student?.class || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Section:</span>{" "}
                      {receiptData.student?.section || "-"}
                    </p>
                  </div>
                </div>

                {/* Paid Amount + Balance Info */}
                <div className="flex justify-between items-center mb-1 border border-red-600 p-2">
                  <div>
                    <p>
                      <span className="font-semibold">Pre-balance Due:</span>{" "}
                      Rs. {receiptData.pre_balance}
                    </p>
                    <p>
                      <span className="font-semibold">Due Remaining:</span>{" "}
                      Rs. {receiptData.post_balance || "0"}
                    </p>
                  </div>
                  <div>
                  <p>
                      <span className="font-semibold">Amount Paid:</span>{" "}
                      Rs. {receiptData.amount_paid}
                    </p>
                  </div>
                </div>

                {/* Remarks */}
                <div >
                  <p>
                    <span className="font-semibold">Remarks:</span>{" "}
                    {receiptData.remarks || "-"}
                  </p>
                </div>

                {/* Signatures */}
                <div className="flex justify-end">
                  <div className="text-center">
                    <p className="font-semibold">Cassier</p>
                    <p > {receiptData.created_by}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p>No Receipt data available.</p>
            )}
          </div>

          {/* Download & Close Buttons */}
          {!loading && receiptData && (
            <div className="p-4 pt-0 flex justify-end space-x-2 print:hidden">
                            <button
                onClick={onPrint}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
              >
                Print
              </button>
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
