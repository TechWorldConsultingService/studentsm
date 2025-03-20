import axios from "axios";
import { Pagination } from "antd";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import React, { useState, useEffect, useRef } from "react";

import MainLayout from "../../layout/MainLayout";
import DateRangePicker from "../../components/dateRangePicker";

export default function PaymentStatements() {
  const navigate = useNavigate();
  const { access } = useSelector(state => state.user);

  const queryRef = useRef(null);
  // const queryRef = useRef("start_date=2025-03-01&end_date=2025-04-01");
  const [loading, setLoading] = useState(false);
  const [totalData, setTotalData] = useState(0);
  const [statements, setStatements] = useState([]);

  const fetchStatements = async () => {
    if (!access) {
      return toast.error("User is not authenticated. Please log in.");
    }
    setLoading(true);

    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/payments/search?${queryRef.current}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      setStatements(data.results);
      setTotalData(data.count);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error(
          "Error fetching quiz category: " + (error.message || error)
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatements();
  }, []);

  const handleDateChange = ({ from, to }) => {
    console.log({ from, to });
    if (from && to) {
      queryRef.current = `start_date=${from}&end_date=${to}`;
    } else {
      queryRef.current = null;
    }

    fetchStatements();
  };

  const handlePageChange = page => {
    queryRef.current = queryRef.current + `&page=${page}`;

    fetchStatements();
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">
            Statements
          </h1>

          <div className="mt-4 flex justify-between">
            <DateRangePicker handleDateChange={handleDateChange} />
            {statements?.total_payment_amount ? (
              <p className="italic">
                Total Paid Amount: Rs{" "}
                <span className="font-bold">
                  {statements.total_payment_amount}
                </span>
              </p>
            ) : null}
          </div>
          <div className="mt-6 overflow-x-auto">
            {loading ? (
              <div className="mt-6 text-center text-gray-600">Loading...</div>
            ) : (
              <>
                {!statements.payments?.length ? (
                  <div className="text-gray-600">No statements found.</div>
                ) : (
                  <table className="min-w-full table-auto">
                    <thead>
                      <tr className="bg-purple-700 text-white">
                        <th className="px-4 py-2 text-left">Class</th>
                        <th className="px-4 py-2 text-left">Student</th>
                        <th className="px-4 py-2 text-left">Paid Amount</th>
                        <th className="px-4 py-2 text-left">Paid Date</th>
                        <th className="px-4 py-2 text-left">Received</th>
                      </tr>
                    </thead>
                    <tbody>
                      {statements.payments?.map(payment => (
                        <tr
                          key={payment.id}
                          className="border-b hover:bg-purple-50"
                        >
                          <td className="px-4 py-2">{payment.class}</td>
                          <td className="px-4 py-2">{payment.student_name}</td>

                          <td className="px-4 py-2">
                            {payment.payment_amount}
                          </td>
                          <td className="px-4 py-2">{payment.payment_date}</td>
                          <td className="px-4 py-2">{payment.created_by}</td>
                        </tr>
                        
                      ))}
                    </tbody>
                  </table>
                )}
              </>
            )}
            <Pagination
              size="small"
              pageSize={5}
              showQuickJumper
              total={totalData}
              showSizeChanger={false}
              hideOnSinglePage={true}
              onChange={handlePageChange}
              showTotal={total => `Total ${total} items`}
              className="justify-end mt-4 overflow-hidden"
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
