import React, { useState, Suspense, lazy } from "react";
import { Radio } from "antd";
import "./taskForSubject.css";
const ClassHome = lazy(() => import ("../pages/TMS/classHome"));
const ClassNotes = lazy(()=> import("../pages/TMS/classNotes"))
const ClassHomework = lazy(()=>import("../pages/TMS/classHomework"))
const ClassSyllabus = lazy(()=>import("../pages/TMS/classSyllabus"))

const options = [
  {
    label: "Home",
    value: "home",
  },
  {
    label: "Homework",
    value: "homework",
  },
  {
    label: "Notes",
    value: "notes",
  },
  {
    label: "Syllabus",
    value: "syllabus",
  },
];

const TaskForClass = () => {
  const [classTask, setClassTask] = useState("home");

  const handleClassTask = (e) => {
    setClassTask(e.target.value);
  };

  return (
    <div>
      <Radio.Group
        block
        options={options}
        defaultValue="home"
        optionType="button"
        buttonStyle="solid"
        onChange={handleClassTask}
      />

      <div className="mt-6">

        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          {classTask === "home" && <ClassHome />}
          {classTask === "notes" && <ClassNotes />}
          {classTask === "homework" && <ClassHomework />}
          {classTask === "syllabus" && <ClassSyllabus />}
        </Suspense>

      </div>
    </div>
  );
};

export default TaskForClass;
