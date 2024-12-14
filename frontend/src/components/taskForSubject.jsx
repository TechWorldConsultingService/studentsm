import React, { useState, useEffect, Suspense, lazy } from "react";
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
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  const handleSubjectTask = (e) => {
    setSubjectTask(e.target.value);
  };

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="task-for-subject-container">
      {/* Dropdown for small screens */}
      {isSmallScreen && (
        <select value={subjectTask} onChange={handleSubjectTask}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {/* Horizontal radio buttons for larger screens */}
      {!isSmallScreen && (
        <Radio.Group
          block
          options={options}
          defaultValue="home"
          optionType="button"
          buttonStyle="solid"
          onChange={handleSubjectTask}
        />
      )}

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
