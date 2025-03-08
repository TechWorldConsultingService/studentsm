import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

const addSectionSchema = Yup.object().shape({
  section_name: Yup.string().required("Section Name is required.")
});

const SectionModal = ({ handleCloseSectionModal, fetchSections, classId, initialSection }) => {
  const { access } = useSelector((state) => state.user);
  const isEdit = Boolean(initialSection);

  const formik = useFormik({
    initialValues: {
      section_name: initialSection ? initialSection.section_name : "C"
    },
    validationSchema: addSectionSchema,
    onSubmit: async (values) => {
      try {
        if (isEdit) {
          // Update section API call
          await axios.put(
            `http://localhost:8000/api/classes/${classId}/sections/${initialSection.id}/`,
            values,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access}`,
              },
            }
          );
          toast.success("Section updated successfully");
        } else {
          // Create section API call
          await axios.post(
            `http://localhost:8000/api/classes/${classId}/sections/`,
            values,
            {
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access}`,
              },
            }
          );
          toast.success("Section added successfully");
        }
        fetchSections();
        handleCloseSectionModal();
      } catch (error) {
        toast.error("Error saving section");
      }
    }
  });

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold text-purple-800">
          {isEdit ? "Edit Section" : "Add Section"}
        </h2>
        <form onSubmit={formik.handleSubmit} className="mt-4">
          <div className="mb-4">
            <label htmlFor="section_name" className="block text-sm font-semibold">
              Section Name:
            </label>
            <input
              type="text"
              id="section_name"
              name="section_name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.section_name}
              className="border border-gray-300 p-2 rounded w-full mt-1"
              placeholder="Section Name"
            />
            {formik.touched.section_name && formik.errors.section_name && (
              <div className="p-1 px-2 text-red-500 text-sm mt-1">
                {formik.errors.section_name}
              </div>
            )}
          </div>
          <div className="mt-6 text-center">
            <button type="submit" className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 mr-2">
              Save
            </button>
            <button
              onClick={handleCloseSectionModal}
              type="button"
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

export default SectionModal;
