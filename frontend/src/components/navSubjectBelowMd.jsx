import React, { useState } from 'react';
import { IoReorderThree } from "react-icons/io5";
import SubjectSidebarMD from './subjectSidebarMD';

const NavBelowMdSubject = () => {
  const [toggleSubjectSidebar, setToggleSubjectSidebar] = useState(false);

  const handleToggleSubjectidebar = () => {
    setToggleSubjectSidebar(prevState => !prevState);
  };

  return (
    <div className="bg-white shadow-md space-x-3 mb-1 rounded-lg flex items-center text-3xl h-full font-semibold text-purple-900 md:hidden">
      {/* Toggle Button to Show Sidebar */}
      {!toggleSubjectSidebar && (
        <IoReorderThree onClick={handleToggleSubjectidebar} />
      )}

      {/* When Sidebar is toggled, show the SidebarMD */}
      {toggleSubjectSidebar && (
        <SubjectSidebarMD setToggleSubjectSidebar={setToggleSubjectSidebar} />
      )}
    </div>
  );
};

export default NavBelowMdSubject;
