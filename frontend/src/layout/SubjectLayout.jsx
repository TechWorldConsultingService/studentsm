import React from 'react'
import NavBar from '../components/navBar'
import SubjectSidebar from '../components/subjectSidebar'
import NavBelowMdSubject from '../components/navSubjectBelowMd'


const SubjectLayout = ({children}) => {
  return (
    
      <div className="flex h-full w-screen flex-col md:flex-row ">
     <div className='w-52 hidden md:block'><SubjectSidebar /></div> 
      <div className=" flex w-full flex-col">
        <NavBar />
        <NavBelowMdSubject />
        <div className='bg-gray-100 p-4 flex-1'>{children}</div>
      </div>
    </div>
      
  )
}

export default SubjectLayout