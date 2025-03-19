import React from "react";
import Sidebar from "../components/sidebar";
import NavBar from "../components/navBar";

const MainLayout = ({ children}) => {
  return (
    <div>
      <div className="flex h-full w-screen">
        {/* <div className="w-64 h-full overflow-y-auto bg-gray-800 text-white"> */}
          <Sidebar />
        {/* </div> */}
        <div className="flex w-full flex-col h-full ">
          <NavBar />
          <div className="bg-gray-100 p-4 ">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
