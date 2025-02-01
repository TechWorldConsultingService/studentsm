import React from "react";
import { FaRegMessage } from "react-icons/fa6";
import { IoMdNotificationsOutline,IoMdSearch  } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleDown } from "react-icons/fa6";
import { Dropdown, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { logoutUser } from "../redux/reducerSlices/userSlice";


const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { first_name, last_name, role } = useSelector((state) => state.user);

  const logout = () => {
    dispatch(logoutUser());
    navigate("/");
  };

  const dropdownItems = [
    {
      label: <Link to="/profile">Profile</Link>,
      key: "0",
    },
    {
      label: <Link to="/setting">Setting</Link>,
      key: "1",
    },
    {
      type: "divider",
    },
    {
      label: <span onClick={logout}>Logout</span>,
      key: "3",
    },
  ];

  return (
    <div className="flex items-center justify-end shadow-md p-2  pl-6 pr-4 bg-gradient-to-b from-purple-800 to-purple-700 text-white ">


      <div className="flex gap-4  items-center">

      <span className="flex items-center justify-center relative">
  <input
    placeholder="Search..."
    className="border-none outline-none text-black p-0.5 pl-2 pr-8 rounded-md w-full md:block hidden"
  />
  <IoMdSearch className="text-white md:text-purple-800 text-lg  absolute right-2" />
</span>
        <span className="text-lg">
          <FaRegMessage />
        </span>

        <span className="text-lg">
          <IoMdNotificationsOutline />
        </span>

        <Dropdown
          menu={{ items: dropdownItems }}
          trigger={["click"]}
          className="hover:text-white hover:bg-purple-800 text-sm hover:font-semibold rounded-md"
        >
          <Space>
            <div className="flex p-1 items-center text-sm ">
              <span className="mr-2 text-2xl">
                <CgProfile />
              </span>
              <div className="hidden md:flex md:flex-col">
                <span className="font-semibold ">{first_name} {last_name}</span>
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
