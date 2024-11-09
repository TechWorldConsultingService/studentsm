import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import Reports from "./pages/reports";
import MyBus from "./pages/mybus";
import Leave from "./pages/leave";
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
import Notes from "./pages/notes";
import Syllabus from "./pages/syllabus";
import Homework from "./pages/homework";
import MyStudents from "./pages/myStudents";
import AddStudent from "./pages/principal/addStudent";
import AddTeacher from "./pages/principal/addTeacher";
import AcademicCalendar from "./pages/calendar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
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
    path: "/notes",
    element: <Notes />,
  },

  {
    path: "/syllabus",
    element: <Syllabus />,
  },

  {
    path: "/homework",
    element: <Homework />,
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
    element: <MyBus />,
  },

  {
    path: "/leave",
    element: <Leave />,
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
