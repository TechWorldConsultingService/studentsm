
import React from "react";
import MainLayout from "../../layout/MainLayout";
import CalendarComponent from "../../components/CalendarComponent";

const PrincipalCalendar = () => {
  return (
    <MainLayout>
      <CalendarComponent
        role="principal"
        pageTitle="Principal Calendar - Full Access"
      />
    </MainLayout>
  );
};

export default PrincipalCalendar;
