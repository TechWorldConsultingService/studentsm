import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./login/login";
import SelectClassForAttendance from "./pages/attendance/SelectClassForAttendence";
import Attendance from "./pages/attendance/attendence";
import AttendancePrincipal from "./pages/attendance/AttendancePrincipal";
import StudentReports from "./pages/reports/StudentReports";
import MyBus from "./pages/mybus";
import MyRequest from "./pages/myrequest";
import AllRequest from "./pages/allrequest";
import StudentHomePage from "./pages/studentdashboard";
import MasterHomePage from "./pages/masterdashboard";
import PrincipalHomePage from "./pages/principaldashboard";
import TeacherHomePage from "./pages/teacherdashboard";
import Profile from "./pages/profile";
import MyStudents from "./pages/myStudents";
import AcademicCalendar from "./pages/calendar";
import ApplyLeave from "./pages/leave/applyLeave";
import ViewLeave from "./pages/leave/viewLeave";
import Myleave from "./pages/leave/myleave";
import LeaveDetail from "./pages/leave/leaveDetails";
import HomePage from "./pages/homepage";
import LearningManagemanetSystem from "./pages/LMS/lms";
import Subject from "./pages/LMS/subject";
import AssignmentDetailPage from "./pages/LMS/AssignmentDetailPage";
import TeachingManagementSystem from "./pages/TMS/tms";
import Classes from "./pages/TMS/classes";
import AssignmentSubmissions from "./pages/TMS/AssignmentSubmission";
import NewAssignment from "./pages/TMS/NewAssignment";
import ClassList from "./pages/principal/classList/ClassList";
import SubjectList from "./pages/principal/subjectList/SubjectList";
import StudentList from "./pages/principal/studentList/StudentList";
import TeacherList from "./pages/principal/teacherList/TeacherList";
import ExamTeacher from "./pages/reports/ExamTeacher";
import ExamPrincipal from "./pages/reports/ExamPrincipal";
import AddExamDetailsByPrincipal from "./pages/reports/AddExamDetailsByPrincipal";
import StudentRoutine from "./pages/reports/StudentRoutine";
import ExamPublish from "./pages/reports/ExamPublish";
import ExamRoutineTeacher from "./pages/reports/ExamRoutineTeacher";
import AddRollNumber from "./pages/Teacher/AddRollNumber"

function App() {
  const [selectedClassForAttendance, setSelectedClassForAttendance] = useState("");

  const router = createBrowserRouter([
    { path: "/", element: <Login /> },
    { path: "/homepage", element: <HomePage /> },
    { path: "/studentdashboard", element: <StudentHomePage /> },
    { path: "/masterdashboard", element: <MasterHomePage /> },
    { path: "/principaldashboard", element: <PrincipalHomePage /> },
    { path: "/teacherdashboard", element: <TeacherHomePage /> },
    { path: "/calendar", element: <AcademicCalendar /> },
    { path: "/studentResult", element: <StudentReports /> },
    { path: "/myrequest", element: <MyRequest /> },
    { path: "/allrequest", element: <AllRequest /> },
    { path: "/mybus", element: <MyBus /> },
    { path: "/applyLeave", element: <ApplyLeave /> },
    { path: "/viewLeave", element: <ViewLeave /> },
    { path: "/leave-view/:id", element: <LeaveDetail /> },
    { path: "/myLeave", element: <Myleave /> },
    { path: "/profile", element: <Profile /> },
    { path: "/myStudents", element: <MyStudents /> },
    { path: "/lms", element: <LearningManagemanetSystem /> },
    { path: "/lms/:subject", element: <Subject /> },
    { path: "/assignment/:assignmentId", element: <AssignmentDetailPage /> },
    { path: "/tms", element: <TeachingManagementSystem /> },
    { path: "/tms/:classes", element: <Classes /> },
    { path: "/submissions/:assignmentId", element: <AssignmentSubmissions /> },
    { path: "/new-assignment", element: <NewAssignment /> },
    { path: "/classList", element: <ClassList /> },
    { path: "/subjectList", element: <SubjectList /> },
    { path: "/studentList", element: <StudentList /> },
    { path: "/teacherList", element: <TeacherList /> },
    { path: "/examTeacher", element: <ExamTeacher /> },
    { path: "/examPrincipal", element: <ExamPrincipal /> },
    { path: "/examRoutineTeacher", element: <ExamRoutineTeacher /> },
    { path: "/examPublish", element: <ExamPublish /> },
    { path: "/exam-details/:examId", element: <AddExamDetailsByPrincipal /> },
    { path: "/examRoutine", element: <StudentRoutine /> },
    {path: "/addRollNumber", element: <AddRollNumber />},
{path: "/attendancePrincipal", element: <AttendancePrincipal />},
    { path: "/selectClassForAttendence", element: <SelectClassForAttendance setSelectedClassForAttendance={setSelectedClassForAttendance} /> },
    { path: "/attendance", element: <Attendance selectedClassForAttendance={selectedClassForAttendance} /> },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
