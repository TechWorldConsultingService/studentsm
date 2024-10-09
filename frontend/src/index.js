import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import Calendar from "./pages/calendar";
import Reports from "./pages/reports";
import MyBus from "./pages/mybus";
import Leave from "./pages/leave";
import Attendence from "./pages/attendence";
import Science from "./pages/science";
import Computer from "./pages/computer";
import MyRequest from "./pages/myrequest";
import AllRequest from "./pages/allrequest";
import Math from "./pages/math";
import StudentHomePage from "./pages/studentdashboard";
import MasterHomePage from "./pages/masterdashboard";
import PrincipalHomePage from "./pages/principaldashboard";
import TeacherHomePage from "./pages/teacherdashboard";

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
    element: <Calendar />,
  },

  {
    path: "/math",
    element: <Math />,
  },

  {
    path: "/science",
    element: <Science />,
  },

  {
    path: "/computer",
    element: <Computer />,
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
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
