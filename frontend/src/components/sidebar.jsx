import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa6";
import { useSelector } from "react-redux";

import sidebarData from "../constant/sidebardata.json";
import iconMapping from "../constant/iconMapping";

const Sidebar = () => {
  const [openSubMenuId, setOpenSubMenuId] = useState(null);
  const { role } = useSelector((state) => state.user);



  const handleSubMenu = (id) => {
    setOpenSubMenuId(openSubMenuId === id ? null : id);
  };

  return (
    <div className="flex flex-col shadow-md bg-gray-200 w-[12%]">
      <Link to="/studentdashboard">
        <div className="mb-5 p-1 items-center justify-center flex flex-col">
          <img src="/logo.jpeg" className="h-[38.5px] w-[100px] " />
          <span className="text-sm text-purple-800">Satyam Xavier's</span>
        </div>
      </Link>

      {sidebarData[role] &&
        sidebarData[role].map((items) => {
          if (items.subSidebar) {
            return (
              <div key={items.id}>
                <div
                  onClick={() => handleSubMenu(items.id)}
                  className=" flex items-center justify-between hover:text-white hover:bg-purple-800 text-sm hover:font-semibold rounded-md p-5  "
                >
                  <div className="flex gap-2">
                    <span className="text-3xl ">
                      {React.createElement(iconMapping[items.icon])}
                    </span>
                    <span>{items.title}</span>
                  </div>
                  <span>
                    <FaAngleDown
                      className={`transform ${
                        openSubMenuId === items.id ? "rotate-180" : ""
                      }`}
                    />
                  </span>
                </div>
                {openSubMenuId === items.id && (
                  <div className="flex flex-col pl-5">
                    {items.subSidebar.map((subItem) => (
                      <Link
                        to={subItem.link}
                        key={subItem.id}
                        className="p-3 hover:bg-purple-800 rounded-md hover:text-white transition duration-300 "
                      >
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          } else {
            return (
              <Link
                to={items.link}
                key={items.id}
                className={`gap-2 flex items-center  hover:text-white hover:bg-purple-800 text-sm hover:font-semibold rounded-md p-5`}
                tabIndex={0}
              >
                <span className="text-3xl ">
                  {React.createElement(iconMapping[items.icon])}
                </span>
                <span>{items.title}</span>
              </Link>
            );
          }
        })}
    </div>
  );
};

export default Sidebar;
