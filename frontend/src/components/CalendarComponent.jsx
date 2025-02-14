import React, { useState, useEffect, useCallback } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import momentTz from "moment-timezone";
import axios from "axios";
import { toast } from "react-hot-toast";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";

/* 
  This localizer sets up moment as the date/time library 
  for react-big-calendar. 
*/
const localizer = momentLocalizer(moment);

/* 
  We wrap the Calendar with drag-and-drop support.
  This HOC provides onEventDrop / onEventResize handlers.
*/
const DnDCalendar = withDragAndDrop(Calendar);

/*
  The CalendarComponent receives these props:
  - role: "student" | "teacher" | "principal"
  - pageTitle: a string for the heading
*/
const CalendarComponent = ({
  role = "student",
  pageTitle = "School Calendar",
}) => {
  // State
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Add/Edit Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Fields for new/edit event
  const [tempTitle, setTempTitle] = useState("");
  const [tempDesc, setTempDesc] = useState("");
  const [tempStart, setTempStart] = useState(null);
  const [tempEnd, setTempEnd] = useState(null);

  // Confirm Delete Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteEventId, setDeleteEventId] = useState(null);

  // 1) Fetch events from server
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Example of retrieving token from localStorage:
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token found. Please login.");

      const response = await axios.get("http://localhost:8000/api/events/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Convert server event data to RBC format
      const loadedEvents = response.data.map((evt) => ({
        id: evt.id,
        title: evt.title,
        description: evt.description,
        start: new Date(evt.start_time),
        end: new Date(evt.end_time),
        // You can add more fields if your server returns them
        // e.g. color, user_id, etc.
      }));

      setEvents(loadedEvents);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError(err.message || "Error loading events");
    }
  }, []);

  // On mount, fetch events
  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  // 2) Open modal for adding a new event (by selecting a slot)
  const handleSelectSlot = ({ start, end }) => {
    // If student, do nothing
    if (role === "student") return;

    // Otherwise, open modal to create a new event
    setSelectedEvent(null); // means "new" event
    setTempTitle("");
    setTempDesc("");
    setTempStart(start);
    setTempEnd(end);
    setModalOpen(true);
  };

  // 3) Open modal for editing an existing event
  const handleSelectEvent = (event) => {
    // If student, maybe just show an alert or do nothing
    if (role === "student") {
      alert(`Event: ${event.title}\nDetails: ${event.description}`);
      return;
    }

    // For teacher/principal, open edit modal
    setSelectedEvent(event);
    setTempTitle(event.title);
    setTempDesc(event.description);
    setTempStart(event.start);
    setTempEnd(event.end);
    setModalOpen(true);
  };

  // 4) Save (create or update) event
  const handleSaveEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token, please login.");

      // Convert to ISO
      const startISO = tempStart.toISOString();
      const endISO = tempEnd.toISOString();

      if (selectedEvent) {
        // EDIT existing event
        const eventId = selectedEvent.id;
        const response = await axios.put(
          `http://localhost:8000/api/events/${eventId}/`,
          {
            title: tempTitle,
            description: tempDesc,
            start_time: startISO,
            end_time: endISO,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Update local state
        setEvents((prev) =>
          prev.map((evt) =>
            evt.id === eventId
              ? {
                  ...evt,
                  title: response.data.title,
                  description: response.data.description,
                  start: new Date(response.data.start_time),
                  end: new Date(response.data.end_time),
                }
              : evt
          )
        );
        toast.success("Event updated!");
      } else {
        // CREATE new event
        const response = await axios.post(
          "http://localhost:8000/api/events/",
          {
            title: tempTitle,
            description: tempDesc,
            start_time: startISO,
            end_time: endISO,
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        // Add new event to state
        setEvents((prev) => [
          ...prev,
          {
            id: response.data.id,
            title: response.data.title,
            description: response.data.description,
            start: new Date(response.data.start_time),
            end: new Date(response.data.end_time),
          },
        ]);
        toast.success("Event created!");
      }

      // Close modal
      setModalOpen(false);
      setSelectedEvent(null);
    } catch (err) {
      toast.error("Error saving event.");
      console.error(err);
    }
  };

  // 5) Open the "Delete" confirmation
  const handleDeleteEvent = (eventId) => {
    setDeleteEventId(eventId);
    setDeleteModalOpen(true);
  };

  // Actually delete the event
  const confirmDeleteEvent = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token, please login.");

      await axios.delete(`http://localhost:8000/api/events/${deleteEventId}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setEvents((prev) => prev.filter((evt) => evt.id !== deleteEventId));
      toast.success("Event deleted.");
    } catch (err) {
      toast.error("Error deleting event.");
    } finally {
      setDeleteModalOpen(false);
      setDeleteEventId(null);
    }
  };

  // 6) Drag and Drop (move/reschedule event)
  const handleEventDrop = async ({ event, start, end }) => {
    // Only teachers/principals can drag & drop
    if (role === "student") {
      toast.error("Students cannot move events.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token, please login.");

      // Attempt an update
      await axios.put(
        `http://localhost:8000/api/events/${event.id}/`,
        {
          title: event.title,
          description: event.description,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Update local state
      setEvents((prevEvents) =>
        prevEvents.map((evt) =>
          evt.id === event.id
            ? { ...evt, start, end }
            : evt
        )
      );
      toast.success("Event moved.");
    } catch (err) {
      toast.error("Error moving event.");
      console.error(err);
    }
  };

  // 7) Resize Event
  const handleEventResize = async ({ event, start, end }) => {
    // Only teachers/principals can resize events
    if (role === "student") {
      toast.error("Students cannot resize events.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token, please login.");

      await axios.put(
        `http://localhost:8000/api/events/${event.id}/`,
        {
          title: event.title,
          description: event.description,
          start_time: start.toISOString(),
          end_time: end.toISOString(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setEvents((prevEvents) =>
        prevEvents.map((evt) =>
          evt.id === event.id
            ? { ...evt, start, end }
            : evt
        )
      );
      toast.success("Event resized.");
    } catch (err) {
      toast.error("Error resizing event.");
      console.error(err);
    }
  };

  // 8) Color-coded events
  // Example: color events by their title or role or category
  const eventPropGetter = (event) => {
    let backgroundColor = "#3174ad"; // default
    if (event.title.toLowerCase().includes("exam")) {
      backgroundColor = "#d97706"; // orange
    } else if (event.title.toLowerCase().includes("holiday")) {
      backgroundColor = "#059669"; // green
    }
    // Return style object
    return { style: { backgroundColor } };
  };

  return (
    <div className="p-4 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold text-purple-800 mb-4">{pageTitle}</h1>

      {error && <p className="text-red-600 mb-2">{error}</p>}
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="bg-white p-4 rounded shadow">
          <DnDCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 600 }}
            selectable={role !== "student"} 
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            onEventDrop={handleEventDrop}
            onEventResize={handleEventResize}
            resizable
            eventPropGetter={eventPropGetter}
            popup
          />
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/2 relative">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-purple-700 mb-4">
              {selectedEvent ? "Edit Event" : "Add Event"}
            </h2>
            <div className="mb-3">
              <label className="block font-semibold mb-1 text-sm">
                Title:
              </label>
              <input
                type="text"
                className="w-full border p-2 rounded"
                value={tempTitle}
                onChange={(e) => setTempTitle(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="block font-semibold mb-1 text-sm">
                Description:
              </label>
              <textarea
                rows="3"
                className="w-full border p-2 rounded"
                value={tempDesc}
                onChange={(e) => setTempDesc(e.target.value)}
              />
            </div>

            {/* Show date/time info */}
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-semibold mb-1 text-sm">Start:</label>
                <p className="text-sm text-gray-600">
                  {tempStart
                    ? moment(tempStart).format("YYYY-MM-DD HH:mm")
                    : "N/A"}
                </p>
              </div>
              <div className="flex-1">
                <label className="block font-semibold mb-1 text-sm">End:</label>
                <p className="text-sm text-gray-600">
                  {tempEnd
                    ? moment(tempEnd).format("YYYY-MM-DD HH:mm")
                    : "N/A"}
                </p>
              </div>
            </div>

            {/* If editing an event, show 'Delete' button */}
            {selectedEvent && (
              <button
                onClick={() => {
                  setModalOpen(false);
                  handleDeleteEvent(selectedEvent.id);
                }}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            )}

            <div className="flex justify-end mt-4">
              <button
                onClick={handleSaveEvent}
                className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-1/3 relative">
            <button
              onClick={() => setDeleteModalOpen(false)}
              className="absolute top-2 right-2 text-gray-600 hover:text-black"
            >
              &times;
            </button>
            <h2 className="text-lg font-bold text-red-700 mb-4">Confirm Delete</h2>
            <p className="mb-4">Are you sure you want to delete this event?</p>
            <div className="flex justify-end">
              <button
                onClick={() => setDeleteModalOpen(false)}
                className="mr-2 bg-gray-200 text-gray-700 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={confirmDeleteEvent}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarComponent;
