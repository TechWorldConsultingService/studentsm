import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import CreateInvoiceModal from "./CreateInvoiceModal";
import BillModal from "./BillModal";
import ReceiptModal from "./ReceiptModal";

const LedgerPage = () => {
  const { access } = useSelector((state) => state.user);
  const { studentId } = useParams();
  const location = useLocation();
  const { classId } = location.state || {};

  const [ledger, setLedger] = useState([]);
  const [studentDetails, setStudentDetails] = useState(null);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  // States to control Bill and Receipt modals
  const [billNumber, setBillNumber] = useState(null);
  const [paymentNumber, setPaymentNumber] = useState(null);

  // Fetch ledger data for the student
  const fetchLedger = async (studentId) => {
    if (!access || !studentId) return;
    setLedgerLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/transactions/${studentId}/`,
        { headers: { Authorization: `Bearer ${access}` } }
      );
      setStudentDetails(data.student);
      // Reverse transactions to display the latest at top
      setLedger(data.transactions.slice().reverse());
    } catch (error) {
      toast.error("Error fetching ledger");
    } finally {
      setLedgerLoading(false);
    }
  };

  useEffect(() => {
    fetchLedger(studentId);
  }, [studentId, access]);

  // Handlers for clicking on invoice and receipt numbers
  const handleInvoiceClick = (invoiceNum) => {
    setBillNumber(invoiceNum);
  };

  const handleReceiptClick = (receiptNum) => {
    setPaymentNumber(receiptNum);
  };

  // Render each ledger row
  const renderLedgerRow = (item, index) => {
    let formattedDate = "-";
    if (item.transaction_date) {
      const dateObj = new Date(item.transaction_date);
      if (!isNaN(dateObj.getTime())) {
        formattedDate = dateObj.toLocaleDateString();
      }
    }

    const month = item.month || "-";
    const finalBalance = item.balance || "-";
    const remarks = item.remarks || "-";

    if (item.transaction_type === "bill" && item.bill_number) {
      return (
        <tr key={index} className="border-b hover:bg-purple-50 transition-colors">
          <td className="px-4 py-2 whitespace-nowrap">{formattedDate}</td>
          <td className="px-4 py-2 whitespace-nowrap">{month}</td>
          <td className="px-4 py-2 whitespace-nowrap">
            <button
              onClick={() => handleInvoiceClick(item.bill_number)}
              className="text-purple-700 hover:underline"
            >
              {item.bill_number}
            </button>
          </td>
          <td className="px-4 py-2 whitespace-nowrap">
            {item.total_amount ?? "-"}
          </td>
          <td className="px-4 py-2 whitespace-nowrap">-</td>
          <td className="px-4 py-2 whitespace-nowrap">-</td>
          <td className="px-4 py-2 whitespace-nowrap">{finalBalance}</td>
          <td className="px-4 py-2 whitespace-nowrap">{remarks}</td>
        </tr>
      );
    } else if (item.transaction_type === "payment" && item.payment_number) {
      return (
        <tr key={index} className="border-b hover:bg-purple-50 transition-colors">
          <td className="px-4 py-2 whitespace-nowrap">{formattedDate}</td>
          <td className="px-4 py-2 whitespace-nowrap">-</td>
          <td className="px-4 py-2 whitespace-nowrap">-</td>
          <td className="px-4 py-2 whitespace-nowrap">-</td>
          <td className="px-4 py-2 whitespace-nowrap">
            <button
              onClick={() => handleReceiptClick(item.payment_number)}
              className="text-purple-700 hover:underline"
            >
              {item.payment_number}
            </button>
          </td>
          <td className="px-4 py-2 whitespace-nowrap">
            {item.paid_amount ?? "-"}
          </td>
          <td className="px-4 py-2 whitespace-nowrap">{finalBalance}</td>
          <td className="px-4 py-2 whitespace-nowrap">{remarks}</td>
        </tr>
      );
    } else {
      return null;
    }
  };

  return (
    <MainLayout>
      <div className="bg-gray-100 min-h-screen p-4">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Ledger Header */}
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold text-purple-800">
                Student Ledger
              </h1>
              <button
                onClick={() => setShowInvoiceModal(true)}
                className="bg-purple-700 hover:bg-purple-800 text-white px-4 py-2 rounded transition-colors"
              >
                Create Invoice
              </button>
            </div>

            {/* Student Details Card */}
            {studentDetails && (
              <div className="bg-purple-50 border border-purple-100 rounded-lg p-6 mt-4 shadow-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {studentDetails.name}
                    </p>
                    <p>
                      <span className="font-semibold">Class:</span>{" "}
                      {studentDetails.class_name}
                    </p>
                    <p>
                      <span className="font-semibold">Roll No:</span>{" "}
                      {studentDetails.roll_no || "-"}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">Parents:</span>{" "}
                      {studentDetails.parents}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {studentDetails.phone}
                    </p>
                    <p>
                      <span className="font-semibold">Address:</span>{" "}
                      {studentDetails.address}
                    </p>
                  </div>
                  <div>
                    <p>
                      <span className="font-semibold">DOB:</span>{" "}
                      {studentDetails.date_of_birth}
                    </p>
                    <p>
                      <span className="font-semibold">Gender:</span>{" "}
                      {studentDetails.gender}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Ledger Table */}
          <div className="bg-white shadow rounded-lg p-6">
            {ledgerLoading ? (
              <p className="text-gray-600">Loading ledger...</p>
            ) : ledger.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-purple-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Month
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Invoice Number
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Debit Amount
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Receipt Number
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Payment Amount
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Final Balance
                      </th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-white uppercase tracking-wider">
                        Remarks
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {ledger.map(renderLedgerRow)}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No ledger data available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Existing Create Invoice Modal */}
      {showInvoiceModal && (
        <CreateInvoiceModal
          fetchLedger={fetchLedger}
          studentId={studentId}
          classId={classId}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}

      {/* Bill Modal */}
      {billNumber && (
        <BillModal
          billNumber={billNumber}
          onClose={() => setBillNumber(null)}
        />
      )}

      {/* Receipt Modal */}
      {paymentNumber && (
        <ReceiptModal
          paymentNumber={paymentNumber}
          onClose={() => setPaymentNumber(null)}
        />
      )}
    </MainLayout>
  );
};

export default LedgerPage;
