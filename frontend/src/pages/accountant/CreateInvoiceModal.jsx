import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

const bsMonths = [
  "Baishakh",
  "Jestha",
  "Ashadh",
  "Shrawan",
  "Bhadra",
  "Ashwin",
  "Kartik",
  "Mangsir",
  "Poush",
  "Magh",
  "Falgun",
  "Chaitra",
];

const adMonths = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const createInvoiceSchema = Yup.object().shape({
  calendarType: Yup.string()
    .oneOf(["BS", "AD"])
    .required("Calendar type is required."),
  month: Yup.string().required("Month is required."),
  remarks: Yup.string(),
  fee_categories: Yup.array().of(
    Yup.object().shape({
      fee_category: Yup.number().required(),
      scholarship: Yup.boolean().required(),
    })
  ),
  discount: Yup.number(),
});

const CreateInvoiceModal = ({ studentId, classId, onClose, fetchLedger }) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [feeCategories, setFeeCategories] = useState([]);
  const [transportationList, setTransportationList] = useState([]);
  const [transportationNeeded, setTransportationNeeded] = useState("no");
  const [selectedTransportationId, setSelectedTransportationId] = useState("");

  const fetchFeeCategories = async () => {
    if (!access || !classId) return;
    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/fee-categories/${classId}/`,
        { headers: { Authorization: `Bearer ${access}` } }
      );
      setFeeCategories(data);
    } catch (error) {
      toast.error("Error fetching fee categories");
    }
  };

  const fetchTransportationList = async () => {
    if (!access) return;
    try {
      const { data } = await axios.get("http://localhost:8000/api/transportation-fees/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      setTransportationList(data);
    } catch (error) {
      toast.error("Error fetching transportation fees");
    }
  };

  useEffect(() => {
    fetchFeeCategories();
  }, [classId, access]);

  useEffect(() => {
    if (transportationNeeded === "yes") {
      fetchTransportationList();
    } else {
      setTransportationList([]);
      setSelectedTransportationId("");
    }
  }, [transportationNeeded]);

  const formik = useFormik({
    initialValues: {
      calendarType: "", // initially no calendar type is selected
      month: "",
      remarks: "",
      fee_categories: [],
      discount: 0,
    },
    validationSchema: createInvoiceSchema,
    onSubmit: async (values) => {
      console.log("Submitting form with values:", values);
      if (!studentId) {
        toast.error("No student selected!");
        return;
      }
      if (!access) {
        toast.error("Not authenticated.");
        return;
      }

      try {
        const payload = {
          month: values.month,
          remarks: values.remarks,
          fee_categories: values.fee_categories,
          discount: values.discount,
        };

        if (transportationNeeded === "yes" && selectedTransportationId) {
          payload.transportation_fee = selectedTransportationId;
        }

        await axios.post(`http://localhost:8000/api/bills/${studentId}/`, payload, {
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${access}` },
        });
        toast.success("Invoice created successfully!");
        fetchLedger(studentId);
        onClose();
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/");
        } else {
          toast.error("Error creating invoice");
        }
      }
    },
  });

  const handleCategoryCheck = (categoryId) => {
    const exists = formik.values.fee_categories.some(
      (cat) => cat.fee_category === categoryId
    );
    if (exists) {
      formik.setFieldValue(
        "fee_categories",
        formik.values.fee_categories.filter((cat) => cat.fee_category !== categoryId)
      );
    } else {
      formik.setFieldValue("fee_categories", [
        ...formik.values.fee_categories,
        { fee_category: categoryId, scholarship: false },
      ]);
    }
  };

  const handleScholarshipChange = (categoryId, value) => {
    formik.setFieldValue(
      "fee_categories",
      formik.values.fee_categories.map((cat) =>
        cat.fee_category === categoryId ? { ...cat, scholarship: value === "true" } : cat
      )
    );
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-2/3 lg:w-2/3 max-h-[94%] overflow-auto">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Create Invoice</h2>
        <form onSubmit={formik.handleSubmit}>
          {/* Calendar Type Selection */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Calendar Type</label>
            <div className="flex space-x-4">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="calendarType"
                  value="BS"
                  checked={formik.values.calendarType === "BS"}
                  onChange={formik.handleChange}
                />
                <span className="ml-2">BS</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="calendarType"
                  value="AD"
                  checked={formik.values.calendarType === "AD"}
                  onChange={formik.handleChange}
                />
                <span className="ml-2">AD</span>
              </label>
            </div>
            {formik.touched.calendarType && formik.errors.calendarType && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.calendarType}</div>
            )}
          </div>

          {/* Month Selection (conditionally rendered) */}
          {formik.values.calendarType && (
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Month</label>
              <select
                name="month"
                className="border border-gray-300 p-2 rounded w-full"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.month}
              >
                <option value="">Select Month</option>
                {formik.values.calendarType === "BS"
                  ? bsMonths.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))
                  : adMonths.map((month) => (
                      <option key={month} value={month}>
                        {month}
                      </option>
                    ))}
              </select>
              {formik.touched.month && formik.errors.month && (
                <div className="text-red-500 text-sm mt-1">{formik.errors.month}</div>
              )}
            </div>
          )}

          {/* Fee Categories Table */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Select Fee Categories</h3>
            {feeCategories.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-purple-700 text-white">
                      <th className="px-4 py-2">Select</th>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Class</th>
                      <th className="px-4 py-2">Fee</th>
                      <th className="px-4 py-2">Scholarship</th>
                    </tr>
                  </thead>
                  <tbody>
                    {feeCategories.map((cat) => (
                      <tr key={cat.fee_category_name.id} className="border-b hover:bg-purple-50">
                        <td className="px-4 py-2 text-center">
                          <input
                            type="checkbox"
                            checked={formik.values.fee_categories.some(
                              (item) => item.fee_category === cat.fee_category_name.id
                            )}
                            onChange={() => handleCategoryCheck(cat.fee_category_name.id)}
                          />
                        </td>
                        <td className="px-4 py-2">{cat.fee_category_name.name}</td>
                        <td className="px-4 py-2">
                          {cat.class_assigned?.class_name} ({cat.class_assigned?.class_code})
                        </td>
                        <td className="px-4 py-2">{cat.amount}</td>
                        <td className="px-4 py-2">
                          <select
                            onChange={(e) =>
                              handleScholarshipChange(cat.fee_category_name.id, e.target.value)
                            }
                            className="border border-gray-300 p-2 rounded"
                            value={
                              (formik.values.fee_categories.find(
                                (item) => item.fee_category === cat.fee_category_name.id
                              ) || { scholarship: false }).scholarship
                                ? "true"
                                : "false"
                            }
                          >
                            <option value="false">No</option>
                            <option value="true">Yes</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-600">No fee categories available.</p>
            )}
          </div>

          {/* Transportation Option */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-purple-700 mb-2">Transportation Needed?</h3>
            <div className="flex space-x-6">
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="transportationNeeded"
                  value="no"
                  checked={transportationNeeded === "no"}
                  onChange={(e) => setTransportationNeeded(e.target.value)}
                />
                <span className="ml-2">No</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  name="transportationNeeded"
                  value="yes"
                  checked={transportationNeeded === "yes"}
                  onChange={(e) => setTransportationNeeded(e.target.value)}
                />
                <span className="ml-2">Yes</span>
              </label>
            </div>

            {transportationNeeded === "yes" && (
              <div className="mt-4">
                {transportationList.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full table-auto">
                      <thead>
                        <tr className="bg-purple-700 text-white">
                          <th className="px-4 py-2">Select</th>
                          <th className="px-4 py-2">Route Name</th>
                          <th className="px-4 py-2">Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {transportationList.map((item) => (
                          <tr key={item.id} className="border-b hover:bg-purple-50">
                            <td className="px-4 py-2 text-center">
                              <input
                                type="radio"
                                name="transportationOption"
                                value={item.id}
                                checked={selectedTransportationId === String(item.id)}
                                onChange={() => setSelectedTransportationId(String(item.id))}
                              />
                            </td>
                            <td className="px-4 py-2">{item.place}</td>
                            <td className="px-4 py-2">{item.amount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-600">No transportation options available.</p>
                )}
              </div>
            )}
          </div>

          {/* Discount */}
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Discount</label>
            <input
              type="number"
              name="discount"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Discount"
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
            <label className="block text-gray-700 mb-1">Remarks</label>
            <input
              type="text"
              name="remarks"
              className="border border-gray-300 p-2 rounded w-full"
              placeholder="Any remarks..."
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.remarks}
            />
            {formik.touched.remarks && formik.errors.remarks && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.remarks}</div>
            )}
          </div>

          {/* Form Buttons */}
          <div className="flex justify-center space-x-4">
            <button
              type="submit"
              className="bg-purple-700 hover:bg-purple-800 text-white px-6 py-2 rounded-lg"
            >
              Save Invoice
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
