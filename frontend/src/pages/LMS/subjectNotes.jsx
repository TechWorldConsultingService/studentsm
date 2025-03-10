import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import SubjectLayout from "../../layout/SubjectLayout";

const SubjectNotes = () => {
  const { access, selectedSubject } = useSelector((state) => state.user);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);
  const [errorNotes, setErrorNotes] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      if (!access || !selectedSubject) {
        toast.error("Please select a subject first.");
        return;
      }
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:8000/api/notes/subject/${selectedSubject}`,
          {
            headers: { Authorization: `Bearer ${access}` },
          }
        );
        setNotes(response.data.notes || []);
        setErrorNotes(response.data.notes.length ? "" : "No notes found.");
      } catch (error) {
        setNotes([]);
        setErrorNotes(
          error.response?.data?.message || "Failed to fetch notes. Please try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [access, selectedSubject]);

  return (
    <SubjectLayout >
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">Subject Notes</h1>
        <p className="mt-4 text-gray-600">
          Browse the notes added by your teacher.
        </p>

        {loading ? (
          <div className="mt-6 text-center text-gray-600">Loading notes...</div>
        ) : notes.length > 0 ? (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-purple-700 text-white">
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Chapter</th>
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr key={note.id} className="border-b hover:bg-purple-50">
                                        <td className="px-4 py-2">{new Date(note.created_at).toISOString().split("T")[0]}</td>
                    <td className="px-4 py-2">{note.chapter}</td>
                    <td className="px-4 py-2">{note.title}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => setSelectedNote(note)}
                        className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-600 mt-4">{errorNotes || "No notes available."}</p>
        )}
      </div>

      {selectedNote && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-purple-800">Note Details</h2>
            <div className="mt-4 space-y-3">
            <p className="text-gray-700"><strong>Class:</strong> {selectedNote.class_code.class_name}</p>
            <p className="text-gray-700"><strong>Subject:</strong> {selectedNote.subject.subject_name}</p>
            <p className="text-gray-700"><strong>Chapter:</strong> {selectedNote.chapter}</p>
              <p className="text-gray-700"><strong>Title:</strong> {selectedNote.title}</p>
              <p className="text-gray-700"><strong>Description:</strong> {selectedNote.description}</p>
              {selectedNote.file ? (
                <p className="text-blue-600 underline">
                  <a href={`http://localhost:8000${selectedNote.file}`} target="_blank" rel="noopener noreferrer">
                    View Attached File
                  </a>
                </p>
              ) : (
                <p className="text-gray-500 italic">No file attached</p>
              )}
              <p className="text-gray-700 text-sm"><strong>Uploaded By:</strong> {selectedNote.created_by}</p>
              <p className="text-gray-700 text-sm"><strong>Upload Date:</strong> {new Date(selectedNote.created_at).toISOString().split("T")[0]}</p>
              
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={() => setSelectedNote(null)}
                className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
    </SubjectLayout>
  );
};

export default SubjectNotes;
