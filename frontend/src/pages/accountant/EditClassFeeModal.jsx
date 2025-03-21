import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";


const editClassFeeSchema = Yup.object().shape({
  fee_category_name: Yup.string().required("Fee Category is required."),
  amount: Yup.number()
    .typeError("Amount must be a number.")
    .required("Amount is required."),
});

const EditClassFeeModal = ({ selectedClass, fee, handleCloseModal, fetchClassFees }) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    if (!access) return;
    try {
      const { data } = await axios.get("http://localhost:8000/api/fee-names/", {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      setCategories(data);
    } catch (error) {
      toast.error("Error fetching fee categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [access]);

  const formik = useFormik({
    initialValues: {
      fee_category_name: fee?.fee_category_name?.id || "",
      amount: fee?.amount || "",
    },
    validationSchema: editClassFeeSchema,
    onSubmit: async (values) => {
      await editClassFee(values);
    },
  });

  console.log(fee)

  const editClassFee = async (values) => {
    if (!access) {
      toast.error("Not authenticated.");
      return;
    }
    try {
      const feeCategoryId = fee.fee_category_name.id;

      await axios.put(
        `http://localhost:8000/api/fee-categories/${selectedClass?.id}/${feeCategoryId}/`,
        {
          fee_category_name: values.fee_category_name,
          amount: values.amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      toast.success("Fee updated successfully.");
      handleCloseModal();
      fetchClassFees(selectedClass.id);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error updating fee: " + (error.message || error));
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold text-purple-800">Edit Fee</h2>
        <p>Class: {selectedClass.class_name}({selectedClass.class_code})</p>
        <form onSubmit={formik.handleSubmit} className="mt-4">
          {/* Fee Category (Dropdown) */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Category</label>
            <select
              name="fee_category_name"
              className="border border-gray-300 p-2 rounded w-full"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.fee_category_name}
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            {formik.touched.fee_category_name && formik.errors.fee_category_name && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.fee_category_name}
              </div>
            )}
          </div>

          {/* Amount */}
          <div className="mb-4">
            <label className="block mb-1 font-semibold">Amount</label>
            <input
              type="text"
              name="amount"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Fee amount"
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
              type="button"
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

export default EditClassFeeModal;
