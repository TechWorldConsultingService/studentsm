import React from "react";
import { IoMdNotificationsOutline, IoMdSearch } from "react-icons/io";
import { Dropdown, Space } from "antd";
import { FaRegMessage, FaAngleDown } from "react-icons/fa6";
import { CgProfile } from "react-icons/cg";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/reducerSlices/userSlice";

const NavBar = () => {
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

  const dropdownItems = [
    {
      label: <Link to="/profile">Profile</Link>,
      key: "profile",
    },
    {
      label: <Link to="/schoolSetting">Setting</Link>,
      key: "settings",
    },
    {
      type: "divider",
    },
    {
      label: <span onClick={logout}>Logout</span>,
      key: "logout",
    },
  ];

  return (
    <div className="w-full shadow-md bg-gradient-to-b from-purple-800 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-end">
       

        {/* Right-side: Search, Icons, Profile */}
        <div className="flex items-center gap-4">


          {/* Messages Icon */}
          <button
            type="button"
            className="relative text-xl hover:text-purple-200 transition-colors"
          >
            <FaRegMessage />
            {/* Optional: A small badge or indicator can go here */}
            {/* <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full px-1">
              5
            </span> */}
          </button>

          {/* Notifications Icon */}
          <button
            type="button"
            className="relative text-xl hover:text-purple-200 transition-colors"
          >
            <IoMdNotificationsOutline />
            {/* Optional: A small badge or indicator can go here */}
            {/* <span className="absolute top-0 right-0 text-xs bg-red-500 text-white rounded-full px-1">
              2
            </span> */}
          </button>

          {/* Profile Dropdown */}
          <Dropdown menu={{ items: dropdownItems }} trigger={["click"]}>
            <Space className="cursor-pointer hover:text-purple-200">
              <div className="flex items-center">
                {/* Profile Icon */}
                <CgProfile className="text-2xl mr-2" />
                <div className="text-left leading-tight hidden md:block">
                  <div className="font-semibold">
                    {first_name} {last_name}
                  </div>
                  <div className="text-xs capitalize">{role}</div>
                </div>
              </div>
              <FaAngleDown />
            </Space>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
