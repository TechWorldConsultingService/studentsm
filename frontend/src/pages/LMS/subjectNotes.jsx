import React, { useState, useEffect } from "react";
import axios from "axios";

const SubjectNotes = () => {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedNote, setSelectedNote] = useState(null);

  // Simulating fetching notes by using sample data
  useEffect(() => {
    const fetchNotes = async () => {
      setLoading(true);
      try {
        // Simulate an API call with sample data
        const sampleNotes = [
          {
            id: 1,
            title: "Introduction to Algorithms",
            uploaded_by: "Prof. John Doe",
            upload_date: "2024-12-10",
            description:
              "This note covers the basics of algorithms, including sorting algorithms, search algorithms, and time complexity.",
            resources: "Slides, Practice Problems, Sample Code",
          },
          {
            id: 2,
            title: "Data Structures: Linked Lists",
            uploaded_by: "Dr. Alice Smith",
            upload_date: "2024-12-12",
            description:
              "This note explains the concept of linked lists, types of linked lists, and common operations.",
            resources: "Textbook Chapters, Code Examples, Exercises",
          },
          {
            id: 3,
            title: "Database Management Systems",
            uploaded_by: "Prof. Robert Green",
            upload_date: "2024-12-08",
            description:
              "An overview of DBMS concepts, including relational databases, normalization, and SQL queries.",
            resources: "Lecture Slides, Database Schema Examples",
          },
        ];

        setNotes(sampleNotes);
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // Handle showing the note details
  const handleViewDetails = (note) => {
    setSelectedNote(note);
  };

  const handleCloseDetails = () => {
    setSelectedNote(null);
  };

  return (
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">Subject Notes</h1>
        <p className="mt-4 text-gray-600">
          Explore the notes and resources available for your subject here.
        </p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-purple-700">Available Notes</h2>
          <p className="text-gray-600 mt-2">
            Browse through the notes added by your teacher. Click on "Details" to learn more about each note.
          </p>
        </div>

        {loading ? (
          <div className="mt-6 text-center text-gray-600">Loading notes...</div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="bg-purple-700 text-white">
                  <th className="px-4 py-2 text-left">Title</th>
                  <th className="px-4 py-2 text-left">Uploaded By</th>
                  <th className="px-4 py-2 text-left">Upload Date</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {notes.map((note) => (
                  <tr key={note.id} className="border-b hover:bg-purple-50">
                    <td className="px-4 py-2">{note.title}</td>
                    <td className="px-4 py-2">{note.uploaded_by}</td>
                    <td className="px-4 py-2">{note.upload_date}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleViewDetails(note)}
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
        )}
      </div>

      {/* Modal for note details */}
      {selectedNote && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            <h2 className="text-2xl font-bold text-purple-800">Note Details</h2>
            <div className="mt-4">
              <p className="text-gray-700"><strong>Title:</strong> {selectedNote.title}</p>
              <p className="text-gray-700"><strong>Uploaded By:</strong> {selectedNote.uploaded_by}</p>
              <p className="text-gray-700"><strong>Upload Date:</strong> {selectedNote.upload_date}</p>
              <p className="mt-4 text-gray-700"><strong>Description:</strong> {selectedNote.description}</p>
              <p className="mt-4 text-gray-700"><strong>Additional Resources:</strong> {selectedNote.resources}</p>
            </div>
            <div className="mt-6 text-center">
              <button
                onClick={handleCloseDetails}
                className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectNotes;
