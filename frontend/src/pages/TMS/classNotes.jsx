import React, { useState, useEffect, useCallback } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

const ClassNotes = () => {
  const {
    access,
    id: teacher_id,
    selectedClass,
  } = useSelector((state) => state.user);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);
  const [noteList, setNoteList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [errorNotes, setErrorNotes] = useState("");

  useEffect(() => {
    if (access && teacher_id && selectedClass) {
      axios
        .get(
          `http://localhost:8000/api/filter-subjects/?teacher=${teacher_id}&class_assigned=${selectedClass}`
        )
        .then((response) => {
          if (response.data?.subjects) {
            setSubjectList(response.data.subjects);
          }
        })
        .catch((error) => {
          setErrorNotes("Failed to find subject.");
        });
    }
  }, [access, teacher_id, selectedClass]);

  const fetchNotesList = async () => {
    if (!access || !selectedSubject) {
      toast.error("Please select a subject first.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8000/api/notes/subject/${selectedSubject}/`,
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );
      setNoteList(response.data);
      setErrorNotes("");
    } catch (error) {
      setNoteList([]);
      setErrorNotes(
        error.response?.data?.message || "No notes found. Please add some."
      );
      console.error("Error fetching notes:", error);
    }
  };
  
  useEffect(() => {
    if (selectedSubject) {
      fetchNotesList();
    }
  }, [selectedSubject]);



  return (
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">
          Subject Notes
        </h1>
        <div className="flex justify-between">
          <p className="mt-4 text-gray-600">
            Explore the notes and resources available for your subject here.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 disabled:opacity-50"
            disabled={!selectedSubject}
          >
            Add Notes
          </button>
        </div>

        <div className="flex flex-col p-2">
          <label className="text-purple-700 font-semibold">Subject</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="mt-2 p-2 rounded-lg border border-purple-300"
          >
            <option value="">Select Subject</option>
            {subjectList.map((item) => (
              <option key={item.id} value={item.id}>
                {item.subject_name}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-purple-700">
            Previous Notes
          </h2>
          {noteList?.notes?.length > 0 ? (
            <table className="min-w-full mt-4">
              <thead>
                <tr className="bg-purple-100 text-purple-700">
                  <th className="px-6 py-3 border">Date</th>
                  <th className="px-6 py-3 border">Chapter</th>
                  <th className="px-6 py-3 border">Title</th>
                  <th className="px-6 py-3 border">Action</th>
                </tr>
              </thead>
              <tbody>
                {noteList?.notes?.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-100">
                    <td className="px-6 py-4">{item.created_at}</td>
                    <td className="px-6 py-4">{item.chapter}</td>
                    <td className="px-6 py-4">{item.title}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedTip(item);
                          setShowViewModal(true);
                        }}
                        className="text-purple-700 hover:underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-600 mt-4">
              {errorNotes || "No notes available."}
            </p>
          )}
        </div>
      </div>

      {showAddModal && (
        <AddNotesModal
          onClose={() => setShowAddModal(false)}
          fetchNotesList={fetchNotesList}
          subjectList={subjectList}
        />
      )}
      {showViewModal && selectedTip && (
        <ViewNotesModal
          tip={selectedTip}
          onClose={() => setShowViewModal(false)}
        />
      )}
    </div>
  );
};

export default ClassNotes;

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

const ViewNotesModal = ({ tip, onClose }) => (
  <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-75 z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
      <h2 className="text-2xl font-bold text-purple-800">{tip.title}</h2>
      <p className="text-gray-700 mt-2">
        <strong>Description:</strong> {tip.description}
      </p>
      <button
        onClick={onClose}
        className="bg-purple-700 text-white px-4 py-2 rounded mt-4"
      >
        Close
      </button>
    </div>
  </div>
);
