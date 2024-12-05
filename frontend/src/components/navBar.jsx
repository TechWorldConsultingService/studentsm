import React from "react";
import { FaRegMessage } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
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
    <div className="flex items-center justify-between shadow-md p-2 pl-4 pr-6 bg-purple-900 text-white rounded-sm">
      <div className="flex gap-4 items-center">
        <h4 className="font-semibold text-sm sm:text-lg">Dashboard</h4>
      </div>

      <div className="flex gap-4 text-xl items-center">
        <span>
          <FaRegMessage />
        </span>
        <span>
          <IoMdNotificationsOutline />
        </span>

        <Dropdown
          menu={{ items: dropdownItems }}
          trigger={["click"]}
          className="hover:text-white hover:bg-purple-800 text-sm hover:font-semibold rounded-md"
        >
          <Space>
            <div className="flex p-1 items-center text-sm">
              <span className="m-2 text-lg">
                <CgProfile />
              </span>
              <div className="flex flex-col">
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
