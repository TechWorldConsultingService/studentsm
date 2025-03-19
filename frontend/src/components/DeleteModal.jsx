import axios from "axios";
import { Modal } from "antd";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { useSelector } from "react-redux";

import { Loader } from "./Spinner";

export default function DeleteModal({
  text,
  data,
  title,
  onClose,
  apiRoute,
  refresh = () => {},
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { access } = useSelector(state => state.user);

  const handleDelete = async () => {
    if (!access) {
      return toast.error("User is not authenticated. Please log in.");
    }

    try {
      setIsDeleting(true);
      await axios.delete(`http://localhost:8000/${apiRoute}`, {
        headers: {
          Authorization: `Bearer ${access}`,
        },
      });
      toast.success(`${text} deleted successfully.`);
      refresh();
      onClose();
    } catch (error) {
      toast.error(
        `Error deleting ${text}: ` +
          (error.response?.data?.detail || error.message)
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Modal
      centered
      open={!!data}
      footer={null}
      onCancel={onClose}
      title={
        <h2 className="text-xl font-bold text-purple-800 mb-4">
          Are you sure you want to delete this {text}:{" "}
          <span className="text-gray-800 text-lg">
            {title.length > 40 ? `${title.slice(0, 40)}...` : title}
          </span>{" "}
          ?
        </h2>
      }
    >
      <div className="mt-6 flex justify-center">
        <button
          type="submit"
          className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 mr-4"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          <div className="flex items-center gap-2">
            {isDeleting ? <Loader /> : null} <span>Yes, Delete</span>
          </div>
        </button>
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
        >
          Close
        </button>
      </div>
    </Modal>
  );
}
