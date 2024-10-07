import React from "react";
import { FaRegMessage } from "react-icons/fa6";
import { IoMdNotificationsOutline } from "react-icons/io";
import { CgProfile } from "react-icons/cg";




const NavBar = () => {
  return (
    <div className="flex items-center justify-between shadow-md p-1  pl-7 pr-8 bg-purple-900 text-white rounded-sm">

      <div className="flex gap-7 items-center">
    <h4 className="font-semibold">Dashboard</h4>
    </div>

      <div className="flex gap-6 text-xl items-center">
<span><FaRegMessage /></span>
<span><IoMdNotificationsOutline /></span>
<div className="flex p-1 items-center text-sm">
<span className="m-2 text-2xl">  <CgProfile  /></span>
<div className="flex flex-col">
<span className="font-semibold">Aakash Singh</span>
<span >Admin</span>
</div>

</div>

  
      </div>

    </div>
  );
};

export default NavBar;
