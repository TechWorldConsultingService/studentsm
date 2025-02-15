// src/pages/StudentCalendar.jsx

import React from "react";
import MainLayout from "../layout/MainLayout";
import CalendarComponent from "../components/CalendarComponent";

const StudentCalendar = () => {
  return (
    <MainLayout>
      <CalendarComponent
        role="student"           // read-only
        pageTitle="Student Calendar - View Only"
      />
    </MainLayout>
  );
};

export default StudentCalendar;
