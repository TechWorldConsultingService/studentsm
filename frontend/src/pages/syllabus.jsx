import React, { useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Select } from 'antd';
import MathSyllabus from "./syllabus/mathSyllabus";
import ScienceSyllabus from "./syllabus/scienceSyllabus";
import EnglishSyllabus from "./syllabus/englishSyllabus";
import ComputerSyllabus from "./syllabus/computerSyllabus";


const Syllabus = () => {
  const[selectedSubject,setSelectedSubject]=useState("Math")
  
  const onChange = (value) => {
    console.log(`selected ${value}`);
    setSelectedSubject(value)
  };
 
  return (
    <MainLayout>
      <div>

      <div className="flex items-center gap-x-2">
       <h4 className="text-purple-800 font-semibold text-sm">Select the Subject you want to see Syllabus:</h4>
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
  {selectedSubject === "Math" && <MathSyllabus />}
      {selectedSubject === "Science" && <ScienceSyllabus />}
      {selectedSubject === "English" && <EnglishSyllabus />}
      {selectedSubject === "Computer" && <ComputerSyllabus />}
  </div>

        </div>
    </MainLayout>
  );
};

export default Syllabus;
