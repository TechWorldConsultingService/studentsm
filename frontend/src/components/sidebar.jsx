import React, { useState } from "react";
import { MdOutlineSpaceDashboard, MdCoPresent } from "react-icons/md";
import { IoCalendarOutline, IoBusOutline } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";
import { TbReportSearch } from "react-icons/tb";
import { IoIosGitPullRequest } from "react-icons/io";
import { LuFileSpreadsheet } from "react-icons/lu";
import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa6";

const sidebarData = [
  {
    id: 1,
    title: "Dashboard",
    icon: <MdOutlineSpaceDashboard />,
    link: "/studentdashboard",
  },
  { id: 2, title: "Calendar", icon: <IoCalendarOutline />, link: "/calendar" },

  {
    id: 3,
    title: "Class",
    icon: <PiStudent />,
    subSidebar: [
      { id: 1, title: "Math", link: "/math" },
      { id: 2, title: "Computer", link: "/computer" },
      { id: 3, title: "Science", link: "/science" },
    ],
  },

  { id: 4, title: "Reports", icon: <TbReportSearch />, link: "/reports" },

  {
    id: 5,
    title: "Request",
    icon: <IoIosGitPullRequest />,
    subSidebar: [
      { id: 1, title: "All Request", link: "/allrequest" },
      { id: 2, title: "My request", link: "/myrequest" },
    ],
  },

  { id: 6, title: "My Bus", icon: <IoBusOutline />, link: "/mybus" },
  { id: 7, title: "Leave", icon: <MdCoPresent />, link: "/leave" },
  {
    id: 8,
    title: "Attendence",
    icon: <LuFileSpreadsheet />,
    link: "/attendence",
  },
];

const Sidebar = () => {
  const [openSubMenuId, setOpenSubMenuId] = useState(null);

  const handleSubMenu = (id) => {
    setOpenSubMenuId(openSubMenuId === id ? null : id);
    console.log(openSubMenuId);
  };

  return (
    <div className="flex flex-col shadow-md  bg-gray-200 w-[12%] ">
      <Link to="/studentdashboard">
        <div className="mb-5 p-1 items-center justify-center flex flex-col">
          <img src="/logo.jpeg" className="h-[38.5px] w-[100px] " />
          <span className="text-sm text-purple-800">Satyam Xavier's</span>
        </div>
      </Link>

      {sidebarData.map((items) => {
        if (items.subSidebar) {
          return (
            <div key={items.id}>
              <div
                onClick={() => handleSubMenu(items.id)}
                className=" flex items-center justify-between hover:text-white hover:bg-purple-800 text-sm hover:font-semibold rounded-md p-5 "
              >
                <div className="flex gap-2">
                  <span className="text-3xl ">{items.icon}</span>
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
                      className="p-3 hover:bg-purple-800 rounded-md hover:text-white"
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
              className="gap-2 flex items-center  hover:text-white hover:bg-purple-800 text-sm hover:font-semibold rounded-md p-5 "
            >
              <span className="text-3xl ">{items.icon}</span>
              <span>{items.title}</span>
            </Link>
          );
        }
      })}

      {/* <div className="flex flex-col rounded-md ">
                  {items.subSidebar &&
                    items.subSidebar.length > 0 &&
                    items.subSidebar.map((sub) => {
                      return (
                      <span className="flex flex-col ml-2 p-3 border  hover:bg-purple-800 shadow-md bg-gray-200">{sub.title}</span>
                    )
                    })}
                </div> */}
    </div>
  );
};

export default Sidebar;
