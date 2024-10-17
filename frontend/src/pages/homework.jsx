import React, { useState } from "react";
import MainLayout from "../layout/MainLayout";
import { Select } from 'antd';
import MathHomework from "./homework/mathHomework";
import ScienceHomework from "./homework/scienceHomework";
import EnglishHomework from "./homework/englishHomework";
import ComputerHomework from "./homework/computerHomework";


const Syllabus = () => {
  const[selectedSubject,setSelectedSubject]=useState("Math")
  
  const onChange = (value) => {
    setSelectedSubject(value)
  };
 
  return (
    <MainLayout>
      <div>

      <div className="flex items-center gap-x-2">
       <h4 className="text-purple-800 font-semibold text-sm">Select the Subject for Homework:</h4>
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
  {selectedSubject === "Math" && <MathHomework />}
      {selectedSubject === "Science" && <ScienceHomework />}
      {selectedSubject === "English" && <EnglishHomework />}
      {selectedSubject === "Computer" && <ComputerHomework />}
  </div>

        </div>
    </MainLayout>
  );
};

export default Syllabus;
