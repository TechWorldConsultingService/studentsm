import React from 'react';
import { useParams } from 'react-router-dom';

const ClassHome = () => {
  const { classes } = useParams();

  return (
    <div className="bg-purple-50 p-6 ">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">
        Class  {classes.charAt(0).toUpperCase() + classes.slice(1)} Page
        </h1>
        <p className="mt-4 text-gray-600">
          Welcome to the {classes.charAt(0).toUpperCase() + classes.slice(1)} Class Page. 
          Here, you can access all the resources and assignments related to this class.
        </p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-purple-700">What's Next?</h2>
          <p className="text-gray-600 mt-2">
            Explore the syllabus, assignments, and other important resources related to the {classes} Class.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none">
            Explore {classes.charAt(0).toUpperCase() + classes.slice(1)}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClassHome;
