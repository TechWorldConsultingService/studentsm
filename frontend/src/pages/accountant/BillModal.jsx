import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import MainLayout from "../../layout/MainLayout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const BillModal = ({ billNumber, onClose }) => {
  const { access } = useSelector((state) => state.user);
  const [billData, setBillData] = useState(null);
  const [loading, setLoading] = useState(false);
  const billRef = useRef(null); // Ref for the bill content

  useEffect(() => {
    const fetchBill = async () => {
      if (!billNumber) return;
      setLoading(true);
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/bills/detail/${billNumber}/`,
          {
            headers: { Authorization: `Bearer ${access}` },
          }
        );
        setBillData(data);
      } catch (error) {
        toast.error("Error fetching bill details");
      } finally {
        setLoading(false);
      }
    };

    fetchBill();
  }, [billNumber, access]);

  // Download PDF instead of printing
  const downloadPDF = () => {
    if (!billRef.current) return;

    html2canvas(billRef.current, {
      scale: 2, 
      backgroundColor: "#ffffff",
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      const fileName = billData
        ? `Bill_${billData.student?.name || billNumber}.pdf`
        : `Bill_${billNumber}.pdf`;
      pdf.save(fileName);
    });
  };

  return (
    <MainLayout>
      <div className="fixed inset-0 z-50 bg-gray-700 bg-opacity-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-full overflow-auto">
          <div ref={billRef} className="p-4">
            {loading ? (
              <p>Loading Bill...</p>
            ) : billData ? (
              <div
                className="border-4 border-blue-600 p-4 text-sm md:text-base relative"
                style={{ minHeight: "800px" }}
              >
                {/* School Header */}
                <div className="text-center mb-2">
                  <h1 className="text-xl font-bold uppercase text-blue-700">
                    Satyam Xaviers English School
                  </h1>
                  <p className="text-xs">Bharatpur-3, Chitwan, Nepal</p>
                  <p className="text-xs">Tel: 055-544545141</p>
                </div>

                {/* Bill Title */}
                <div className="border-b border-blue-700 pb-2 mb-2 flex justify-between items-center">
                  <h2 className="text-lg font-bold text-blue-700 tracking-wider">
                    INTIMATION - BILL
                  </h2>
                  <p className="text-xs">
                    <span className="font-semibold">PAN:</span> 301566090
                  </p>
                </div>

                {/* Header Info */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {billData.student?.name}
                    </p>
                    <p>
                      <span className="font-semibold">Class:</span>{" "}
                      {billData.student?.class_name || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">A/C No:</span>{" "}
                      {billData.student?.account_number || "--"}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">Month:</span>{" "}
                      {billData.month || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Bill No:</span>{" "}
                      {billNumber}
                    </p>
                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Fee Descriptions Table */}
                <div className="mb-4">
                  <table className="w-full text-left border border-blue-600">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="border border-blue-600 px-2 py-1 w-12">
                          S.No
                        </th>
                        <th className="border border-blue-600 px-2 py-1">
                          Fee Descriptions
                        </th>
                        <th className="border border-blue-600 px-2 py-1 w-24 text-right">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {billData.fee_categories?.map((fee, idx) => (
                        <tr key={fee.id}>
                          <td className="border border-blue-600 px-2 py-1">
                            {idx + 1}
                          </td>
                          <td className="border border-blue-600 px-2 py-1">
                            {fee.fee_category}
                          </td>
                          <td className="border border-blue-600 px-2 py-1 text-right">
                            Rs. {fee.amount}
                          </td>
                        </tr>
                      ))}
                      {billData.transportation_fee && (
                        <tr>
                          <td className="border border-blue-600 px-2 py-1">
                            {billData.fee_categories?.length + 1}
                          </td>
                          <td className="border border-blue-600 px-2 py-1">
                            Transport ({billData.transportation_fee.name})
                          </td>
                          <td className="border border-blue-600 px-2 py-1 text-right">
                            Rs. {billData.transportation_fee.amount}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Balances & Totals */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="border border-blue-600 p-2">
                    <p>
                      <span className="font-semibold">
                        Dr/Cr Balance From Last Month:
                      </span>{" "}
                      Rs. {billData.previous_balance || "0"}
                    </p>
                    <p>
                      <span className="font-semibold">
                        This Month's Total:
                      </span>{" "}
                      Rs. {billData.subtotal || "0"}
                    </p>
                  </div>
                  <div className="border border-blue-600 p-2">
                    <p>
                      <span className="font-semibold">Total Balance Due:</span>{" "}
                      Rs. {billData.total_amount || "0"}
                    </p>
                  </div>
                </div>

                {/* Remarks */}
                <div className="mb-4">
                  <p>
                    <span className="font-semibold">Remarks:</span>{" "}
                    {billData.remarks || "-"}
                  </p>
                </div>

                {/* Signature Area */}
                <div className="flex justify-end mt-4">
                  <div className="text-center">
                    <p className="font-semibold">Accountant</p>
                  </div>
                </div>

                <div
                  className="text-blue-600 text-xs font-semibold mt-4"
                  style={{ width: "200px" }}
                >
                  This bill must be presented at the time of payment
                </div>
              </div>
            ) : (
              <p>No Bill data available.</p>
            )}
          </div>

          {/* Download & Close Buttons */}
          {!loading && billData && (
            <div className="p-4 pt-0 flex justify-end space-x-2">
              <button
                onClick={downloadPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              >
                Download PDF
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
    </MainLayout>
  );
};

export default BillModal;
