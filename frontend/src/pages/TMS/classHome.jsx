import React, { useState } from "react";

const ClassHome = () => {
  const [classData] = useState({
    name: "Math 101",
    teacher: "Mr. John Doe",
  });

  // Modal state management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [announcementDate, setAnnouncementDate] = useState(""); // Date state
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [announcementText, setAnnouncementText] = useState("");
  const [announcementEditDate, setAnnouncementEditDate] = useState(""); // Edit Date state

  // Function to open/close modal
  const toggleModal = () => setIsModalOpen((prev) => !prev);

  // Function to handle adding a new announcement
  const handleAddAnnouncement = () => {
    // Set the current date if no date is provided
    const date = announcementDate || new Date().toISOString().split("T")[0];

    if (newAnnouncement.trim()) {
      setAnnouncements([
        ...announcements,
        { text: newAnnouncement, date, id: Date.now() },
      ]);
      setNewAnnouncement(""); // Clear input after adding
      setAnnouncementDate(""); // Clear date input
    }
  };

  // Function to handle editing an announcement
  const handleEditAnnouncement = (id) => {
    const announcementToEdit = announcements.find((ann) => ann.id === id);
    setAnnouncementText(announcementToEdit.text);
    setAnnouncementEditDate(announcementToEdit.date);
    setEditingAnnouncement(id);
  };

  // Function to handle saving the edited announcement
  const handleSaveEdit = () => {
    setAnnouncements(
      announcements.map((ann) =>
        ann.id === editingAnnouncement
          ? { ...ann, text: announcementText, date: announcementEditDate }
          : ann
      )
    );
    setEditingAnnouncement(null);
    setAnnouncementText(""); // Clear input after saving
    setAnnouncementEditDate(""); // Clear date input after saving
  };

  // Function to handle deleting an announcement
  const handleDeleteAnnouncement = (id) => {
    setAnnouncements(announcements.filter((ann) => ann.id !== id));
  };

  return (
    <div className="w-full p-4 bg-purple-50">
      {/* Announcement Button */}
    <div className="w-full flex justify-end px-7 pb-7">
    <button
        className="bg-purple-600 text-white px-4 py-2 rounded-md shadow-md"
        onClick={toggleModal}
      >
        Add Announcement
      </button>
    </div>


      {/* Class Overview */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300 mb-6">
        <h1 className="text-3xl font-extrabold text-purple-800">
          {classData.name} - Class Home
        </h1>
        <p className="mt-4 text-gray-600">
          Welcome to the {classData.name} class. Here, you will find all the resources related to this class including assignments, notes, syllabus, and more.
        </p>
      </div>

      {/* Upcoming Events Section */}
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h2 className="text-2xl font-semibold text-purple-700">Upcoming Events</h2>
        <div className="space-y-4 mt-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-purple-700">Mid-Term Exam</p>
            <p className="text-gray-600">Date: 15th January 2024</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium text-purple-700">Geometry Quiz</p>
            <p className="text-gray-600">Date: 20th January 2024</p>
          </div>
        </div>
      </div>

      {/* Modal for Announcements */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-2xl font-semibold text-purple-700 mb-4">Announcements</h3>
            <div className="space-y-4">
              {/* Add New Announcement */}
              <div>
                <input
                  type="text"
                  className="w-full p-2 border border-purple-300 rounded-md"
                  placeholder="Add a new announcement"
                  value={newAnnouncement}
                  onChange={(e) => setNewAnnouncement(e.target.value)}
                />
                <div className="mt-2">
                  <label className="text-purple-700">Announcement Date</label>
                  <input
                    type="date"
                    className="w-full p-2 border border-purple-300 rounded-md mt-1"
                    value={announcementDate}
                    onChange={(e) => setAnnouncementDate(e.target.value)}
                  />
                </div>
                <button
                  className="mt-2 bg-purple-600 text-white px-4 py-2 rounded-md"
                  onClick={handleAddAnnouncement}
                >
                  Add Announcement
                </button>
              </div>

              {/* Edit Existing Announcement */}
              {editingAnnouncement && (
                <div>
                  <h4 className="font-medium text-purple-700">Edit Announcement</h4>
                  <input
                    type="text"
                    className="w-full p-2 border border-purple-300 rounded-md"
                    value={announcementText}
                    onChange={(e) => setAnnouncementText(e.target.value)}
                  />
                  <div className="mt-2">
                    <label className="text-purple-700">Announcement Date</label>
                    <input
                      type="date"
                      className="w-full p-2 border border-purple-300 rounded-md mt-1"
                      value={announcementEditDate}
                      onChange={(e) => setAnnouncementEditDate(e.target.value)}
                    />
                  </div>
                  <button
                    className="mt-2 bg-green-600 text-white px-4 py-2 rounded-md"
                    onClick={handleSaveEdit}
                  >
                    Save Edit
                  </button>
                </div>
              )}

              {/* View Previous Announcements */}
              <div>
                <h4 className="font-medium text-purple-700">Previous Announcements</h4>
                {announcements.length > 0 ? (
                  <table className="w-full table-auto">
                    <thead>
                      <tr>
                        <th className="px-4 py-2 text-left text-purple-700">Announcement</th>
                        <th className="px-4 py-2 text-left text-purple-700">Date</th>
                        <th className="px-4 py-2 text-left text-purple-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {announcements.map((announcement) => (
                        <tr key={announcement.id}>
                          <td className="px-4 py-2 text-gray-700">{announcement.text}</td>
                          <td className="px-4 py-2 text-gray-700">{announcement.date}</td>
                          <td className="px-4 py-2">
                            <button
                              className="text-blue-600"
                              onClick={() => handleEditAnnouncement(announcement.id)}
                            >
                              Edit
                            </button>
                            <button
                              className="ml-4 text-red-600"
                              onClick={() => handleDeleteAnnouncement(announcement.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-gray-600">No announcements yet.</p>
                )}
              </div>
            </div>

            {/* Close Modal Button */}
            <button
              className="mt-4 bg-red-600 text-white px-4 py-2 rounded-md"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassHome;
