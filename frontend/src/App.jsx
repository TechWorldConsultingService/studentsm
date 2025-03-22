import React, { useState, Suspense, lazy } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import LazyRoute from "./components/LazyRoute";




const Login = lazy(() => import("./login/login"));
const SelectClassForAttendance = lazy(() =>
  import("./pages/attendance/SelectClassForAttendence")
);
const Attendance = lazy(() => import("./pages/attendance/attendence"));
const AttendancePrincipal = lazy(() =>
  import("./pages/attendance/AttendancePrincipal")
);
const StudentReports = lazy(() => import("./pages/reports/StudentReports"));
// const MyBus =lazy(() =>(import("./pages/mybus")));
const MyRequest = lazy(() => import("./pages/myrequest"));
const AllRequest = lazy(() => import("./pages/allrequest"));
const StudentHomePage = lazy(() => import("./pages/studentdashboard"));
const MasterHomePage = lazy(() => import("./pages/masterdashboard"));
const PrincipalHomePage = lazy(() => import("./pages/principaldashboard"));
const TeacherHomePage = lazy(() => import("./pages/teacherdashboard"));
const Profile = lazy(() => import("./pages/profile"));
const MyStudents = lazy(() => import("./pages/myStudents"));
const AcademicCalendar = lazy(() => import("./pages/calendar"));
const HomePage = lazy(() => import("./pages/homepage"));
const LearningManagemanetSystem = lazy(() => import("./pages/LMS/lms"));
const TeachingManagementSystem = lazy(() => import("./pages/TMS/tms"));
const ClassList = lazy(() => import("./pages/principal/classList/ClassList"));
const SubjectList = lazy(() =>
  import("./pages/principal/subjectList/SubjectList")
);
const StudentList = lazy(() =>
  import("./pages/principal/studentList/StudentList")
);
const TeacherList = lazy(() =>
  import("./pages/principal/teacherList/TeacherList")
);
const ExamTeacher = lazy(() => import("./pages/reports/ExamTeacher"));
const ExamPrincipal = lazy(() => import("./pages/reports/ExamPrincipal"));
const AddExamDetailsByPrincipal = lazy(() =>
  import("./pages/reports/AddExamDetailsByPrincipal")
);
const StudentRoutine = lazy(() => import("./pages/reports/StudentRoutine"));
const ExamPublish = lazy(() => import("./pages/reports/ExamPublish"));
const ExamRoutineTeacher = lazy(() =>
  import("./pages/reports/ExamRoutineTeacher")
);
const AddRollNumber = lazy(() => import("./pages/Teacher/AddRollNumber"));
const PrincipalCalendar = lazy(() =>
  import("./pages/Calander/PrincipalCalendar")
);
const AccountantList = lazy(() =>
  import("./pages/principal/accountent/AccountentList")
);
const AccountantDashboard = lazy(() => import("./pages/AccountantDahboard"));
const Invoicing = lazy(() => import("./pages/accountant/Invoicing"));
const CategoryList = lazy(() => import("./pages/accountant/CategoryList"));
const AddFeeAmount = lazy(() => import("./pages/accountant/ClassFeesList"));
const AddTransportationFee = lazy(() =>
  import("./pages/accountant/TransportationFeeList")
);
const LedgerPage = lazy(() => import("./pages/accountant/LedgerPage"));
const FeePayment = lazy(() => import("./pages/accountant/FeePaymant"));
const PaymentPage = lazy(() => import("./pages/accountant/PaymentPage"));
const ArrayInput = lazy(() => import("./pages/example"));
const SuccessTransection = lazy(() =>
  import("./pages/accountant/SuccessInvoice")
);
const SuccessPayment = lazy(() => import("./pages/accountant/SuccessPayment"));
const MyLeaves = lazy(() => import("./pages/leave/MyLeaves"));
const ManageAllLeaves = lazy(() => import("./pages/leave/ManageAllLeaves"));
const SubjectNotes = lazy(() => import("./pages/LMS/subjectNotes"));
const SubjectSyllabus = lazy(() => import("./pages/LMS/subjectSyllabus"));
const ClassSyllabus = lazy(() => import("./pages/TMS/syllabus/classSyllabus"));
const TeacherHomeworkDashboard = lazy(() => import("./pages/TMS/teacherHomework/TeacherHomeworkDashboard"));
const ClassNotes = lazy(() => import("./pages/TMS/teacherNotes/classNotes"));


// const QuizComponent = lazy(() => import("./pages/Quiz/PlayQuiz/PlayQuiz"));
const AssignmentSubmissionsPage = lazy(() =>
  import("./pages/TMS/teacherHomework/AssignmentSubmissionsPage")
);
const StudentAssignmentsPage = lazy(() =>
  import("./pages/LMS/homework/AssignmentPage")
);

const AddQuiz = lazy(() => import("./pages/Quiz/AddQuiz"));
const WelcomePage = lazy(() => import("./pages/Quiz/PlayQuiz/WelcomePage"));
const PlayQuizPage = lazy(() => import("./pages/Quiz/PlayQuiz/PlayQuizPage"));
const ScoreBoard = lazy(() => import("./pages/Quiz/PlayQuiz/ScoreBoard"));

const MyStudentDetails = lazy(() =>
  import("./pages/principal/MyStudentDetails")
);
const SchoolSettings = lazy(() => import("./pages/SchoolSetting"));
const PaymentStatements = lazy(() => import("./pages/statements"));
const TaskList = lazy(() => import("./pages/TasksMS/TaskList"));
// const TodoListPage =lazy(() =>(import("./pages/TasksMS/TodoListPage")));
const DiscussionForum = lazy(() => import("./pages/DiscussionForum"));
const DiscussionForumDetails = lazy(() =>
  import("./pages/DiscussionForum/DiscussionDetails")
);
const NoticeList = lazy(() => import("./pages/Notification/NoticeList"))
const NotificationView = lazy(() => import("./pages/Notification/NotificationView"))
const MessageList = lazy (() => import("./pages/Notification/MessageList"))
const MessageView = lazy( () => import("./pages/Notification/MessageView"))



function App() {
  const [selectedClassForAttendance, setSelectedClassForAttendance] =
    useState("");

  const router = createBrowserRouter([
    { path: "/examplePage", element: LazyRoute(ArrayInput) },
    { path: "/", element: LazyRoute(Login, { noMainLayout: true }) },
    { path: "/tasklist", element: LazyRoute(TaskList) },
    // { path: "/todo", element: LazyRoute(TodoListPage ) },

    { path: "/homepage", element: LazyRoute(HomePage) },

    { path: "/addquiz", element: LazyRoute(AddQuiz) },
    { path: "/welcomequiz", element: LazyRoute(WelcomePage) },
    { path: "/playquizpage", element: LazyRoute(PlayQuizPage) },
    { path: "/scoreboard", element: LazyRoute(ScoreBoard) },


    { path: "/studentdashboard", element: LazyRoute(StudentHomePage) },
    { path: "/masterdashboard", element: LazyRoute(MasterHomePage) },
    { path: "/principaldashboard", element: LazyRoute(PrincipalHomePage) },
    { path: "/teacherdashboard", element: LazyRoute(TeacherHomePage) },
    { path: "/calendar", element: LazyRoute(AcademicCalendar) },
    { path: "/studentResult", element: LazyRoute(StudentReports) },
    { path: "/myrequest", element: LazyRoute(MyRequest) },
    { path: "/allrequest", element: LazyRoute(AllRequest) },
    // { path: "/mybus", element: LazyRoute(MyBus ) },
    { path: "/profile", element: LazyRoute(Profile) },
    { path: "/myStudents", element: LazyRoute(MyStudents) },
    {
      path: "/lms",
      element: LazyRoute(LearningManagemanetSystem, { noMainLayout: true }),
    },
    {
      path: "/tms",
      element: LazyRoute(TeachingManagementSystem, { noMainLayout: true }),
    },
    { path: "/classList", element: LazyRoute(ClassList) },
    { path: "/subjectList", element: LazyRoute(SubjectList) },
    { path: "/studentList", element: LazyRoute(StudentList) },
    { path: "/teacherList", element: LazyRoute(TeacherList) },
    { path: "/examTeacher", element: LazyRoute(ExamTeacher) },
    { path: "/examPrincipal", element: LazyRoute(ExamPrincipal) },
    { path: "/examRoutineTeacher", element: LazyRoute(ExamRoutineTeacher) },
    { path: "/examPublish", element: LazyRoute(ExamPublish) },
    {
      path: "/exam-details/:examId",
      element: LazyRoute(AddExamDetailsByPrincipal),
    },
    { path: "/examRoutine", element: LazyRoute(StudentRoutine) },
    { path: "/addRollNumber", element: LazyRoute(AddRollNumber) },
    { path: "/principal-calendar", element: LazyRoute(PrincipalCalendar) },
    { path: "/attendancePrincipal", element: LazyRoute(AttendancePrincipal) },
    { path: "/accountantList", element: LazyRoute(AccountantList) },
    { path: "/accountantdashboard", element: LazyRoute(AccountantDashboard) },
    { path: "/feePayment", element: LazyRoute(FeePayment) },
    { path: "/payment/:studentId", element: LazyRoute(PaymentPage) },
    { path: "/invoicing", element: LazyRoute(Invoicing) },
    { path: "/statements", element: LazyRoute(PaymentStatements) },
    { path: "/addCategory", element: LazyRoute(CategoryList) },
    { path: "/addFeeAmount", element: LazyRoute(AddFeeAmount) },
    { path: "/addTransportationFee", element: LazyRoute(AddTransportationFee) },
    { path: "/invoicing/:studentId", element: LazyRoute(LedgerPage) },
    { path: "/successTransection", element: LazyRoute(SuccessTransection) },
    { path: "/successPayment", element: LazyRoute(SuccessPayment) },
    { path: "/my-leaves", element: LazyRoute(MyLeaves) },
    { path: "/manage-leaves", element: LazyRoute(ManageAllLeaves) },
    {
      path: "/lms/:subjectName/homework",
      element: LazyRoute(StudentAssignmentsPage, { noMainLayout: true }),
    },
    {
      path: "/lms/:subjectName/notes",
      element: LazyRoute(SubjectNotes, { noMainLayout: true }),
    },
    {
      path: "/lms/:subjectName/syllabus",
      element: LazyRoute(SubjectSyllabus, { noMainLayout: true }),
    },
    {
      path: "/tms/:classId/syllabus",
      element: LazyRoute(ClassSyllabus, { noMainLayout: true }),
    },
    {
      path: "/tms/:classId/homework",
      element: LazyRoute(TeacherHomeworkDashboard, { noMainLayout: true }),
    },
    { path: "/myStudent", element: LazyRoute(MyStudentDetails) },
    { path: "/schoolSetting", element: LazyRoute(SchoolSettings) },
    { path: "/discussion-forum", element: LazyRoute(DiscussionForum) },
    {
      path: "/discussion-forum/details/:id",
      element: LazyRoute(DiscussionForumDetails),
    },
    {
      path: "/tms/assignments/:assignmentId/submissions",
      element: LazyRoute(AssignmentSubmissionsPage, { noMainLayout: true }),
    },
    {
      path: "/tms/:classId/notes",
      element: LazyRoute(ClassNotes, { noMainLayout: true }),
    },
    {
      path: "/selectClassForAttendence",
      element: LazyRoute(SelectClassForAttendance, {
        setSelectedClassForAttendance: setSelectedClassForAttendance,
      }),
    },
    {
      path: "/attendance",
      element: LazyRoute(Attendance, {
        selectedClassForAttendance: selectedClassForAttendance,
      }),
    },
      {path:"/noticeList", element: LazyRoute(NoticeList)},
      {path: "/notificationView", element: LazyRoute(NotificationView)},
      {path: "/messageList", element: LazyRoute(MessageList)},
      {path: "/messageView", element: LazyRoute(MessageView)},


  ]);

  return <RouterProvider router={router} />;
}

export default App;
