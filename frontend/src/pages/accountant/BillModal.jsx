import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import MainLayout from "../../layout/MainLayout";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { format } from "date-fns";


const BillModal = ({ billNumber, onClose }) => {
  const { access, first_name, last_name } = useSelector((state) => state.user);
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
        <div className="bg-white p-1 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-full overflow-auto">
          <div ref={billRef} className="p-1">
            {loading ? (
              <p>Loading Bill...</p>
            ) : billData ? (
              <div
                className="border-4 border-blue-600 p-4 text-sm md:text-base relative h-fit"
                // style={{ minHeight: "400px" }}
              >
                {/* School Header */}
                <div className="text-center mb-2">
                  <h1 className="text-xl font-bold uppercase text-blue-700">
                    Satyam Xaviers English School
                  </h1>
                  <p className="text-xm">Bharatpur-3, Chitwan, Nepal</p>
                  <p className="text-xm">Tel: 055-544545141</p>
                  <p className="text-xm">
                    <span className="text-xm">PAN:</span> 301566090
                  </p>
                </div>

                {/* Bill Title */}

                <div className="border-b border-blue-700 pb-2 mb-2 flex justify-between ">
                <p>
                      <span className="font-semibold">Bill No:</span>{" "}
                      {billNumber}
                    </p>
                  <h2 className="text-lg  font-bold text-blue-700 tracking-wider">
                    INTIMATION - BILL
                  </h2>
                  <p>
                      <span className="font-semibold">Date:</span>{" "}
                    {format(new Date(billData.date), "yyyy-MM-dd")}
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
                      {billData.student?.class || "-"}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">Month:</span>{" "}
                      {billData.month || "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Section:</span>{" "}
                      {billData.student?.class_name || "-"}
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
                      Rs. {billData.pre_balance || "0"}
                    </p>
                    <p>
                      <span className="font-semibold">Balance Due Amount:</span>{" "}
                      Rs. {billData.post_balance || "0"}
                    </p>
                  </div>
                  <div className="border border-blue-600 p-2">
                  <p>
                      <span className="font-semibold">Sub-total:</span>{" "}
                      Rs. {billData.subtotal || "0"}
                    </p>
                  <p>
                      <span className="font-semibold">Discount:</span>{" "}
                      Rs. {billData.discount || "0"}
                    </p>
                    <p>
                      <span className="font-semibold">Total:</span>{" "}
                      Rs. {billData.total_amount || "0"}
                    </p>
                  </div>
                </div>

                {/* Remarks */}
                <div >
                  <p>
                    <span className="font-semibold">Remarks:</span>{" "}
                    {billData.remarks || "-"}
                  </p>
                </div>

                {/* Signature Area */}
                <div className="flex justify-end">
                  <div className="text-center flex flex-col">
                    <p className="font-semibold">Accountant</p>
                    <p >{first_name} {last_name}</p>
                  </div>
                </div>

              </div>
            ) : (
              <p>No Bill data available.</p>
            )}
          </div>

          {/* Download & Close Buttons */}
          {!loading && billData && (
            <div className="p-4 pt-0 flex justify-end space-x-2 print:hidden">
                            <button
                onClick={onPrint}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors print:hidden"
              >
                Print
              </button>
              <button
                onClick={downloadPDF}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors print:hidden"
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
