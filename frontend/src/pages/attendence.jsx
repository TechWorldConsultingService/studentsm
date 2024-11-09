import React, { useState } from 'react'
import MainLayout from '../layout/MainLayout'
import MathHomework from "./homework/mathHomework";
import { Select } from 'antd';


const Attendence = () => {

  const[selectClass,setSelectClass]=useState("One")

  const onChange = (value) => {
    setSelectClass(value)
  };

  return (
    <MainLayout>
    <div>

      <div className="flex items-center gap-x-2">
       <h4 className="text-purple-800 font-semibold text-sm">Select the Class for Attendence:</h4>
        <Select
    showSearch
    placeholder="Select a Class"
    optionFilterProp="label"
    onChange={onChange}
    defaultValue="One"
    style={{ width: '150px' }}
    options={[
      { value: 'one', label: 'One' },
      { value: 'two', label: 'Two' },
      { value: 'three', label: 'Three' },
      { value: 'four', label: 'Four' },
      { value: 'five', label: 'five' },
      { value: 'six', label: 'Six' },
      { value: 'seven', label: 'Seven' },

    ]}
  />
  </div>

  <div className="bg-gray-100">
  {selectClass === "one" && <MathHomework />}
      {selectClass === "two" && <MathHomework />}
      {selectClass === "three" && <MathHomework />}
      {selectClass === "four" && <MathHomework />}
      {selectClass === "five" && <MathHomework />}
      {selectClass === "six" && <MathHomework />}
      {selectClass === "seven" && <MathHomework />}

  </div>

        </div>
    </MainLayout>

  )
}

export default Attendence