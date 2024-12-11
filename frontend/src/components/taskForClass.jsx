import React, { useState, Suspense, lazy } from "react";
import { Radio } from "antd";
import { PiDotsThreeBold } from "react-icons/pi";
import "./taskForSubject.css";

const ClassHome = lazy(() => import("../pages/TMS/classHome"));
const ClassNotes = lazy(() => import("../pages/TMS/classNotes"));
const ClassHomework = lazy(() => import("../pages/TMS/classHomework"));
const ClassSyllabus = lazy(() => import("../pages/TMS/classSyllabus"));

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
  const [showDropdown, setShowDropdown] = useState(false);

  const handleClassTask = (e) => {
    setClassTask(e.target.value);
  };

  const handleIconClick = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="task-for-class-container">
      <div className="icon-container">
        {/* This icon will be displayed based on screen size */}
        <PiDotsThreeBold
          className="task-icon"
          onClick={handleIconClick}
          style={{ display: showDropdown ? "none" : "block" }}
        />
      </div>

      {/* Radio buttons as a dropdown below md screen size */}
      {showDropdown && window.innerWidth <= 768 && (
        <select
          value={classTask}
          onChange={handleClassTask}
          style={{
            padding: "8px",
            width: "100%",
            fontSize: "14px",
            marginTop: "10px",
          }}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      )}

      {/* Radio buttons in a horizontal row above md screen size */}
      {window.innerWidth > 768 && (
        <Radio.Group
          block
          options={options}
          defaultValue="home"
          optionType="button"
          buttonStyle="solid"
          onChange={handleClassTask}
        />
      )}

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


