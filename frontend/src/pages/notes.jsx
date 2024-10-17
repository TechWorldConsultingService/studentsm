import React, { useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Select } from 'antd';
import MathNotes from "./notes/mathNotes";
import ScienceNotes from "./notes/scienceNotes";
import EnglishNotes from "./notes/englishNotes";
import ComputerNotes from "./notes/computerNotes";



const Syllabus = () => {
  const[selectedSubject,setSelectedSubject]=useState("Math")
  
  const onChange = (value) => {
    setSelectedSubject(value)
  };
 
  return (
    <MainLayout>
      <div>

      <div className="flex items-center gap-x-2">
       <h4 className="text-purple-800 font-semibold text-sm">Select the Subject you want to read Notes:</h4>
        <Select
    showSearch
    placeholder="Select a Subject"
    optionFilterProp="label"
    onChange={onChange}
    defaultValue="Math"
    style={{ width: '150px' }}
    options={[
      { value: 'Math', label: 'Math' },
      { value: 'Science', label: 'Science' },
      { value: 'Computer', label: 'Computer' },
      { value: 'English', label: 'English' },
    ]}
  />
  </div>

  <div className="bg-gray-100">
  {selectedSubject === "Math" && <MathNotes />}
      {selectedSubject === "Science" && <ScienceNotes />}
      {selectedSubject === "English" && <EnglishNotes />}
      {selectedSubject === "Computer" && <ComputerNotes />}
  </div>

        </div>
    </MainLayout>
  );
};

export default Syllabus;
