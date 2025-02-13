import React, { useState } from "react";
import { Dropdown, Space } from "antd";
import { FaRegMessage, FaAngleDown } from "react-icons/fa6";
import { IoMdNotificationsOutline, IoMdSearch, IoMdClose } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/reducerSlices/userSlice";

const NavBar = () => {  // ✅ Only one NavBar declaration
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { first_name, last_name, role } = useSelector((state) => state.user);

  const initialMessages = [
    { id: 1, name: "Alice Johnson", profilePic: "https://via.placeholder.com/40", snippet: "Hey, how are you?", color: "bg-blue-200" },
    { id: 2, name: "Bob Smith", profilePic: "https://via.placeholder.com/40", snippet: "Meeting tomorrow at 10 AM.", color: "bg-green-200" },
    { id: 3, name: "Carol White", profilePic: "https://via.placeholder.com/40", snippet: "Sent you the document.", color: "bg-yellow-200" },
  ];

  const moreMessages = [
    { id: 4, name: "David Brown", profilePic: "https://via.placeholder.com/40", snippet: "Can you check this out?", color: "bg-purple-200" },
    { id: 5, name: "Emily Davis", profilePic: "https://via.placeholder.com/40", snippet: "Lunch at 1 PM?", color: "bg-pink-200" },
    { id: 6, name: "Frank Miller", profilePic: "https://via.placeholder.com/40", snippet: "Thanks for your help!", color: "bg-red-200" },
  ];

  const [messages, setMessages] = useState(initialMessages);
  const [showAll, setShowAll] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleSeeAll = () => {
    if (!showAll) {
      setMessages([...messages, ...moreMessages]);
      setShowAll(true);
    }
  };

  const closeDropdown = () => {
    setVisible(false);
  };

  const handleChatClick = (message) => {
    navigate(`/chat/${message.id}`);
  };
  
  const logout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const messageDropdownContent = (
    <div className="w-80 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden">
      <div className="flex justify-between items-center p-3 bg-gradient-to-b from-purple-600 to-purple-500 text-white border-b border-gray-300">
        <span className="text-lg font-semibold">Messages</span>
        <IoMdClose
          className="text-gray-600 cursor-pointer hover:text-red-500 transition-all text-xl"
          onClick={closeDropdown}
        />
      </div>
  
      <div className="max-h-96 overflow-y-auto">
        {messages.map((message) => (
          <div
            key={message.id}
            onClick={() => handleChatClick(message)}
            className={`flex items-center gap-4 p-3 cursor-pointer transition-all hover:shadow-md ${message.color}`}
          >
            <img
              src={message.profilePic}
              alt={message.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-300 shadow-sm"
            />
            <div>
              <p className="font-semibold text-gray-900">{message.name}</p>
              <p className="text-sm text-gray-700 truncate">{message.snippet}</p>
            </div>
          </div>
        ))}
      </div>
  
      {!showAll && (
        <div className="text-center p-2 bg-gradient-to-b from-purple-100 to-purple-50 border-t border-gray-200">
          <button onClick={handleSeeAll} className="text-blue-600 font-semibold hover:underline transition-all">
            See All
          </button>
        </div>
      )}
    </div>
  );
  

  return (
    <div className="flex items-center justify-end shadow-md p-2  pl-6 pr-4 bg-gradient-to-b from-purple-800 to-purple-700 text-white ">


      <div className="flex gap-4 items-center">
        <span className="flex items-center justify-center relative">
          <input placeholder="Search..." className="border-none outline-none text-black p-0.5 pl-2 pr-8 rounded-md w-full md:block hidden" />
          <IoMdSearch className="text-white md:text-purple-800 text-lg absolute right-2" />
        </span>

        <Dropdown
          overlay={messageDropdownContent}
          trigger={["click"]}
          placement="bottomRight"
          open={visible}
          onOpenChange={(open) => setVisible(open)}
        >
          <span className="text-lg cursor-pointer">
            <FaRegMessage />
          </span>
        </Dropdown>

        <span className="text-lg">
          <IoMdNotificationsOutline />
        </span>

        <Dropdown
          menu={{
            items: [
              { label: <Link to="/profile">Profile</Link>, key: "0" },
              { label: <Link to="/setting">Setting</Link>, key: "1" },
              { type: "divider" },
              { label: <span onClick={logout}>Logout</span>, key: "3" },
            ],
          }}
          trigger={["click"]}
          className="hover:text-white hover:bg-purple-800 text-sm hover:font-semibold rounded-md"
        >
          <Space>
            <div className="flex p-1 items-center text-sm">
              <span className="mr-2 text-2xl">
                <CgProfile />
              </span>
              <div className="hidden md:flex md:flex-col">
                <span className="font-semibold">{first_name} {last_name}</span>
                <span className="text-xs">{role}</span>
              </div>
            </div>
            <FaAngleDown />
          </Space>
        </Dropdown>
      </div>
    </div>
  );
};

export default NavBar;
