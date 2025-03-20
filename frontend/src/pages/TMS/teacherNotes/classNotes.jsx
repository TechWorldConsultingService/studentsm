import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import ClassLayout from "../../../layout/ClassLayout";
import AddNotesModal from "./AddNotesModal";
import EditNotesModal from "./EditNotesModal";
import ViewNotesModal from "./ViewNotesModal";
import DeleteNotesModal from "./DeleteNotesModal";
import { setSelectedClass } from "../../../redux/reducerSlices/userSlice";

const ClassNotes = () => {
  const { className } = useParams();
  const dispatch = useDispatch();
  const {
    access,
    id: teacher_id,
    selectedClassName,
  } = useSelector((state) => state.user);

  useEffect(() => {
    if (
      className &&
      className.toLowerCase() !== selectedClassName.toLowerCase()
    ) {
      dispatch(setSelectedClass(className));
    }
  }, [className, selectedClassName, dispatch]);

  // Modal states and other state variables
  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedTip, setSelectedTip] = useState(null);
  const [noteList, setNoteList] = useState([]);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSubjectId, setSelectedSubjectId] = useState("");
  const [errorNotes, setErrorNotes] = useState("");

  // Fetch the list of subjects for the selected class and teacher
  const fetchSubjects = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/filter-subjects/?teacher=${teacher_id}&class_assigned=${selectedClassName}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (response.data?.subjects) {
        setSubjectList(response.data.subjects);
      }
    } catch (error) {
      setErrorNotes("Failed to find subject.");
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [access, teacher_id, selectedClassName]);

  const fetchNotesList = async () => {
    if (!access || !selectedSubjectId) {
      toast.error("Please select a subject first.");
      return;
    }
    try {
      const response = await axios.get(
        `http://localhost:8000/api/notes/subject/${selectedSubjectId}/`,
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
    }
  };

  useEffect(() => {
    if (selectedSubjectId) {
      fetchNotesList();
    }
  }, [selectedSubjectId]);

  return (
    <ClassLayout>
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
            >
              Add Notes
            </button>
          </div>

          <div className="flex flex-col p-2">
            <label className="text-purple-700 font-semibold">Subject</label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="mt-2 p-2 rounded-lg border border-purple-300"
            >
              <option value="">Select Subject</option>
              {subjectList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.subject_name}({item.subject_code})
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
                      <td className="px-6 py-4">
                        {new Date(item.created_at).toISOString().split("T")[0]}
                      </td>
                      <td className="px-6 py-4">{item.chapter}</td>
                      <td className="px-6 py-4">{item.title}</td>
                      <td className="px-6 py-4 space-x-4">
                        <button
                          onClick={() => {
                            setSelectedTip(item);
                            setShowViewModal(true);
                          }}
                          className="text-purple-700 hover:underline"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTip(item);
                            setShowEditModal(true);
                          }}
                          className="text-purple-700 hover:underline"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTip(item);
                            setShowDeleteModal(true);
                          }}
                          className="text-purple-700 hover:underline"
                        >
                          Delete
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
        {showEditModal && selectedTip && (
          <EditNotesModal
            note={selectedTip}
            onClose={() => setShowEditModal(false)}
            fetchNotesList={fetchNotesList}
          />
        )}
        {showDeleteModal && selectedTip && (
          <DeleteNotesModal
            note={selectedTip}
            onClose={() => setShowDeleteModal(false)}
            fetchNotesList={fetchNotesList}
          />
        )}
      </div>
    </ClassLayout>
  );
};

export default ClassNotes;
