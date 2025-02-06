import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ChatPage from "./pages/ChatPage";
//import NavBar from "./components/navBar";
import Reports from "./pages/reports";
import MyBus from "./pages/mybus";
import Attendence from "./pages/attendence";
import MyRequest from "./pages/myrequest";
import AllRequest from "./pages/allrequest";
import StudentHomePage from "./pages/studentdashboard";
import MasterHomePage from "./pages/masterdashboard";
import PrincipalHomePage from "./pages/principaldashboard";
import TeacherHomePage from "./pages/teacherdashboard";
import ReduxProvider from "./redux/ReduxProvider";
import { Toaster } from "react-hot-toast";
import ProfilePage from "./pages/ProfilePage";
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
import AddNewNote from "./pages/TMS/AddNewNote";
import ViewNotes from "./pages/TMS/ViewNotes";
import StaffMap from "./pages/mybus";
import ClassList from "./pages/principal/classList/ClassList";
import SubjectList from "./pages/principal/subjectList/SubjectList";
import StudentList from "./pages/principal/studentList/StudentList";
import TeacherList from "./pages/principal/teacherList/TeacherList";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ReduxProvider>
      <Router>
      {/* ✅ Navbar is outside Routes to persist */}
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/homepage" element={<HomePage />} />
          <Route path="/studentdashboard" element={<StudentHomePage />} />
          <Route path="/masterdashboard" element={<MasterHomePage />} />
          <Route path="/principaldashboard" element={<PrincipalHomePage />} />
          <Route path="/teacherdashboard" element={<TeacherHomePage />} />
          <Route path="/calendar" element={<AcademicCalendar />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/myrequest" element={<MyRequest />} />
          <Route path="/allrequest" element={<AllRequest />} />
          <Route path="/mybus" element={<StaffMap />} />
          <Route path="/applyLeave" element={<ApplyLeave />} />
          <Route path="/viewLeave" element={<ViewLeave />} />
          <Route path="/leave-view/:id" element={<LeaveDetail />} />
          <Route path="/myLeave" element={<Myleave />} />
          <Route path="/attendence" element={<Attendence />} />
          {/* <Route path="/ProfilePage" element={<ProfilePage />} /> */}
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/myStudents" element={<MyStudents />} />
          <Route path="/lms" element={<LearningManagemanetSystem />} />
          <Route path="/lms/:subject" element={<Subject />} />
          <Route path="/assignment/:assignmentId" element={<AssignmentDetailPage />} />
          <Route path="/tms" element={<TeachingManagementSystem />} />
          <Route path="/tms/:classes" element={<Classes />} />
          <Route path="/submissions/:assignmentId" element={<AssignmentSubmissions />} />
          <Route path="/new-assignment" element={<NewAssignment />} />
          <Route path="/new-tip" element={<AddNewNote />} />
          <Route path="/view-tip/:id" element={<ViewNotes />} />
          <Route path="/classList" element={<ClassList />} />
          <Route path="/subjectList" element={<SubjectList />} />
          <Route path="/studentList" element={<StudentList />} />
          <Route path="/teacherList" element={<TeacherList />} />
          <Route path="/chat/:id" element={<ChatPage />} />
          <Route path="*" element={<h1>404 Page Not Found</h1>} />
        </Routes>
      </Router>
      <Toaster position="top-center" reverseOrder={false} />
    </ReduxProvider>
  </React.StrictMode>
);

reportWebVitals();

