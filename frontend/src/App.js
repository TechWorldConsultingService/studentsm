import React, { useState } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Login from "./login/login";
import SelectClassForAttendance from "./pages/attendance/SelectClassForAttendence";
import Attendance from "./pages/attendance/attendence";
import AttendancePrincipal from "./pages/attendance/AttendancePrincipal";
import StudentReports from "./pages/reports/StudentReports";
// import MyBus from "./pages/mybus";
import MyRequest from "./pages/myrequest";
import AllRequest from "./pages/allrequest";
import StudentHomePage from "./pages/studentdashboard";
import MasterHomePage from "./pages/masterdashboard";
import PrincipalHomePage from "./pages/principaldashboard";
import TeacherHomePage from "./pages/teacherdashboard";
import Profile from "./pages/profile";
import MyStudents from "./pages/myStudents";
import AcademicCalendar from "./pages/calendar";
import HomePage from "./pages/homepage";
import LearningManagemanetSystem from "./pages/LMS/lms";
import TeachingManagementSystem from "./pages/TMS/tms";
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
import AddRollNumber from "./pages/Teacher/AddRollNumber";
import PrincipalCalendar from "./pages/Calander/PrincipalCalendar";
import AccountantList from "./pages/principal/accountent/AccountentList";
import AccountantDashboard from "./pages/AccountantDahboard";
import Invoicing from "./pages/accountant/Invoicing";
import CategoryList from "./pages/accountant/CategoryList";
import AddFeeAmount from "./pages/accountant/ClassFeesList";
import AddTransportationFee from "./pages/accountant/TransportationFeeList";
import LedgerPage from "./pages/accountant/LedgerPage";
import FeePayment from "./pages/accountant/FeePaymant";
import PaymentPage from "./pages/accountant/PaymentPage";
import ArrayInput from "./pages/example";
import SuccessTransection from "./pages/accountant/SuccessInvoice";
import SuccessPayment from "./pages/accountant/SuccessPayment";
import MyLeaves from "./pages/leave/MyLeaves";
import ManageAllLeaves from "./pages/leave/ManageAllLeaves";
import SubjectNotes from "./pages/LMS/subjectNotes";
import SubjectSyllabus from "./pages/LMS/subjectSyllabus";
import ClassSyllabus from "./pages/TMS/syllabus/classSyllabus";
import TeacherHomeworkDashboard from "./pages/TMS/teacherHomework/TeacherHomeworkDashboard";
import ClassNotes from "./pages/TMS/teacherNotes/classNotes";
import QuizComponent from "./pages/Quiz/QuizComponent";
import AssignmentSubmissionsPage from "./pages/TMS/teacherHomework/AssignmentSubmissionsPage";
import StudentAssignmentsPage from "./pages/LMS/homework/AssignmentPage";
import AddQuiz from "./pages/Quiz/AddQuiz";
import MyStudentDetails from "./pages/principal/MyStudentDetails";
import PaymentStatements from "./pages/statements";

function App() {
  const [selectedClassForAttendance, setSelectedClassForAttendance] =
    useState("");

  const router = createBrowserRouter([
    { path: "/examplePage", element: <ArrayInput /> },
    { path: "/", element: <Login /> },
    { path: "/homepage", element: <HomePage /> },
    { path: "/addquiz", element: <AddQuiz /> },
    { path: "/playquiz", element: <QuizComponent /> },
    { path: "/studentdashboard", element: <StudentHomePage /> },
    { path: "/masterdashboard", element: <MasterHomePage /> },
    { path: "/principaldashboard", element: <PrincipalHomePage /> },
    { path: "/teacherdashboard", element: <TeacherHomePage /> },
    { path: "/calendar", element: <AcademicCalendar /> },
    { path: "/studentResult", element: <StudentReports /> },
    { path: "/myrequest", element: <MyRequest /> },
    { path: "/allrequest", element: <AllRequest /> },
    // { path: "/mybus", element: <MyBus /> },
    { path: "/profile", element: <Profile /> },
    { path: "/myStudents", element: <MyStudents /> },
    { path: "/lms", element: <LearningManagemanetSystem /> },
    { path: "/tms", element: <TeachingManagementSystem /> },
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
    { path: "/addRollNumber", element: <AddRollNumber /> },
    { path: "/principal-calendar", element: <PrincipalCalendar /> },
    { path: "/attendancePrincipal", element: <AttendancePrincipal /> },
    { path: "/accountantList", element: <AccountantList /> },
    { path: "/accountantdashboard", element: <AccountantDashboard /> },
    { path: "/feePayment", element: <FeePayment /> },
    { path: "/payment/:studentId", element: <PaymentPage /> },
    { path: "/invoicing", element: <Invoicing /> },
    { path: "/statements", element: <PaymentStatements /> },
    { path: "/addCategory", element: <CategoryList /> },
    { path: "/addFeeAmount", element: <AddFeeAmount /> },
    { path: "/addTransportationFee", element: <AddTransportationFee /> },
    { path: "/invoicing/:studentId", element: <LedgerPage /> },
    { path: "/successTransection", element: <SuccessTransection /> },
    { path: "/successPayment", element: <SuccessPayment /> },
    { path: "/my-leaves", element: <MyLeaves /> },
    { path: "/manage-leaves", element: <ManageAllLeaves /> },
    { path: "/lms/:subjectName/homework", element: <StudentAssignmentsPage /> },
    { path: "/lms/:subjectName/notes", element: <SubjectNotes /> },
    { path: "/lms/:subjectName/syllabus", element: <SubjectSyllabus /> },
    { path: "/tms/:classId/syllabus", element: <ClassSyllabus /> },
    { path: "/tms/:classId/homework", element: <TeacherHomeworkDashboard /> },
    { path: "/myStudent", element: <MyStudentDetails /> },
    {
      path: "/tms/assignments/:assignmentId/submissions",
      element: <AssignmentSubmissionsPage />,
    },
    { path: "/tms/:classId/notes", element: <ClassNotes /> },
    {
      path: "/selectClassForAttendence",
      element: (
        <SelectClassForAttendance
          setSelectedClassForAttendance={setSelectedClassForAttendance}
        />
      ),
    },
    {
      path: "/attendance",
      element: (
        <Attendance selectedClassForAttendance={selectedClassForAttendance} />
      ),
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
