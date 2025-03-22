import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Select } from "antd";
import axios from "axios";
import toast from "react-hot-toast";

const receiverRoles = [
  "teacher",
  "student",
  "accountant",
  "teacher_student",
  "teacher_accountant",
  "student_accountant",
  "all",
];

const NoticeModal = ({ noticeData, isOpen, onClose, refreshNotices }) => {
  const editMode = Boolean(noticeData);
  const { access } = useSelector((state) => state.user);


  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [receiverRole, setReceiverRole] = useState("");
  const [classOptions, setClassOptions] = useState([]);
  const [selectedClasses, setSelectedClasses] = useState([]);

  useEffect(() => {
    if (editMode) {
      setSubject(noticeData.subject || "");
      setMessage(noticeData.message || "");
      setReceiverRole(noticeData.receiver_role || "");
      setSelectedClasses(
        Array.isArray(noticeData.class_field) ? noticeData.class_field : []
      );
    } else {
      setSubject("");
      setMessage("");
      setReceiverRole("");
      setSelectedClasses([]);
    }
  }, [editMode, noticeData]);


  useEffect(() => {
    if (
      receiverRole === "student" ||
      receiverRole === "teacher_student" ||
      receiverRole === "student_accountant"
    ) {
      fetchClasses();
    } else {
      setSelectedClasses([]);
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

  const handleMultiSelectChange = (values) => {
    setSelectedClasses(values);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subject.trim() || !message.trim()) {
      toast.error("Subject and Message cannot be empty");
      return;
    }

    const payload = {
      subject,
      message,
      receiver_role: receiverRole,
    };

    if (
      receiverRole === "student" ||
      receiverRole === "teacher_student" ||
      receiverRole === "student_accountant"
    ) {
      if (selectedClasses.length > 0) {
        payload.class_field = selectedClasses;
      }
    }

    try {
      if (editMode) {
        await axios.put(
          `http://localhost:8000/api/messages/${noticeData.id}/`,
          payload,
          {
            headers: { Authorization: `Bearer ${access}` },
          }
        );
        toast.success("Notice updated successfully");
      } else {
        await axios.post("http://localhost:8000/api/messages/create/", payload, {
          headers: { Authorization: `Bearer ${access}` },
        });
        toast.success("Notice created successfully");
      }

      refreshNotices();
      onClose();
    } catch (error) {
      toast.error("Failed to save notice");
    }
  };

  if (!isOpen) return null;


  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3 max-h-full overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-purple-800">
          {editMode ? "Edit Notice" : "Add Notice"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject */}
          <div>
            <label className="block text-gray-700 font-semibold mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-purple-600"
            />
          </div>

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
              <option value="">Select a role</option>
              {receiverRoles.map((role) => (
                <option key={role} value={role}>
                  {role.replace("_", " & ").toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          {/* Class Selection */}
          {(receiverRole === "student" ||
            receiverRole === "teacher_student" ||
            receiverRole === "student_accountant") && (
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                {receiverRole === "student" ? "Select Class" : "Select Classes"}
              </label>
              <Select
                  mode="multiple"
                  placeholder="Select classes"
                  className="w-full"
                  value={selectedClasses}
                  onChange={handleMultiSelectChange}
                >
                  {classOptions.map((cls) => (
                    <Select.Option key={cls.id} value={cls.id}>
                      {cls.class_name}
                    </Select.Option>
                  ))}
                </Select>

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
            />
          </div>

          {/* Action buttons */}
          <div className="text-center space-x-5">
            <button
              type="submit"
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              {editMode ? "Update" : "Send"}
            </button>
            <button
              type="button"
              onClick={onClose}
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

export default NoticeModal;
