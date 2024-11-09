import React from "react";
import MainLayout from "../layout/MainLayout";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const barchatData = [
  {
    name: "Class 1",
    present: 4000,
    absent: 2400,
  },
  {
    name: "Class 2",
    present: 3000,
    absent: 1398,
  },
  {
    name: "Class 3",
    present: 2000,
    absent: 9800,
  },
  {
    name: "Class 4",
    present: 2780,
    absent: 3908,
  },
  {
    name: "Class 5",
    present: 1890,
    absent: 4800,
  },
  {
    name: "Class 6",
    present: 2390,
    absent: 3800,
  },
  {
    name: "Class 7",
    present: 3490,
    absent: 4300,
  },
];

const PrincipalHomePage = () => {
  return (
    <MainLayout>
      <div>
        <h2>principaldashboard</h2>
        Class with respect to attendence:


        <BarChart width={730} height={250} data={barchatData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="absent" fill="#8884d8" />
          <Bar dataKey="present" fill="#82ca9d" />
        </BarChart>
      </div>
    </MainLayout>
  );
};

export default PrincipalHomePage;
