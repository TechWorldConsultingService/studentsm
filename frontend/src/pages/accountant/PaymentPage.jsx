import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import * as Yup from "yup";
import MainLayout from "../../layout/MainLayout";

const PaymentSchema = Yup.object().shape({
  amount_paid: Yup.number()
    .positive("Amount must be positive")
    .required("Amount is required"),
  discount: Yup.number()
    .min(0, "Discount cannot be negative")
    .required("Discount is required"),
  remarks: Yup.string()
    .min(3, "Remarks must be at least 3 characters")
    .required("Remarks are required"),
});

const PaymentPage = ({ fetchPayments }) => {
  const { studentId } = useParams();
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [studentDetails, setStudentDetails] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8000/api/students/${studentId}/`,
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );
        setStudentDetails(response.data);
      } catch (error) {
        console.error("Error fetching student details", error);
      }
    };

    if (access && studentId) {
      fetchStudentDetails();
    }
  }, [access, studentId]);

  const formik = useFormik({
    initialValues: {
      amount_paid: "",
      discount: 0,
      remarks: "",
    },
    validationSchema: PaymentSchema,
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      await makePayment(values);
      setLoading(false);
      resetForm();
    },
  });

  const makePayment = async (values) => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:8000/api/payments/${studentId}/`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      toast.success("Payment Successful!");
      fetchPayments();
      navigate(-1);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/");
      } else {
        toast.error("Payment failed. Please try again.");
      }
    }
  };

  return (
    <MainLayout>
      <div className=" max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-bold text-purple-800 mb-6">Make Payment</h2>
        
        <div className="bg-gray-100 p-4 rounded-md mb-6">
          <h3 className="text-xl font-semibold text-purple-800 mb-2">Student Details</h3>
          {studentDetails ? (
            <div className="grid grid-cols-2 gap-4 text-gray-700">
              <div>
                <p className="font-medium">Name:</p>
                <p>{studentDetails.name}</p>
              </div>
              <div>
                <p className="font-medium">Class:</p>
                <p>{studentDetails.class}</p>
              </div>
              <div>
                <p className="font-medium">Roll Number:</p>
                <p>{studentDetails.roll_number}</p>
              </div>
              <div>
                <p className="font-medium">Parent's Name:</p>
                <p>{studentDetails.parents_name}</p>
              </div>
              <div className="col-span-2">
                <p className="font-medium">Amount Remaining:</p>
                <p>{studentDetails.amount_remaining}</p>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">Loading student details...</p>
          )}
        </div>

        <form onSubmit={formik.handleSubmit}>
          {/* Amount Paid */}
          <div className="mb-4">
            <label htmlFor="amount_paid" className="block text-gray-700 mb-1">
              Amount Paid
            </label>
            <input
              id="amount_paid"
              type="number"
              className={`border p-2 rounded w-full ${
                formik.touched.amount_paid && formik.errors.amount_paid
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter amount paid"
              name="amount_paid"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.amount_paid}
              autoFocus
            />
            {formik.touched.amount_paid && formik.errors.amount_paid && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.amount_paid}</div>
            )}
          </div>

          {/* Discount */}
          <div className="mb-4">
            <label htmlFor="discount" className="block text-gray-700 mb-1">
              Discount
            </label>
            <input
              id="discount"
              type="number"
              className={`border p-2 rounded w-full ${
                formik.touched.discount && formik.errors.discount
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter discount"
              name="discount"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.discount}
            />
            {formik.touched.discount && formik.errors.discount && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.discount}</div>
            )}
          </div>

          {/* Remarks */}
          <div className="mb-4">
            <label htmlFor="remarks" className="block text-gray-700 mb-1">
              Remarks
            </label>
            <textarea
              id="remarks"
              className={`border p-2 rounded w-full ${
                formik.touched.remarks && formik.errors.remarks
                  ? "border-red-500"
                  : "border-gray-300"
              }`}
              placeholder="Enter remarks"
              name="remarks"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.remarks}
              rows="3"
            />
            {formik.touched.remarks && formik.errors.remarks && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.remarks}</div>
            )}
          </div>

          {/* Submit & Cancel Buttons */}
          <div className="mt-6 flex justify-center space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition duration-200 ${
                loading ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {loading ? "Processing..." : "Submit Payment"}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default PaymentPage;
