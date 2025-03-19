import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  FaAngleDown,
  FaBars,
  FaAngleLeft,
  FaAngleRight,
  FaMoon,
  FaSun,
} from "react-icons/fa6";
import { useSelector } from "react-redux";

import sidebarData from "../constant/sidebardata.json";
import iconMapping from "../constant/iconMapping";

const Sidebar = () => {
  const { role } = useSelector(state => state.user);
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openSubMenuId, setOpenSubMenuId] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("darkMode") !== "false" // Default to Dark Mode
  );
  const [showColorModeText, setShowColorModeText] = useState(false);

  useEffect(() => {
    if (!isCollapsed) {
      setTimeout(() => {
        setShowColorModeText(true);
      }, 50);
    } else {
      setShowColorModeText(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    document.body.classList.toggle("dark", isDarkMode);
    localStorage.setItem("darkMode", isDarkMode);
  }, [isDarkMode]);

  const handleMobileToggle = () => setIsMobileOpen(prev => !prev);
  const handleCollapseToggle = () => setIsCollapsed(prev => !prev);
  const handleSubMenu = id =>
    setOpenSubMenuId(openSubMenuId === id ? null : id);
  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  useEffect(() => {
    if (!sidebarData[role]) return;
    sidebarData[role].forEach(item => {
      if (item.subSidebar) {
        const isAnySubActive = item.subSidebar.some(sub =>
          location.pathname.includes(sub.link)
        );
        if (isAnySubActive) {
          setOpenSubMenuId(item.id);
        }
      }
    });
  }, [role, location.pathname]);

  return (
    <div
      className={`${
        isCollapsed ? "w-16" : "w-64"
      } h-full overflow-y-auto bg-gray-800 text-white transition-all duration-300 ease-in-out`}
    >
      {/* Mobile Top bar */}
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
          fixed md:static top-0 left-0 z-50 min-h-screen border-r shadow-lg flex flex-col
          
          ${
            isDarkMode
              ? "bg-[#000040] text-white"
              : "bg-gradient-to-b from-purple-200 to-white text-black"
          }
          ${
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0
        `}
      >
        {/* Sidebar Header */}
        <div
          className={`flex items-center justify-between p-3 ${
            isCollapsed ? "justify-center" : ""
          }`}
        >
          <div className="flex items-center">
            <img
              src="/logo.jpeg"
              alt="Logo"
              className="h-[42px] w-[90px] object-contain"
            />
            {!isCollapsed && (
              <span className="ml-2 hidden md:block font-semibold">
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
          {sidebarData[role]?.map(item => {
            const Icon = iconMapping[item.icon];

            if (item.subSidebar) {
              return (
                <div key={item.id}>
                  <button
                    onClick={() => handleSubMenu(item.id)}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between
                      transition-colors rounded-md hover:bg-purple-300
                      ${isCollapsed ? "justify-center" : ""}
                      ${
                        isDarkMode
                          ? "text-white hover:bg-gray-700"
                          : "text-purple-900"
                      }
                    `}
                  >
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
                      {item.subSidebar.map(subItem => (
                        <NavLink
                          to={subItem.link}
                          key={subItem.id}
                          end
                          className={({ isActive }) => `
                            py-2 pl-4 my-1 rounded-r-md text-sm transition-colors
                            ${
                              isActive
                                ? "bg-purple-400 text-white font-semibold"
                                : "hover:bg-purple-200"
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
                    px-4 py-3 flex items-center gap-2 rounded-md transition-colors
                    ${
                      isActive
                        ? "bg-purple-400 text-white font-semibold"
                        : "hover:bg-purple-300"
                    }
                    ${
                      isDarkMode
                        ? "text-white hover:bg-gray-700"
                        : "text-purple-900"
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

        {/* Dark Mode Toggle */}
        <div className="p-4 mt-auto">
          <button
            onClick={toggleDarkMode}
            className={`w-full flex items-center justify-center rounded-lg transition-all duration-300
              transform scale-75 shadow-md font-semibold tracking-wide ${
                isDarkMode
                  ? "border border-gray-100 bg-gray-200s hover:bg-sidebarColor-100 text-gray-200"
                  : "border border-gray-500 hover:bg-gray-200 text-gray-900"
              } ${isCollapsed ? "py-1 border-0 shadow-none" : "p-2"}
            `}
          >
            {isDarkMode ? (
              <FaSun className="text-gray-200 text-2xl" />
            ) : (
              <FaMoon className="text-gray-900 text-2xl" />
            )}
            {showColorModeText ? (
              <span className="ml-2 text-lg">
                {isDarkMode ? "Light Mode" : "Dark Mode"}
              </span>
            ) : null}
          </button>
        </div>
      </div>

      {/* Overlay for mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 md:hidden"
          onClick={handleMobileToggle}
        />
      )}
    </div>
  );
};

export default Sidebar;
