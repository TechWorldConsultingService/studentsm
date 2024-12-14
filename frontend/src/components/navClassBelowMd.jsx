import React, { useState } from 'react';
import { IoReorderThree } from "react-icons/io5";
import ClassSidebarMD from './classSidebarMd.jsx';

const NavBelowMd = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);

  const handleToggleSidebar = () => {
    setToggleSidebar(prevState => !prevState); 
  };

  return (
    <div className="bg-white shadow-md  space-x-3 mb-1 rounded-lg flex items-center text-3xl h-full font-semibold text-purple-900 md:hidden">
   
    {!toggleSidebar && (
       <IoReorderThree onClick={handleToggleSidebar} />
    )}  
    
      {toggleSidebar && (
         <ClassSidebarMD setToggleSidebar={setToggleSidebar} />
        )}
    </div>
  );
};

export default NavBelowMd;
