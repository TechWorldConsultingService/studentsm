import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from "react-router-dom";

const SubjectSidebar = () => {
    const { subjects } = useSelector((state) => state.user);

    return (
        <div className="flex flex-col shadow-md bg-gray-200 w-[12%]">
            <Link to="/lms">
                <div className="mb-5 p-1 items-center justify-center flex flex-col">
                    <img src="/logo.jpeg" className="h-[38.5px] w-[100px]" />
                    <span className="text-sm text-purple-800">Satyam Xavier's</span>
                </div>
            </Link>

            {subjects.length > 0 && subjects.map((item) => {
                return (
                    <div key={item.subject_code}>
                        <Link
                            to={`/lms/${item.subject_name.toLowerCase()}`}
                            className="gap-2 flex items-center hover:text-white hover:bg-purple-800 text-sm hover:font-semibold rounded-md p-5"
                            tabIndex={0}
                        >
                            <span>{item.subject_name}</span>
                        </Link>
                    </div>
                )
            })}
        </div>
    );
}

export default SubjectSidebar;