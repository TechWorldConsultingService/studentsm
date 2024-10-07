import React from 'react'

const sidebarData = ['Dashboard','Class','Reports','Buses','Attendance']

const Sidebar = () => {
  return (
    <div className='flex flex-col shadow-md  p-4 bg-gray-200'>
        <div><img src='/logo.jpeg' className='h-[38.5px] w-[90px] ' /></div>
        <div>
          {sidebarData && sidebarData.length>0 && sidebarData.map((items)=>{
              return (
                  <div className=' hover:text-purple-800 text-sm hover:font-semibold m-3 p-2'>
                    {items}
                  </div>
              )
          })}
        </div>
    </div>
  )
}

export default Sidebar