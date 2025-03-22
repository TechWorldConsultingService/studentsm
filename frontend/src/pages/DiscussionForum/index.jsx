import axios from "axios";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import MainLayout from "../../layout/MainLayout";
import DiscussionFooter from "./DiscussionFooter";
import AddEditDiscussion from "./AddEditDiscussion";

const ADD = "ADD";

export default function DiscussionForum() {
  const navigate = useNavigate();
  const { access } = useSelector(state => state.user);

  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(null);
  const [discussions, setDiscussions] = useState([]);

  const fetchDiscussions = async () => {
    if (!access) {
      return toast.error("User is not authenticated. Please log in.");
    }
    setLoading(true);

    try {
      const { data } = await axios.get(
        "http://localhost:8000/api/forum/posts/",
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );
      setDiscussions(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error fetching discussions: " + (error.message || error));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDiscussions();
  }, []);

  const handleAddDiscussionModal = () => {
    setShowModal({ type: ADD });
  };

  const closeDiscussionModal = () => {
    setShowModal(null);
  };

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <h1 className="text-3xl font-extrabold text-purple-800">
            Discussion Forum
          </h1>

          <div className="mt-6">
            <button
              onClick={handleAddDiscussionModal}
              className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
            >
              Add Discussion
            </button>
          </div>

          {loading ? (
            <div className="mt-6 text-center text-gray-600">Loading...</div>
          ) : (
            <div className="mt-6 overflow-x-auto">
              {discussions.length === 0 ? (
                <div className="text-gray-600">No discussions found.</div>
              ) : (
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-purple-700 text-white">
                      <th className="px-4 py-2 text-left">Topic</th>
                    </tr>
                  </thead>
                  <tbody>
                    {discussions.map(discussion => (
                      <tr
                        key={discussion.id}
                        className="border-b hover:bg-purple-50"
                      >
                        <td className="px-4 py-2">
                          <Link
                            to={`/discussion-forum/details/${discussion.id}`}
                          >
                            <p className="font-bold text-lg leading-6 line-clamp-1">
                              {discussion.topic}
                            </p>
                            <p className="line-clamp-2">{discussion.content}</p>
                          </Link>
                          <DiscussionFooter
                            discussion={discussion}
                            refresh={fetchDiscussions}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      </div>

      {showModal?.type === ADD && (
        <AddEditDiscussion
          refresh={fetchDiscussions}
          onClose={closeDiscussionModal}
          open={showModal?.type === ADD}
        />
      )}
    </MainLayout>
  );
}
