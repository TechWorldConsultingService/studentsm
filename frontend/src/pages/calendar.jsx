import React from 'react'
import MainLayout from '../layout/MainLayout'
import { Calendar } from 'antd';
import './css/calendar.css'

const AcademicCalendar   = () => {

  const onPanelChange = (value, mode) => {
    console.log(value.format('YYYY-MM-DD'), mode);
  }

  return (
    <MainLayout>
    <div className='flex flex-col item-center rounded-xl shadow-lg justify-center shadow-blue-900'> 
    
    <div className=' flex justify-center text-blue-600 text-2xl font-semibold '>Academic Calendar</div> 
    <div className='pt-4 pl-5'> <Calendar onPanelChange={onPanelChange} /></div>
     
     </div>
    </MainLayout>

  )
}

export default AcademicCalendar