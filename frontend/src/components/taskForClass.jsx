import React, { useState, useEffect, Suspense, lazy } from "react";
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
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 768);

  const handleClassTask = (e) => {
    setClassTask(e.target.value);
  };

  const handleIconClick = () => {
    setShowDropdown(!showDropdown);
  };

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth <= 768);
      setShowDropdown(false); // Reset dropdown when resizing
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="task-for-class-container">
      <div className="icon-container">
        <PiDotsThreeBold
          className="task-icon"
          onClick={handleIconClick}
          style={{ display: isSmallScreen && !showDropdown ? "block" : "none" }}
        />
      </div>

      {/* Dropdown for small screens */}
      {showDropdown && isSmallScreen && (
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

      {/* Horizontal radio buttons for larger screens */}
      {!isSmallScreen && (
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
