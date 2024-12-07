import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi";
import { SiGoogleclassroom } from "react-icons/si";



const ClassSidebar = () => {
    const { classes } = useSelector((state) => state.user);

    return (
        <div className="flex flex-col bg-gradient-to-b from-purple-800 to-purple-600 w-[15%] min-h-screen p-5 shadow-lg">
            {/* Logo and Name */}
            <NavLink to="/tms" className="flex flex-col items-center justify-center mb-6 text-center">
                <img src="/logo.jpeg" className="h-16 w-32 mb-2" alt="Logo" />
                <span className="text-white">Satyam Xavier's</span>
            </NavLink>

            {/* Dashboard Link */}
            <NavLink
                to="/tms"
                className={({ isActive }) =>
                    `flex items-center text-white hover:text-purple-200 hover:bg-purple-700 rounded-md p-4 mb-2 ${isActive ? 'text-lg bg-purple-900' : ''}`
                }
                end
            >
                <HiOutlineHome className='text-lg' />
                <span className="ml-3 text-sm">Dashboard</span>
            </NavLink>

            {/* Dynamic Subject Links */}
            <div className="mb-2">
                {classes.length > 0 ? (
                    classes.map((item) => {
                        return (
                            <div key={item.class_code} className="group">
                                <NavLink
                                    to={`/tms/${item.class_name.toLowerCase()}`}
                                    className={({ isActive }) =>
                                        `flex items-center text-white hover:text-purple-200 hover:bg-purple-700 rounded-md p-4  ${isActive ? 'text-lg bg-purple-900' : ''}`
                                    }
                                >
                                    <SiGoogleclassroom className='text-lg' />

                                    <span className="ml-3 text-sm">{item.class_name}</span>
                                </NavLink>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center text-white mt-6">
                        <span>No class available</span>
                    </div>
                )}
            </div>

            {/* Footer Section */}
            <div className="mt-auto text-center text-white text-xs">
                <span>&copy; 2024 Satyam Xavier's. All rights reserved.</span>
            </div>
        </div>
    );
};

export default ClassSidebar;
