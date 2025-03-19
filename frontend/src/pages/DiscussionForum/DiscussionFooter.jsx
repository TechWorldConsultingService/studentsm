import moment from "moment";
import { useState } from "react";
import { useSelector } from "react-redux";

import AddEditDiscussion from "./AddEditDiscussion";
import DeleteModal from "../../components/DeleteModal";
import CustomDropdown from "../../components/CustomDropdown";

const UPDATE = "UPDATE";
const DELETE = "DELETE";

export default function DiscussionFooter({
  discussion,
  refresh,
  itemBg = false,
} = {}) {
  const { username } = useSelector(state => state.user);

  const [showModal, setShowModal] = useState(null);

  const handleEditDiscussion = discussion => {
    setShowModal({ type: UPDATE, data: discussion });
  };

  const handleDeleteDiscussion = discussion => {
    setShowModal({ type: DELETE, data: discussion });
  };

  const closeDiscussionModal = () => {
    setShowModal(null);
  };

  return (
    <div className="mt-2 flex gap-4">
      <p
        className={` ${
          itemBg
            ? "bg-gray-200 !h-[20px] font-medium text-slate-800 rounded-xl text-xs flex items-center px-2"
            : "text-purple-700"
        }`}
      >
        {discussion?.created_by?.username}
      </p>
      <p
        className={` ${
          itemBg
            ? "bg-gray-200 !h-[20px] font-medium text-slate-800 rounded-xl text-xs flex items-center px-2"
            : "text-gray-500"
        }`}
      >
        {moment(discussion.created_at).fromNow()}
      </p>
      {username === discussion?.created_by?.username ? (
        <div>
          <CustomDropdown
            itemBg={itemBg}
            handleEdit={() => handleEditDiscussion(discussion)}
            handleDelete={() => handleDeleteDiscussion(discussion)}
          />
        </div>
      ) : null}

      {showModal?.type === UPDATE && (
        <AddEditDiscussion
          refresh={refresh}
          discussion={showModal?.data}
          onClose={closeDiscussionModal}
          open={showModal?.type === UPDATE}
        />
      )}

      {showModal?.type === DELETE && (
        <DeleteModal
          text="Discussion"
          refresh={refresh}
          data={showModal.data}
          title={showModal.data.topic}
          onClose={closeDiscussionModal}
          apiRoute={`api/forum/posts/${showModal.data.id}/`}
        />
      )}
    </div>
  );
}
