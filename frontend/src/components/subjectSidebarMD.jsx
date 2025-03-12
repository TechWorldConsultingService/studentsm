import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi";
import { IoBookOutline } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";

const SubjectSidebarMD = ({ setToggleSubjectSidebar }) => {
  const { subjects } = useSelector((state) => state.user);

  return (
    <div className="flex flex-col bg-gradient-to-b from-purple-700 to-purple-500 min-h-screen p-3 shadow-lg w-52 fixed top-0 left-0 z-50 md:hidden">
      <div className="flex justify-end text-white text-2xl font-bold p-1 ">
        <RxCross2
          onClick={() => setToggleSubjectSidebar((prevState) => !prevState)}
        />
      </div>

      <NavLink
        to="/lms"
        className={({ isActive }) =>
          `flex items-center text-white hover:text-purple-200 hover:bg-purple-700 rounded-md p-4 mb-2 ${
            isActive ? "text-lg bg-purple-900" : ""
          }`
        }
        end
      >
        <HiOutlineHome className="text-lg" />
        <span className="ml-3 text-sm">Dashboard</span>
      </NavLink>

      <div className="mb-2">
        {subjects.length > 0 ? (
          subjects.map((item) => (
            <div key={item.subject_code}>
              <NavLink
                to={`/lms/${item.subject_name.toLowerCase()}`}
                className={({ isActive }) =>
                  `flex items-center text-white hover:text-purple-200 hover:bg-purple-700 rounded-md p-4 ${
                    isActive ? "text-lg bg-purple-900" : ""
                  }`
                }
              >
                <IoBookOutline className="text-lg" />
                <span className="ml-3 text-sm">{item.subject_name}</span>
              </NavLink>
            </div>
          ))
        ) : (
          <div className="text-center text-white mt-6">
            <span>No subjects available</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubjectSidebarMD;
