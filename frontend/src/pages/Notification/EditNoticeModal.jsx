import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";

const receiverRoles = [
  "teacher",
  "student",
  "accountant",
  "teacher_student",
  "teacher_accountant",
  "student_accountant",
  "all",
];

const EditNoticeModal = ({ noticeData, onClose, refreshNotices }) => {
  const { access } = useSelector((state) => state.user);
  const [message, setMessage] = useState(noticeData.message || "");
  const [receiverRole, setReceiverRole] = useState(noticeData.receiver_role || "teacher");
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClass, setSelectedClass] = useState(noticeData.class_field || "");

  useEffect(() => {
    if (receiverRole === "student") {
      fetchClasses();
    }
  }, [receiverRole]);

  const fetchClasses = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/classes/");
      setClassOptions(response.data);
    } catch (error) {
      toast.error("Failed to load classes");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim()) {
      toast.error("Message cannot be empty");
      return;
    }
    const payload = {
      message,
      receiver_role: receiverRole,
      class_field: null,
    };
    if (receiverRole === "student" && selectedClass) {
      payload.class_field = selectedClass;
    }
    try {
      await axios.patch(
        `http://localhost:8000/api/messages/${noticeData.id}/`,
        payload,
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );
      toast.success("Notice updated successfully");
      refreshNotices();
    } catch (error) {
      toast.error("Failed to update notice");
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold mb-6 text-purple-800">Edit Notice</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Receiver Role */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Receiver Role
            </label>
            <select
              value={receiverRole}
              onChange={(e) => setReceiverRole(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-600"
            >
              {receiverRoles.map((role) => (
                <option key={role} value={role}>
                  {role.replace("_", " & ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Class Selection (if student) */}
          {receiverRole === "student" && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Select Class
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-600"
              >
                <option value="">Select a class (optional)</option>
                {classOptions.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.class_name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Message */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows="4"
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-600"
            ></textarea>
          </div>

          {/* Submit */}
          <div className="text-center">
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Update Notice
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button onClick={onClose} className="text-gray-600 underline">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNoticeModal;
