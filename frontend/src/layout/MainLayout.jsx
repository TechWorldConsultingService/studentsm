import React from 'react'
import Sidebar from '../components/sidebar'
import NavBar from '../components/navBar'

const MainLayout = ({children}) => {
  return (
    <div>
      <div className="flex h-full w-screen">
      <Sidebar />
      <div className=" flex w-full flex-col">
        <NavBar />
        <div className='bg-gray-100 p-4'>{children}</div>
      </div>
    </div>
      </div>
  )
}

export default MainLayout