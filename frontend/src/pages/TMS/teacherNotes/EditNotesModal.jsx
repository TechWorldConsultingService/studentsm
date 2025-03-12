import React from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";


const EditNotesModal = ({ note, onClose, fetchNotesList }) => {
    const { access } = useSelector((state) => state.user);
    
    const formik = useFormik({
      enableReinitialize: true,
      initialValues: {
        chapter: note.chapter,
        title: note.title,
        description: note.description,
      },
      validationSchema: Yup.object({
        chapter: Yup.string().required("Chapter is required"),
        title: Yup.string().required("Title is required"),
        description: Yup.string().required("Description is required"),
      }),
      onSubmit: async (values) => {
        try {
          const formData = new FormData();
          formData.append("chapter", values.chapter);
          formData.append("title", values.title);
          formData.append("description", values.description);
          if (values.file) {
            formData.append("file", values.file);
          }
  
          await axios.put(
            `http://localhost:8000/api/notes/${note.id}/`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${access}`,
              },
            }
          );
  
          toast.success("Note updated successfully!");
          fetchNotesList();
          onClose();
        } catch (error) {
          toast.error("Failed to update note. Please try again.");
        }
      },
    });
  
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
          <h2 className="text-2xl font-bold text-purple-800 border-b pb-2">
            Edit Note
          </h2>
          <form onSubmit={formik.handleSubmit} className="mt-4 space-y-3">
          <div className="flex flex-col">
              <label className="text-purple-700 font-semibold">Subject</label>
              <input
                type="text"
                value={note?.subject?.subject_name}
                className="border p-2 rounded-lg"
              />
            </div>
  
  
            <div className="flex flex-col">
              <label className="text-purple-700 font-semibold">Chapter</label>
              <input
                type="text"
                name="chapter"
                placeholder="Chapter"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.chapter}
                className="border p-2 rounded-lg"
              />
              {formik.touched.chapter && formik.errors.chapter && (
                <div className="text-red-500 text-sm">{formik.errors.chapter}</div>
              )}
            </div>
  
            <div className="flex flex-col">
              <label className="text-purple-700 font-semibold">Title</label>
              <input
                type="text"
                name="title"
                placeholder="Title"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.title}
                className="border p-2 rounded-lg"
              />
              {formik.touched.title && formik.errors.title && (
                <div className="text-red-500 text-sm">{formik.errors.title}</div>
              )}
            </div>
  
            <div className="flex flex-col">
              <label className="text-purple-700 font-semibold">Description</label>
              <textarea
                name="description"
                placeholder="Description"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.description}
                className="border p-2 rounded-lg"
              ></textarea>
              {formik.touched.description && formik.errors.description && (
                <div className="text-red-500 text-sm">{formik.errors.description}</div>
              )}
            </div>
  
            <div className="flex flex-col">
    <label className="text-purple-700 font-semibold">Existing File</label>
    {note.file ? (
      <p className="text-blue-600 underline">
        <a
          href={`http://localhost:8000${note.file}`} 
          target="_blank"
          rel="noopener noreferrer"
        >
          View Attached File
        </a>
      </p>
    ) : (
      <p className="text-gray-500 italic">No file attached</p>
    )}
  </div>
  
  <div className="flex flex-col">
    <label className="text-purple-700 font-semibold">Update File</label>
    <input
      type="file"
      name="file"
      onChange={(event) => formik.setFieldValue("file", event.currentTarget.files[0])}
      className="border p-2 rounded-lg"
    />
  </div>
  
  
            <div className="mt-4 flex justify-center space-x-4">
              <button type="button" onClick={onClose} className="bg-gray-500 text-white px-4 py-2 rounded">
                Cancel
              </button>
              <button type="submit" className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800">
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  export default EditNotesModal;