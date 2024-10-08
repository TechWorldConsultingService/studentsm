import React from "react";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { IoCalendarOutline,IoBusOutline  } from "react-icons/io5";
import { PiStudent } from "react-icons/pi";
import { TbReportSearch } from "react-icons/tb";
import { IoIosGitPullRequest } from "react-icons/io";
import { MdCoPresent } from "react-icons/md";
import { LuFileSpreadsheet } from "react-icons/lu";
import { Link } from "react-router-dom";






const sidebarData = [
    {"id":1,"title":"Dashboard","icon":<MdOutlineSpaceDashboard />,"link":"/"}, 
    {"id":2,"title":"Calendar","icon":<IoCalendarOutline />,"link":"/calendar"},
     {"id":3,"title":"Class","icon":<PiStudent />,"link":"/class"}, 
     {"id":4,"title":"Reports","icon":<TbReportSearch />,"link":"/reports"}, 
     {"id":5,"title":"Request","icon":<IoIosGitPullRequest />,"link":"/request"},
     {"id":6,"title":"My Bus","icon":<IoBusOutline />,"link":"/mybus"},
     {"id":7,"title":"Leave","icon":<MdCoPresent />,"link":"/leave"},
     {"id":8,"title":"Attendence","icon":<LuFileSpreadsheet />,"link":"/attendence"}
];




const Sidebar = () => {
  return (
    <div className="flex flex-col shadow-md  bg-gray-200 w-[13%] ">
        <Link to='/'>
      <div className="mb-5 p-1 items-center justify-center flex flex-col">
        <img src="/logo.jpeg" className="h-[38.5px] w-[100px] " />
        <span className="text-sm text-purple-800">Satyam Xavier's</span>
      </div>
      </Link>

      {sidebarData &&
        sidebarData.length > 0 &&
        sidebarData.map((items) => {
          return (
            <Link to={items.link} key={items.id}>
            <div key={items.id} className="gap-2 flex items-center hover:text-white hover:bg-purple-800 text-sm hover:font-semibold rounded-md p-5 ">
                <span className="text-3xl ">{items.icon}</span>
             <span>{items.title}</span> 
             
            </div>
            </Link>
          );
        })}
    </div>
  );
};

export default Sidebar;
