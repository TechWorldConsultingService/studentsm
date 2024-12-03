import React from "react";
import MainLayout from "../layout/MainLayout";


const StudentHomePage = () => {
  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center w-full">
        <h1>StudentHomePage studentdashboard</h1>

        <div className="w-full flex">

        <a href='/lms' target='_blank' rel='noopener noreferrer'>
          <div className="flex flex-col items-center justify-center gap-2 bg-purple-200 text-purple-800  w-[20%] p-5  rounded-md shadow-lg">
            <img src="/books.webp" alt='Subjects' className='h-[55%] w-[55%]' />
            <p className='text-sm'>Start your study  here</p>
          <h3 className='font-semibold text-lg'>Subjects</h3>
          </div>
          </a>


        </div>
      </div>
    </MainLayout>
  );
};

export default StudentHomePage;
