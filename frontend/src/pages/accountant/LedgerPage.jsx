import React, { useEffect, useState } from "react";
import MainLayout from "../../layout/MainLayout";
import { useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import CreateInvoiceModal from "./CreateInvoiceModal";

const LedgerPage = () => {
  const { access } = useSelector((state) => state.user);
  const { studentId } = useParams();
  const location = useLocation();
  const { classId } = location.state || {};

  const [ledger, setLedger] = useState([]);
  const [ledgerLoading, setLedgerLoading] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  const fetchLedger = async (studentId) => {
    if (!access || !studentId) return;
    setLedgerLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/transactions/${studentId}/`,
        { headers: { Authorization: `Bearer ${access}` } }
      );
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

  const renderLedgerRow = (item, index) => {
    const formattedDate = new Date(item.date).toISOString().split("T")[0];

    if (item.bill_number) {
      return (
        <tr key={index} className="border-b hover:bg-purple-50">
          <td className="px-4 py-2">{formattedDate}</td>
          <td className="px-4 py-2">{item.month || "-"}</td>
          <td className="px-4 py-2">{item.bill_number}</td>
          <td className="px-4 py-2">{item.total_amount}</td>
          <td className="px-4 py-2">-</td>
          <td className="px-4 py-2">-</td>
          <td className="px-4 py-2">{item.balance}</td>
          <td className="px-4 py-2">{item.remarks}</td>
        </tr>
      );
    } else if (item.payment_number) {
      // Payment entry
      return (
        <tr key={index} className="border-b hover:bg-purple-50">
          <td className="px-4 py-2">{formattedDate}</td>
          <td className="px-4 py-2">-</td>
          <td className="px-4 py-2">-</td>
          <td className="px-4 py-2">-</td>
          <td className="px-4 py-2">{item.payment_number}</td>
          <td className="px-4 py-2">{item.amount_paid}</td>
          <td className="px-4 py-2">{item.balance}</td>
          <td className="px-4 py-2">{item.remarks}</td>
        </tr>
      );
    } else {
      return null;
    }
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6 h-auto">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800 mb-4">
            Student Ledger
          </h1>

          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowInvoiceModal(true)}
              className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg"
            >
              Create Invoice
            </button>
          </div>
        </div>
      </div>


          {ledgerLoading ? (
            <p className="text-gray-600">Loading ledger...</p>
          ) : ledger.length > 0 ? (
            <div className="overflow-x-auto mb-6">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-purple-700 text-white">
                    <th className="px-4 py-2">Date</th>
                    <th className="px-4 py-2">Month</th>
                    <th className="px-4 py-2">Invoice Number</th>
                    <th className="px-4 py-2">Debit Amount</th>
                    <th className="px-4 py-2">Receipt Number</th>
                    <th className="px-4 py-2">Payment Amount</th>
                    <th className="px-4 py-2">Final Balance</th>
                    <th className="px-4 py-2">Remarks</th>
                  </tr>
                </thead>
                <tbody>{ledger.map(renderLedgerRow)}</tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-600">No ledger data available.</p>
          )}

      {showInvoiceModal && (
        <CreateInvoiceModal
        fetchLedger={fetchLedger}
          studentId={studentId}
          classId={classId}
          onClose={() => setShowInvoiceModal(false)}
        />
      )}
    </MainLayout>
  );
};

export default LedgerPage;
