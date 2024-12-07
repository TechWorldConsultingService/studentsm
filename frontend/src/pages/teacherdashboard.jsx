import React from "react";
import MainLayout from "../layout/MainLayout";


const TeacherHomePage = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center w-full">
        <h1>Welcome to TeacherHomePage</h1>

        <div className="w-full flex">

        <a href='/tms' target='_blank' rel='noopener noreferrer'>
          <div className="flex flex-col items-center justify-center gap-2 bg-purple-200 text-purple-800  w-[20%] p-5  rounded-md shadow-lg">
            <img src="/books.webp" alt='Subjects' className='h-[55%] w-[55%]' />
            <p className='text-sm'>Start teaching form here</p>
          <h3 className='font-semibold text-lg'>Classes</h3>
          </div>
          </a>


        </div>
      </div>
    </MainLayout>
  );
};

export default TeacherHomePage;
