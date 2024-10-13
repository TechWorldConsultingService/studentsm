import React from "react";
import { FaRegMessage } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";
import { useDispatch, useSelector } from "react-redux";





import { FaAngleDown } from "react-icons/fa6";
import { Dropdown, Space } from 'antd';
import { Link, Navigate } from "react-router-dom";

const dropdownItems = [
  {
      label: <Link to="/profile">Profile</Link>,
      key: '0',
  },
  {
      label: <Link to="/setting">Setting</Link>,
      key: '1',
  },
  {
      type: 'divider',
  },
  {
      label:'Logout',
      key: '3',
  },
];



const NavBar = () => {
  // const dispatch = useDispatch();


// const logout =()=>{
//   dispatch(logoutUser())
//   Navigate("/");

// }

  const {username,role} = useSelector(state=>state.user)

  return (
    <div className="flex items-center justify-between shadow-md p-1  pl-7 pr-8 bg-purple-900 text-white rounded-sm">

      <div className="flex gap-7 items-center">
    <h4 className="font-semibold">Dashboard</h4>
    </div>

      <div className="flex gap-6 text-xl items-center">
<span><FaRegMessage /></span>
<span><IoMdNotificationsOutline /></span>


<Dropdown
                    menu={{ items: dropdownItems }}
                    trigger={['click']}
                >
                    <Space>
                        <div className="flex p-1 items-center text-sm">
                            <span className="m-2 text-2xl"><CgProfile /></span>
                            <div className="flex flex-col">
                                <span className="font-semibold">{username}</span>
                                <span>{role}</span>
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
