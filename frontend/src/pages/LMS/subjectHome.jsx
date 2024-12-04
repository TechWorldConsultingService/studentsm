import React from 'react'
import { useParams } from "react-router-dom";


const SubjectHome = () => {
  const { subject } = useParams();

  return (
        <div>
        <h1 className="text-2xl font-bold">
          {subject.charAt(0).toUpperCase() + subject.slice(1)} Page
        </h1>
        <p>Content for the subject: {subject}</p>
      </div>
  )
}

export default SubjectHome