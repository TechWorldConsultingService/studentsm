import React, { useState } from "react";
import NavBar from "../components/navBar";
import ClassSidebar from "../components/classSidebar";
import NavBelowMd from "../components/navClassBelowMd";


const ClassLayout = ({ children }) => {
  return (
    <div className="flex h-full w-screen flex-col md:flex-row ">
      <div className="w-52 hidden md:block"> <ClassSidebar  /> </div>

      <div className=" flex w-full flex-col ">
        <NavBar />
        <NavBelowMd />
        <div className="bg-gray-100 p-4 flex-1">{children}</div>
      </div>
    </div>
  );
};

export default ClassLayout;
