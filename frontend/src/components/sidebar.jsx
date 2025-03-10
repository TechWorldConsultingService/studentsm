import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaAngleDown,
  FaBars,
  FaAngleLeft,
  FaAngleRight,
} from "react-icons/fa6";
import { useSelector } from "react-redux";

import sidebarData from "../constant/sidebardata.json";
import iconMapping from "../constant/iconMapping";

const Sidebar = () => {
  const { role } = useSelector((state) => state.user);
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubMenuId, setOpenSubMenuId] = useState(null);


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
    if (!sidebarData[role]) return;

    sidebarData[role].forEach((item) => {
      if (item.subSidebar) {
        const isAnySubActive = item.subSidebar.some((sub) =>
          location.pathname.includes(sub.link)
        );
        if (isAnySubActive) {
          setOpenSubMenuId(item.id);
        }
      }
    });
  }, [role, location.pathname]);

  return (
    <>
      {/* Mobile Top bar (only on small screens) */}
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
              ? "w-16"
              : "w-64" 
          }
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Sidebar Header (Logo & Name) */}
        <div
          className={`flex items-center justify-between p-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          {/* Logo */}
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
          {sidebarData[role]?.map((item) => {
            const Icon = iconMapping[item.icon];

            if (item.subSidebar) {
              return (
                <div key={item.id}>
                  {/* Parent Button */}
                  <button
                    onClick={() => handleSubMenu(item.id)}
                    className={`
                      w-full text-left px-4 py-3 flex items-center justify-between
                      text-purple-900
                      transition-colors rounded-md
                      hover:bg-purple-300 hover:text-purple-900
                      ${
                        isCollapsed ? "justify-center" : ""
                      }
                    `}
                  >
                    {/* Icon + Title */}
                    <div className="flex items-center gap-2">
                      <span
                        className={`${
                          isCollapsed ? "text-3xl" : "text-2xl"
                        } transition-all duration-300`}
                      >
                        {React.createElement(Icon)}
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
                          className={({
                            isActive,
                          }) => `
                            py-2 pl-4 my-1 rounded-r-md
                            text-sm transition-colors
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
            } else {
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
                    {React.createElement(Icon)}
                  </span>
                  {/* Show text only if not collapsed */}
                  {!isCollapsed && (
                    <span className="font-medium text-sm tracking-wide">
                      {item.title}
                    </span>
                  )}
                </NavLink>
              );
            }
          })}
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden"
          onClick={handleMobileToggle}
        />
      )}
    </>
  );
};

export default Sidebar;
