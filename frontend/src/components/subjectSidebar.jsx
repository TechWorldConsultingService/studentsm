import React, { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaBars,
  FaAngleLeft,
  FaAngleRight,
  FaAngleDown,
  FaHouse,
  FaBookOpen,
} from "react-icons/fa6";
import { useSelector } from "react-redux";

const buildSubjectSubSidebar = (subject) => [
  {
    id: `${subject.id}-homework`,
    title: "Homework",
    link: `/lms/${subject.subject_name.toLowerCase()}/homework`,
  },
  {
    id: `${subject.id}-notes`,
    title: "Notes",
    link: `/lms/${subject.subject_name.toLowerCase()}/notes`,
  },
  {
    id: `${subject.id}-syllabus`,
    title: "Syllabus",
    link: `/lms/${subject.subject_name.toLowerCase()}/syllabus`,
  },
];

const SubjectSidebar = () => {
  const location = useLocation();
  const { subjects = [] } = useSelector((state) => state.user);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubMenuId, setOpenSubMenuId] = useState(null);
  const sidebarItems = [
    {
      id: "dashboard",
      icon: FaHouse,
      title: "Dashboard",
      link: "/lms",
    },
    ...subjects.map((subject) => ({
      id: `subject-${subject.id}`,
      icon: FaBookOpen,
      title: subject.subject_name,
      subSidebar: buildSubjectSubSidebar(subject),
    })),
  ];

  const handleMobileToggle = () => {
    setIsMobileOpen((prev) => !prev);
  };

  const handleCollapseToggle = () => {
    setIsCollapsed((prev) => !prev);
  };

  const handleSubMenu = (id) => {
    setOpenSubMenuId(openSubMenuId === id ? null : id);
  };


  useEffect(() => {
    sidebarItems.forEach((item) => {
      if (item.subSidebar) {
        const isActive = item.subSidebar.some((sub) =>
          location.pathname.includes(sub.link)
        );
        if (isActive) {
          setOpenSubMenuId(item.id);
        }
      }
    });
  }, [location.pathname]);

  return (
    <>
      <div className="md:hidden flex items-center justify-between bg-purple-800 text-white px-3 py-2">
        <button
          onClick={handleMobileToggle}
          className="text-xl hover:text-purple-200 transition-colors"
        >
          <FaBars />
        </button>
        <div className="text-base font-bold">Menu</div>
      </div>

      {/* Sidebar Container */}
      <div
        className={`
          fixed md:static top-0 left-0 z-50
          h-screen
          border-r border-purple-200 shadow-lg
          flex flex-col
          bg-gradient-to-b from-purple-200 to-white
          backdrop-blur-sm
          transition-all duration-300 ease-in-out
          ${
            isCollapsed
              ? "w-14"
              : "w-52"
          }
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div
          className={`flex items-center justify-between p-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          {/* Logo Area */}
          <div className="flex items-center">
            <img
              src="/logo.jpeg"
              alt="Logo"
              className="h-[42px] w-[90px] object-contain"
            />
            {!isCollapsed && (
              <span className="ml-2 hidden md:block font-semibold text-purple-900">
                Satyam Xavier's
              </span>
            )}
          </div>

          {/* Desktop Collapse Button */}
          <button
            onClick={handleCollapseToggle}
            className="hidden md:block text-purple-700 hover:text-purple-900"
          >
            {isCollapsed ? (
              <FaAngleRight className="text-xl" />
            ) : (
              <FaAngleLeft className="text-xl" />
            )}
          </button>
        </div>

        {/* Sidebar Items */}
        <div className="flex-1 overflow-y-auto">
          {sidebarItems.map((item) => {
            const Icon = item.icon || FaBookOpen;

            if (item.subSidebar) {
              return (
                <div key={item.id}>
                  {/* Parent Button */}
                  <button
                    onClick={() => handleSubMenu(item.id)}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between
                      text-purple-900
                      transition-colors rounded-md
                      hover:bg-purple-300 hover:text-purple-900
                      ${isCollapsed ? "justify-center" : ""}
                    `}
                  >
                    {/* Icon + Title */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`${
                          isCollapsed ? "text-3xl" : "text-2xl"
                        } transition-all duration-300`}
                      >
                        <Icon />
                      </span>
                      {!isCollapsed && (
                        <span className="font-medium text-sm tracking-wide">
                          {item.title}
                        </span>
                      )}
                    </div>
                    {!isCollapsed && (
                      <FaAngleDown
                        className={`ml-2 transform transition-transform ${
                          openSubMenuId === item.id ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </button>

                  {/* Sub-Menu */}
                  {!isCollapsed && openSubMenuId === item.id && (
                    <div className="flex flex-col ml-6 border-l border-purple-300">
                      {item.subSidebar.map((subItem) => (
                        <NavLink
                          to={subItem.link}
                          key={subItem.id}
                          end
                          className={({ isActive }) => `
                            py-2 pl-4 my-1 rounded-r-md text-sm transition-colors
                            ${
                              isActive
                                ? "bg-purple-400 text-white font-semibold"
                                : "text-purple-900 hover:bg-purple-200"
                            }
                          `}
                        >
                          {subItem.title}
                        </NavLink>
                      ))}
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                to={item.link}
                key={item.id}
                end
                className={({ isActive }) => `
                  px-4 py-3 flex items-center gap-2 rounded-md
                  transition-colors
                  ${
                    isActive
                      ? "bg-purple-400 text-white font-semibold"
                      : "text-purple-900 hover:bg-purple-300"
                  }
                  ${isCollapsed ? "justify-center" : ""}
                `}
              >
                <span
                  className={`${
                    isCollapsed ? "text-3xl" : "text-2xl"
                  } transition-all duration-300`}
                >
                  <Icon />
                </span>
                {!isCollapsed && (
                  <span className="font-medium text-sm tracking-wide">
                    {item.title}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden"
          onClick={handleMobileToggle}
        />
      )}
    </>
  );
};

export default SubjectSidebar;
