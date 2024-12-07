import React from 'react'
import NavBar from '../components/navBar'
import SubjectSidebar from '../components/subjectSidebar'


const SubjectLayout = ({children}) => {
  return (
    
      <div className="flex h-full w-screen ">
      <SubjectSidebar />
      <div className=" flex w-full flex-col">
        <NavBar />
        <div className='bg-gray-100 p-4'>{children}</div>
      </div>
    </div>
      
  )
}

export default SubjectLayout