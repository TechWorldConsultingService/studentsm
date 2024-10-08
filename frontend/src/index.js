import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import Class from "./pages/class";
import Calendar from "./pages/calendar";
import Reports from "./pages/reports";
import Request from "./pages/request";
import MyBus from "./pages/mybus";
import Leave from "./pages/leave";
import Attendence from "./pages/attendence";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    path: "/calendar",
    element: <Calendar />,
  },

  {
    path: "/class",
    element: <Class />,
  },

  {
    path: "/reports",
    element: <Reports />,
  },

  {
    path: "/request",
    element: <Request />,
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
