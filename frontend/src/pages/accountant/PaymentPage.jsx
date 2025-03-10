import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import * as Yup from "yup";
import MainLayout from "../../layout/MainLayout";

const PaymentSchema = Yup.object().shape({
  amount_paid: Yup.number()
    .typeError("Must be a number")
    .positive("Amount must be positive")
    .required("Amount is required"),
  remarks: Yup.string()
    .min(3, "Remarks must be at least 3 characters")
    .required("Remarks are required"),
});

const PaymentPage = () => {
  const { studentId } = useParams();
  const { access } = useSelector((state) => state.user);
  const { selectedPaymentUserInformation } = useSelector(
    (state) => state.paymentUser
  );
  const navigate = useNavigate();

  // Define makePayment function before using it in useFormik
  const makePayment = async (values) => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    try {
      const payload = {
        amount_paid: Number(values.amount_paid), // convert to number
        remarks: values.remarks,
      };
      const res = await axios.post(
        `http://localhost:8000/api/payments/${studentId}/`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      const paymentNum = res?.data?.payment_details?.payment_number;
      toast.success("Payment Successful!");
      navigate(`/successPayment?paymentNumber=${paymentNum}`);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/");
      } else {
        console.error("Payment error:", error);
        toast.error("Payment failed. Please try again.");
      }
    }
  };

  const formik = useFormik({
    initialValues: {
      amount_paid: "",
      remarks: "",
    },
    validationSchema: PaymentSchema,
    onSubmit: async (values) => {
      await makePayment(values);
    },
  });

  return (
    <MainLayout>
      <div className="bg-purple-50 p-1">
        <div className="max-w-2xl bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h2 className="text-3xl font-bold text-purple-800 mb-3">
            Make Payment
          </h2>

          {selectedPaymentUserInformation && (
            <div className="border border-gray-200 rounded-lg p-2 mb-2">
              <div>
                <p className="text-gray-700">
                  <span className="font-semibold">Name:</span>{" "}
                  {selectedPaymentUserInformation.full_name}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Class:</span>{" "}
                  {selectedPaymentUserInformation.class_details.class_name} (
                  {selectedPaymentUserInformation.class_details.class_code})
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Roll No:</span>{" "}
                  {selectedPaymentUserInformation.roll_no || "-"}
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Parents:</span>{" "}
                  {selectedPaymentUserInformation.parents}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={formik.handleSubmit}>
            <div className="mb-4">
              <label
                className="block font-semibold text-purple-800 mb-2"
              >
                Amount Paid
              </label>
              <input
                id="amount_paid"
                type="number"
                name="amount_paid"
                placeholder="Enter amount paid"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.amount_paid}
                className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 ${
                  formik.touched.amount_paid && formik.errors.amount_paid
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
                autoFocus
              />
              {formik.touched.amount_paid && formik.errors.amount_paid && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.amount_paid}
                </div>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="remarks"
                className="block font-semibold text-purple-800 mb-2"
              >
                Remarks
              </label>
              <textarea
                id="remarks"
                name="remarks"
                placeholder="Enter remarks"
                rows="2"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.remarks}
                className={`w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-300 ${
                  formik.touched.remarks && formik.errors.remarks
                    ? "border-red-500"
                    : "border-gray-300"
                }`}
              ></textarea>
              {formik.touched.remarks && formik.errors.remarks && (
                <div className="text-red-500 text-sm mt-1">
                  {formik.errors.remarks}
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-center space-x-4">
              <button
                type="submit"
                className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
              >
                Submit Payment
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
      </div>
    </MainLayout>
  );
};

export default PaymentPage;
