import React,{useState} from 'react'
import {  Radio } from 'antd';
import './taskForSubject.css'

const options = [
    {
      label: 'Homework',
      value: 'homework',
    },
    {
      label: 'Notes',
      value: 'notes',
    },
    {
      label: 'Sullabus',
      value: 'syllabus',
    },
  ];

const TaskForSubject = () => {
    const [subjectTask, setSubjectTask] = useState('notes')

    const handleSubjectTask = (e) =>{
        setSubjectTask(e.target.value)
    }

  return (
    <div className=''>
         <Radio.Group
      block
      options={options}
      defaultValue="notes"
      optionType="button"
      buttonStyle="solid"
      onChange={handleSubjectTask}
    />
    </div>
  )
}

export default TaskForSubject