// src/pages/TeacherCalendar.jsx

import React from "react";
import MainLayout from "../layout/MainLayout";
import CalendarComponent from "../components/CalendarComponent";

const TeacherCalendar = () => {
  return (
    <MainLayout>
      <CalendarComponent
        role="teacher"
        pageTitle="Teacher Calendar - Full Access"
      />
    </MainLayout>
  );
};

export default TeacherCalendar;
