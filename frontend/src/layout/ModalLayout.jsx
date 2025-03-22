import React from 'react'


const ModalLayout = ({children}) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-1/2 lg:w-1/3 max-h-full overflow-auto">
        <div className='bg-gray-100 p-4'>{children}</div>

        </div>
      </div>
  )
}

export default ModalLayout