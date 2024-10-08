import React from 'react'
import Sidebar from '../components/sidebar'
import NavBar from '../components/navBar'
import HomePage from '../pages/dashboard'

const MainLayout = ({children}) => {
  return (
    <div>
      <div className="flex h-screen w-screen">
      <Sidebar />
      <div className=" flex w-full flex-col">
        <NavBar />
        <div>{children}</div>
      </div>
    </div>
      </div>
  )
}

export default MainLayout