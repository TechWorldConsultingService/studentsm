import axios from "axios";
import { Tree } from "antd";
import moment from "moment";
import toast from "react-hot-toast";
import { BsChat } from "react-icons/bs";
import { useSelector } from "react-redux";
import { FaArrowLeftLong } from "react-icons/fa6";
import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import AddReply from "./Reply/AddReply";
import AddComment from "./Comments/AddComment";
import MainLayout from "../../layout/MainLayout";
import EditComment from "./Comments/EditComment";
import DiscussionFooter from "./DiscussionFooter";
import { Loader } from "../../components/Spinner";
import DeleteModal from "../../components/DeleteModal";
import CustomDropdown from "../../components/CustomDropdown";

export default function DiscussionForumDetails() {
  const navigate = useNavigate();
  const { id: discussionId } = useParams();
  const { access, username } = useSelector(state => state.user);

  const [comments, setComments] = useState([]);
  const [discussion, setDiscussion] = useState(null);
  const [cacheComments, setCacheComments] = useState([]);
  const [showReplyInput, setShowReplyInput] = useState([]);
  const [showEditComment, setShowEditComment] = useState(null);
  const [commentsFetching, setCommentsFetching] = useState(false);
  const [showDeleteComment, setShowDeleteComment] = useState(null);
  const [discussionFetching, setDiscussionFetching] = useState(false);

  useEffect(() => {
    formatCustomComments(cacheComments, showReplyInput);
  }, [showReplyInput.length]);

  const fetchDiscussion = async () => {
    if (!access) {
      return toast.error("User is not authenticated. Please log in.");
    }
    setDiscussionFetching(true);

    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/forum/posts/${discussionId}`,
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );
      setDiscussion(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error(
          "Error fetching discussion: " +
            (error.response?.data?.error || error.message)
        );
        navigate("/discussion-forum");
      }
    } finally {
      setDiscussionFetching(false);
    }
  };

  function recursiveFn({ comment, tree }) {
    comment.replies.map(reply => {
      const childrenData = {
        title: replyDesign({
          comment: reply,
          handleEdit: setShowEditComment,
          handleDelete: setShowDeleteComment,
        }),
        key: reply.created_at,
      };
      if (!tree.children) {
        tree.children = [];
      }
      tree.children.push(childrenData);

      if (reply.replies.length) {
        recursiveFn({ comment: reply, tree: childrenData });
      }
    });
  }

  const replyDesign = ({ comment, handleEdit, handleDelete }) => {
    return (
      <>
        <div className="flex gap-4">
          <p className="font-bold">{comment.created_by.username}</p>
          <p>{moment(comment.created_at).fromNow()}</p>
        </div>
        <p>{comment.content}</p>
        <div className="flex">
          <div
            className="flex gap-1 items-center hover:bg-gray-200 w-max rounded px-2"
            onClick={() => handleReplyClick(comment.id)}
          >
            <BsChat />
            Reply
          </div>
          {username === comment?.created_by?.username ? (
            <CustomDropdown
              handleEdit={() => handleEdit(comment)}
              handleDelete={() => handleDelete(comment)}
            />
          ) : null}
        </div>
        <div className="mt-4">
          <AddReply
            comment={comment}
            refresh={fetchComments}
            discussion={discussion}
            onClose={() => removeReplyInput(comment.id)}
            open={showReplyInput.find(id => id === comment.id)}
          />
        </div>
      </>
    );
  };

  function formatCustomComments(data, showReplyInput) {
    const customComments = data.map(comment => {
      const treeData = {
        title: replyDesign({
          comment,
          handleEdit: setShowEditComment,
          handleDelete: setShowDeleteComment,
        }),

        key: comment.created_at,
        children: [],
      };

      if (comment.replies.length) {
        recursiveFn({ comment, tree: treeData });
      }

      return treeData;
    });

    setComments(customComments);
  }

  const handleReplyClick = id => {
    setShowReplyInput(state => [...state, id]);
  };

  const removeReplyInput = id => {
    const filterData = showReplyInput.filter(replyId => replyId !== id);
    setShowReplyInput(filterData);
  };

  const fetchComments = async ({ closeReplyComment = null } = {}) => {
    if (!access) {
      return toast.error("User is not authenticated. Please log in.");
    }
    setCommentsFetching(true);

    try {
      const { data } = await axios.get(
        `http://localhost:8000/api/forum/posts/${discussionId}/comments/`,
        {
          headers: { Authorization: `Bearer ${access}` },
        }
      );

      if (data?.length) {
        setCacheComments(data);

        formatCustomComments(data, showReplyInput);
      }

      if (closeReplyComment) {
        removeReplyInput(closeReplyComment);
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error fetching comments: " + (error.message || error));
      }
    } finally {
      setCommentsFetching(false);
    }
  };

  useEffect(() => {
    fetchDiscussion();
    fetchComments();
  }, []);

  return (
    <MainLayout>
      <div className="bg-purple-50 p-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          <Link
            to="/discussion-forum"
            className="w-8 h-8 bg-gray-300 hover:bg-slate-300 flex justify-center items-center rounded"
          >
            <FaArrowLeftLong />
          </Link>
          {discussionFetching ? (
            <div className="mt-6 text-center text-gray-600">Loading...</div>
          ) : (
            <div className="overflow-x-auto mt-4 overflow-y-hidden">
              {!discussion ? (
                <div className="text-gray-600">No discussion found.</div>
              ) : (
                <>
                  <h1 className="text-2xl mb-4 font-bold">
                    {discussion?.topic}
                  </h1>
                  <p className="mb-4">{discussion.content}</p>
                  <DiscussionFooter
                    itemBg={true}
                    discussion={discussion}
                    refresh={fetchDiscussion}
                  />
                  <div className="mt-4">
                    <AddComment
                      open={true}
                      refresh={fetchComments}
                      discussion={discussion}
                    />
                  </div>

                  {commentsFetching ? (
                    <div className="flex justify-center">
                      <Loader fill="purple" width={32} height={32} />
                    </div>
                  ) : (
                    <Tree
                      showLine
                      selectable={false}
                      treeData={comments}
                      defaultExpandAll={true}
                      className="sms-custom-discussion-tree"
                    />
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <EditComment
        refresh={fetchComments}
        editComment={showEditComment}
        onClose={() => setShowEditComment(null)}
      />

      {showDeleteComment && (
        <DeleteModal
          text="Comment"
          refresh={fetchComments}
          data={showDeleteComment}
          title={showDeleteComment.content}
          onClose={() => setShowDeleteComment(null)}
          apiRoute={`api/forum/comments/${showDeleteComment.id}/`}
        />
      )}
    </MainLayout>
  );
}
