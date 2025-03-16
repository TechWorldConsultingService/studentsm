import React from "react";
import Sidebar from "../components/sidebar";
import NavBar from "../components/navBar";

const MainLayout = ({ children, childrenClass = "" }) => {
  return (
    <div>
      <div className="flex h-screen w-screen">
        <div className="w-64 h-full overflow-y-auto bg-gray-800 text-white">
          <Sidebar />
        </div>
        <div className="flex w-full flex-col h-full flex-1">
          <NavBar />
          <div className="bg-gray-100 p-4 flex-1 overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
