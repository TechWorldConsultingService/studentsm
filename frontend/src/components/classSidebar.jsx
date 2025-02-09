import React,{useState} from 'react';
import { useSelector,useDispatch } from 'react-redux';
import { NavLink } from "react-router-dom";
import { HiOutlineHome } from "react-icons/hi";
import { SiGoogleclassroom } from "react-icons/si";
import { setSelectedClass, setSelectedClassId } from "../redux/reducerSlices/userSlice"; // Import the new action

const ClassSidebar = () => {
    const { classes } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleClassClick = (item) => {
        if (!item) 
        return;

        dispatch(setSelectedClass({className: item.class_name})); 
        dispatch(setSelectedClassId({classId: item.id}))
    };

    return (
        <div className="flex flex-col bg-gradient-to-b from-purple-700 to-purple-500  min-h-screen p-3 shadow-lg">
            {/* Logo and Name */}
            <NavLink to="/tms" className="flex flex-col items-center justify-center mb-6 text-center">
                <img src="/logo.jpeg" className="h-8 w-16 mb-2 md:h-16 md:w-32" alt="Logo" />
                <span className="text-white">Satyam Xavier's</span>
            </NavLink>

            {/* Dashboard Link */}
            <NavLink
                to="/tms"
                className={({ isActive }) =>
                    `flex items-center text-white hover:text-purple-200 hover:bg-purple-800 rounded-md p-3 mb-2 ${isActive ? 'text-lg bg-purple-950' : ''}`
                }
                end
            >
                <HiOutlineHome className='text-lg' />
                <span className="ml-3 text-sm">Dashboard</span>
            </NavLink>

            {/* Dynamic Class Links */}
            <div className="mb-2">
                {classes.length > 0 ? (
                    classes.map((item) => {
                        return (
                            <div key={item.class_code} >
                                <NavLink
                                    to={`/tms/${item.class_name.toLowerCase()}`}
                                    onClick={() => handleClassClick(item)}
                                    className={({ isActive }) =>
                                        `flex items-center text-white hover:text-purple-200  hover:bg-purple-800 rounded-md p-3  ${isActive ? 'text-lg bg-purple-950' : ''}`
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
