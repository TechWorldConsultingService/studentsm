import React from "react";
import NavBar from "../components/navBar";
import ClassSidebar from "../components/classSidebar";

const ClassLayout = ({ children }) => {
  return (
    <div className="flex h-full w-screen flex-col md:flex-row">
      {/* Our new collapsible sidebar */}
      <ClassSidebar />

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <NavBar />
        <div className="bg-gray-100 p-4 flex-1 overflow-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ClassLayout;
