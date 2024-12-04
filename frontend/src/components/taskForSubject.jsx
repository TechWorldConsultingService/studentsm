import React, { useState, Suspense, lazy } from "react";
import { Radio } from "antd";
import "./taskForSubject.css";

const SubjectSyllabus = lazy(() => import("../pages/LMS/subjectSyllabus"));
const Homework = lazy(() => import("../pages/LMS/homework"));
const SubjectNotes = lazy(() => import("../pages/LMS/subjectNotes"));
const SubjectHome = lazy(() => import("../pages/LMS/subjectHome"));

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

const TaskForSubject = () => {
  const [subjectTask, setSubjectTask] = useState("home");

  const handleSubjectTask = (e) => {
    setSubjectTask(e.target.value);
  };

  return (
    <div>
      <Radio.Group
        block
        options={options}
        defaultValue="home"
        optionType="button"
        buttonStyle="solid"
        onChange={handleSubjectTask}
      />

      <div className="mt-6">

        <Suspense fallback={<div className="loading-spinner">Loading...</div>}>
          {subjectTask === "home" && <SubjectHome />}
          {subjectTask === "notes" && <SubjectNotes />}
          {subjectTask === "homework" && <Homework />}
          {subjectTask === "syllabus" && <SubjectSyllabus />}
        </Suspense>

      </div>
    </div>
  );
};

export default TaskForSubject;
