import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";

const AddMessageModal = ({ onClose, refreshMessages }) => {
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [searchResults, setSearchResults] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  const formik = useFormik({
    initialValues: {
      fullname: "",
      subject: "",
      message: "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Receiver name is required."),
      subject: Yup.string().required("Subject is required."),
      message: Yup.string().required("Message is required."),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!selectedUser) {
        toast.error("Please select a user from search results.");
        setSubmitting(false);
        return;
      }

      const payload = {
        receiver: selectedUser.id,
        subject: values.subject,
        message: values.message,
      };

      try {
        await axios.post("http://localhost:8000/api/messages/create/", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
        toast.success("Message sent successfully.");
        resetForm();
        setSelectedUser(null);
        setSearchResults([]);
        refreshMessages();
        onClose();
      } catch (error) {
        if (error.response?.status === 401) {
          navigate("/");
        } else {
          toast.error("Failed to send message. Please try again.");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleSearch = async () => {
    const name = formik.values.fullname.trim();
    if (!name) return setSearchResults([]);

    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/search/?fullname=${fullName}}`,
        {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (response.data.length > 0) {
        setSearchResults(response.data);
      } else {
        setSearchResults([]);
        toast.error("No user found.");
      }
    } catch (error) {
      toast.error("Error fetching users.");
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch();
    }, 400);
    return () => clearTimeout(timer);
  }, [formik.values.fullname]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-lg p-6 rounded-xl shadow-lg overflow-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-purple-700 mb-6 text-center">
          Send New Message
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="fullname" className="text-gray-700 font-medium block mb-2">
              Search User by Full Name
            </label>
            <input
              id="fullname"
              name="fullname"
              type="text"
              placeholder="e.g. John Doe"
              value={formik.values.fullname}
              onChange={formik.handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            {formik.touched.fullname && formik.errors.fullname && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.fullname}</p>
            )}
          </div>

          {searchResults.length > 0 && (
            <div className="bg-gray-50 p-4 rounded-md border mt-2">
              <p className="font-medium text-gray-700 mb-2">Select a User:</p>
              <ul className="space-y-2 max-h-40 overflow-y-auto">
                {searchResults.map((user) => (
                  <li key={user.id}>
                    <label className="flex items-center gap-2 text-gray-800">
                      <input
                        type="radio"
                        name="selectedUser"
                        value={user.id}
                        onChange={() => setSelectedUser(user)}
                        className="accent-purple-600"
                      />
                      {user.first_name} {user.last_name} ({user.username})
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div>
            <label htmlFor="subject" className="text-gray-700 font-medium block mb-2">
              Subject
            </label>
            <input
              id="subject"
              name="subject"
              type="text"
              placeholder="Enter subject"
              value={formik.values.subject}
              onChange={formik.handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            {formik.touched.subject && formik.errors.subject && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.subject}</p>
            )}
          </div>

          <div>
            <label htmlFor="message" className="text-gray-700 font-medium block mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="Type your message..."
              value={formik.values.message}
              onChange={formik.handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
            {formik.touched.message && formik.errors.message && (
              <p className="text-sm text-red-500 mt-1">{formik.errors.message}</p>
            )}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-purple-700 text-white px-6 py-2 rounded-md hover:bg-purple-800 disabled:opacity-50"
            >
              {formik.isSubmitting ? "Sending..." : "Send"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMessageModal;
