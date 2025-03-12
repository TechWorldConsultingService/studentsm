import React from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";



const AddNotesModal = ({ onClose, fetchNotesList, subjectList }) => {
    const { access } = useSelector((state) => state.user);
  
    const formik = useFormik({
      enableReinitialize: true,
      initialValues: {
        subject: "",
        chapter: "",
        title: "",
        description: "",
        file: null,
      },
      validationSchema: Yup.object({
        subject: Yup.string().required("Subject is required"),
        chapter: Yup.string().required("Chapter is required"),
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
        file: Yup.mixed().nullable(),
      }),
      onSubmit: async (values) => {
  
        try {
          const response = await axios.post("http://localhost:8000/api/notes/", values, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${access}`,
            },
          });
  
          toast.success("Note added successfully!");
          fetchNotesList();
          onClose();
        } catch (error) {
          toast.error("Failed to add note. Please try again.");
        }
      },
    });
  
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 overflow-y-auto">
          <h2 className="text-2xl font-bold text-purple-800">Add Note</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log("Form Errors:", formik.errors);
              formik.handleSubmit(e);
            }}
            className="mt-4"
          >
            {/* Subject */}
            <div className="flex flex-col">
              <label className="text-purple-700 font-semibold">Subject</label>
              <select
                name="subject"
                onBlur={formik.handleBlur}
                value={formik.values.subject}
                onChange={formik.handleChange}
                className="mt-2 p-2 mb-4 rounded-lg border border-purple-300"
              >
                <option value="">Select Subject</option>
                {subjectList.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.subject_name}
                  </option>
                ))}
              </select>
              {formik.touched.subject && formik.errors.subject && (
                <div className="text-red-500 text-sm">{formik.errors.subject}</div>
              )}
            </div>
  
            {/* Chapter */}
            <div className="flex flex-col">
              <label className="text-purple-700 font-semibold">Chapter</label>
              <input
                type="text"
                name="chapter"
                placeholder="Chapter"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.chapter}
                className="border p-2 w-full mb-2"
              />
              {formik.touched.chapter && formik.errors.chapter && (
                <div className="text-red-500 text-sm">{formik.errors.chapter}</div>
              )}
            </div>
  
            {/* Title */}
            <div className="flex flex-col">
              <label className="text-purple-700 font-semibold">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                className="border p-2 w-full mb-2"
              />
              {formik.touched.title && formik.errors.title && (
                <div className="text-red-500 text-sm">{formik.errors.title}</div>
              )}
            </div>
  
            {/* Description */}
            <div className="flex flex-col">
              <label className="text-purple-700 font-semibold">Description</label>
              <textarea
                name="description"
                placeholder="Description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                className="border p-2 w-full mb-2"
              ></textarea>
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-sm">{formik.errors.description}</div>
              )}
            </div>
  
  
  
            {/* File Upload */}
            <div className="flex flex-col">
              <label className="text-purple-700 font-semibold">File</label>
              <input
                type="file"
                name="file"
                onChange={(event) => {
                  const file = event.currentTarget.files[0];
                  formik.setFieldValue("file", file);
                }}
                className="border p-2 w-full mb-2"
              />
            </div>
  
            {/* Buttons */}
            <div className="mt-4 flex justify-center space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-purple-700 text-white px-4 py-2 rounded"
              >
                Add
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default AddNotesModal;