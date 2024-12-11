import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi";
import { SiGoogleclassroom } from "react-icons/si";
import { RxCross2 } from "react-icons/rx";


const ClassSidebarMD = ({setToggleSidebar}) => {
  const { classes } = useSelector((state) => state.user);

  return (
    <div className="flex flex-col bg-gradient-to-b from-purple-700 to-purple-500 min-h-screen p-3 shadow-lg w-52 fixed top-0 left-0 z-50 md:hidden">
      <div className="flex justify-end text-white text-2xl font-bold p-1 ">
      <RxCross2 onClick={() => setToggleSidebar((prevState) => !prevState)} />
      </div>

      <NavLink
        to="/tms"
        className={({ isActive }) =>
          `flex items-center text-white hover:text-purple-200 hover:bg-purple-800 rounded-md p-3 mb-2 ${
            isActive ? "text-lg bg-purple-950" : ""
          }`
        }
        end
      >
        <HiOutlineHome className="text-lg" />
        <span className="ml-3 text-sm">Dashboard</span>
      </NavLink>

      <div className="mb-2">
        {classes.length > 0 ? (
          classes.map((item) => {
            return (
              <div key={item.class_code}>
                <NavLink
                  to={`/tms/${item.class_name.toLowerCase()}`}
                  className={({ isActive }) =>
                    `flex items-center text-white hover:text-purple-200  hover:bg-purple-800 rounded-md p-3  ${
                      isActive ? "text-lg bg-purple-950" : ""
                    }`
                  }
                >
                  <SiGoogleclassroom className="text-lg" />

                  <span className="ml-3 text-sm">{item.class_name}</span>
                </NavLink>
              </div>
            );
          })
        ) : (
          <div className="text-center text-white mt-6">
            <span>No class available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassSidebarMD;
