import { Dropdown } from "antd";
import { FiEdit2 } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";

export default function CustomDropdown({
  handleEdit,
  handleDelete,
  itemBg = false,
} = {}) {
  return (
    <Dropdown.Button
      align="left"
      className={`sms-custom-dropdown ${
        itemBg ? "bg-gray-200 rounded-xl flex items-center !h-[20px]" : ""
      }`}
      trigger={"click"}
      type="link"
      menu={{
        items: [
          {
            label: (
              <div onClick={handleEdit} className="flex items-center gap-2">
                <FiEdit2 size={16} />
                <p>Edit</p>
              </div>
            ),
            key: "1",
          },
          {
            label: (
              <div onClick={handleDelete} className="flex items-center gap-2">
                <AiOutlineDelete size={16} /> <p>Delete</p>
              </div>
            ),
            key: "2",
          },
        ],
      }}
    ></Dropdown.Button>
  );
}
