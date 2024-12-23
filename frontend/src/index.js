import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
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
import Profile from "./pages/profile";
import MyStudents from "./pages/myStudents";
import AddStudent from "./pages/principal/addStudent";
import AddTeacher from "./pages/principal/addTeacher";
import AcademicCalendar from "./pages/calendar";
import ApplyLeave from "./pages/leave/applyLeave";
import ViewLeave from "./pages/leave/viewLeave";
import Myleave from "./pages/leave/myleave";
import LeaveDetail from "./pages/leave/leaveDetails";
import HomePage from  "./pages/homepage";
import LearningManagemanetSystem from "./pages/LMS/lms";
import Subject from "./pages/LMS/subject";
import AssignmentDetailPage from "./pages/LMS/AssignmentDetailPage"
import TeachingManagementSystem from "./pages/TMS/tms"
import Classes from "./pages/TMS/classes"
import AssignmentSubmissions from "./pages/TMS/AssignmentSubmission";
import NewAssignment from "./pages/TMS/NewAssignment";
import AddNewNote from "./pages/TMS/AddNewNote";
import ViewNotes from "./pages/TMS/ViewNotes";
import StaffMap from "./pages/mybus"
// import AddClass from "./pages/principal/AddClass";
// import AddSubject from "./pages/principal/AddSubject"
import ClassList from "./pages/principal/ClassList";
import SubjectList from "./pages/principal/subjectList/SubjectList";
import StudentList from "./pages/principal/StudentList";
import TeacherList from "./pages/principal/TeacherList";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/homepage",
    element: <HomePage />,
  },
  {
    path: "/studentdashboard",
    element: <StudentHomePage />,
  },

  {
    path: "/masterdashboard",
    element: <MasterHomePage />,
  },

  {
    path: "/principaldashboard",
    element: <PrincipalHomePage />,
  },

  {
    path: "/teacherdashboard",
    element: <TeacherHomePage />,
  },

  {
    path: "/calendar",
    element: <AcademicCalendar />,
  },

  {
    path: "/reports",
    element: <Reports />,
  },

  {
    path: "/myrequest",
    element: <MyRequest />,
  },

  {
    path: "/allrequest",
    element: <AllRequest />,
  },

  {
    path: "/mybus",
    element: <StaffMap />,
  },

  {
    path: "/applyLeave",
    element: <ApplyLeave />,
  },
  {
    path: "/viewLeave",
    element: <ViewLeave />,
  },
  {
    path:"/leave-view/:id",
    element:<LeaveDetail />
  },
  {
    path: "/myLeave",
    element: <Myleave />,
  },

  {
    path: "/attendence",
    element: <Attendence />,
  },

  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/myStudents",
    element: <MyStudents />,
  },
  {
    path: "/addStudent",
    element: <AddStudent />,
  },
  {
    path: "/addTeacher",
    element: <AddTeacher />,
  },
  {
    path:"/lms",
    element:<LearningManagemanetSystem />
  },
  {
    path: "/lms/:subject",
    element: <Subject />

  },
  {
    path:"/assignment/:assignmentId",
     element:<AssignmentDetailPage />
  },
  {
    path:"/tms",
    element: <TeachingManagementSystem />
  },
  {
    path:"/tms/:classes",
    element:<Classes />
  },
  {
    path: "/submissions/:assignmentId",
     element: <AssignmentSubmissions />
  },
  {
    path: "/new-assignment" ,
    element: <NewAssignment />
  },
  {
    path:"/new-tip" ,
    element:<AddNewNote />
  },
  {
    path:"/view-tip/:id",
     element:<ViewNotes />
  },
  {
    path:"/classList",
    element: <ClassList />
  },
  {
    path:"/subjectList",
    element: <SubjectList />
  },
  {
    path: "/studentList",
    element: <StudentList />
  },
  {
    path: "/teacherList",
    element: <TeacherList />
  }
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ReduxProvider>
      <RouterProvider router={router} />

      <Toaster position="top-center" reverseOrder={false} />

      {/* <div className="mainFooterr">
        &nbsp; &nbsp; &nbsp; &nbsp; &copy; Copyright by Akash Singh.{" "}
      </div> */}
    </ReduxProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
