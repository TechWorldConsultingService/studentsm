import React from 'react'

const sidebarData = ['Dashboard','Class','Reports','Bus']

const Sidebar = () => {
  return (
    <div className='flex flex-col shadow-md  p-4 bg-gray-200'>
        <div>Logo and Side Bar</div>
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