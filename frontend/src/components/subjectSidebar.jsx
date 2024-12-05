import React from 'react';
import { useSelector } from 'react-redux';
import { NavLink } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi"; // Icon for Dashboard

const SubjectSidebar = () => {
    const { subjects } = useSelector((state) => state.user);

    return (
        <div className="flex flex-col bg-gradient-to-b from-purple-800 to-purple-600 w-[12%] min-h-screen p-5 shadow-lg sm:w-[20%] md:w-[15%] lg:w-[12%]">
            {/* Logo and Name */}
            <NavLink to="/lms" className="flex flex-col items-center justify-center mb-6 text-center">
                <img src="/logo.jpeg" className="h-16 w-32 mb-2" alt="Logo" />
                <span className="text-lg text-white font-semibold">Satyam Xavier's</span>
            </NavLink>

            {/* Dashboard Link */}
            <NavLink
                to="/lms"
                className="flex items-center text-white hover:text-purple-200 hover:bg-purple-700 rounded-md p-4 mb-4 transition duration-200 ease-in-out"
                activeClassName="bg-purple-800" // Active background color for Dashboard
            >
                <HiOutlineHome className="text-xl" />
                <span className="ml-3 text-sm">Dashboard</span>
            </NavLink>

            {/* Dynamic Subject Links */}
            <div className="space-y-4">
                {subjects.length > 0 ? (
                    subjects.map((item) => {
                        return (
                            <div key={item.subject_code} className="group">
                                <NavLink
                                    to={`/lms/${item.subject_name.toLowerCase()}`}
                                    className="flex items-center text-white hover:text-purple-200 hover:bg-purple-700 rounded-md p-4 transition duration-200 ease-in-out"
                                    activeClassName="bg-purple-800" // Active background color for selected subject
                                >
                                    <span className="ml-3 text-sm">{item.subject_name}</span>
                                </NavLink>
                            </div>
                        );
                    })
                ) : (
                    <div className="text-center text-white mt-6">
                        <span>No subjects available</span>
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

export default SubjectSidebar;
