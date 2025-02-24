import React from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

// Validation Schema for Edit
const editTransportationSchema = Yup.object().shape({
  place: Yup.string().required("Place is required."),
  amount: Yup.number()
    .typeError("Amount must be a number.")
    .required("Amount is required."),
});

const EditTransportationModal = ({
  transportation,
  handleCloseModal,
  fetchTransportationFees,
}) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      place: transportation?.place || "",
      amount: transportation?.amount || "",
    },
    validationSchema: editTransportationSchema,
    onSubmit: async (values) => {
      await editTransportation(values);
    },
  });

  const editTransportation = async (values) => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      await axios.put(
        `http://localhost:8000/api/transportation-fees/${transportation.id}/`,
        values,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      toast.success("Transportation Fee Updated Successfully.");
      fetchTransportationFees();
      handleCloseModal();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error updating transportation fee: " + (error.message || error));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold text-purple-800">Edit Transportation Fee</h2>
        <form onSubmit={formik.handleSubmit} className="mt-4">
          {/* Place Field */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Place"
              name="place"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.place}
            />
            {formik.touched.place && formik.errors.place && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.place}
              </div>
            )}
          </div>
          {/* Amount Field */}
          <div className="mb-4">
            <input
              type="text"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Amount"
              name="amount"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.amount}
            />
            {formik.touched.amount && formik.errors.amount && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.amount}
              </div>
            )}
          </div>
          {/* Buttons */}
          <div className="mt-6 text-center">
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 mr-2"
            >
              Update
            </button>
            <button
              onClick={handleCloseModal}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransportationModal;
