import React, { useState, useEffect } from "react";
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

  // Validation
  const validationSchema = Yup.object().shape({
    fullname: Yup.string().required("Receiver name is required."),
    message: Yup.string().required("Message is required."),
  });

  // Formik
  const formik = useFormik({
    initialValues: {
      fullname: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!selectedUser) {
        toast.error("Please select a user from search results.");
        setSubmitting(false);
        return;
      }
      const payload = {
        receiver: selectedUser.id, 
        message: values.message,
      };
      try {
        // POST new message
        await axios.post("http://localhost:8000/api/messages/create/", payload, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
        toast.success("Message sent successfully.");
        resetForm();
        setSearchResults([]);
        setSelectedUser(null);
        refreshMessages();
        onClose();
      } catch (error) {
        if (error.response && error.response.status === 401) {
          navigate("/");
        } else {
          toast.error(
            error.response?.data?.message ||
              "Failed to send message. Please try again."
          );
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users/search/?fullname=${encodeURIComponent(
          formik.values.fullname
        )}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      if (response.data && response.data.length > 0) {
        setSearchResults(response.data);
      } else {
        toast.error("No user found with that name.");
        setSearchResults([]);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Error searching for user. Please try again."
      );
    }
  };

  useEffect(() => {
    if (!formik.values.fullname.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(() => {
      handleSearch();
    }, 500);
    return () => clearTimeout(timer);
  }, [formik.values.fullname]);

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3 max-h-full overflow-auto">
        <h2 className="text-2xl font-bold mb-6 text-purple-800">Send Message</h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* User Search */}
          <div>
            <label htmlFor="fullname" className="block text-gray-700 font-semibold mb-2">
              Search User By Full Name
            </label>
            <div className="flex">
              <input
                id="fullname"
                name="fullname"
                type="text"
                placeholder="Enter user's full name"
                value={formik.values.fullname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full px-4 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-purple-600"
              />
              <button
                type="button"
                onClick={handleSearch}
                className="bg-purple-700 text-white px-4 py-2 rounded-r-md hover:bg-purple-800"
              >
                Search
              </button>
            </div>
            {formik.touched.fullname && formik.errors.fullname && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.fullname}</div>
            )}
          </div>

          {/* Search Results */}
          {searchResults.length > 0 && (
            <div className="bg-gray-100 p-4 rounded-md">
              <p className="mb-2 text-gray-700">Select a User:</p>
              <ul className="space-y-2">
                {searchResults.map((userItem) => (
                  <li key={userItem.id}>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="selectedUser"
                        value={userItem.id}
                        onChange={() => setSelectedUser(userItem)}
                        className="form-radio h-4 w-4 text-purple-700"
                      />
                      <span className="ml-2 text-gray-800">
                        {userItem.first_name} {userItem.last_name} (
                        {userItem.username})
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Message Input */}
          <div>
            <label htmlFor="message" className="block text-gray-700 font-semibold mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              placeholder="Enter your message"
              rows="4"
              value={formik.values.message}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
            ></textarea>
            {formik.touched.message && formik.errors.message && (
              <div className="text-red-500 text-sm mt-1">{formik.errors.message}</div>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              {formik.isSubmitting ? "Sending..." : "Send Message"}
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

export default AddMessageModal;
