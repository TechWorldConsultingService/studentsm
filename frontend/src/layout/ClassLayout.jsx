import React from 'react'
import NavBar from '../components/navBar'
import ClassSidebar from '../components/classSidebar'


const ClassLayout = ({children}) => {
  return (
    
      <div className="flex h-full w-screen ">
      <ClassSidebar />
      <div className=" flex w-full flex-col">
        <NavBar />
        <div className='bg-gray-100 p-4'>{children}</div>
      </div>
    </div>
      
  )
}

export default ClassLayout