import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "../../layout/MainLayout";
import { useSelector } from "react-redux";


const SelectClassForAttendance = ({setSelectedClassForAttendance}) => {
    const { classes } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [selectedClass, setSelectedClass] = useState("");

  const handleProceed = () => {
    if (selectedClass) {
        setSelectedClassForAttendance(selectedClass);
      navigate("/attendance");
    }
  };

  return (
    <MainLayout>
      <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-8 min-h-screen flex justify-center items-start">
        <div className="bg-white p-8 rounded-lg shadow-lg border border-purple-300 w-full max-w-md">
          <h1 className="text-3xl font-bold text-purple-800 text-center">Select Class</h1>
          <p className="mt-4 text-gray-700 text-center">Choose a class to proceed with attendance.</p>

          <div className="mt-6">
            <label className="block text-purple-700 font-semibold mb-2">Select Class:</label>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-full p-3 border border-purple-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-800"
            >
              <option value="">-- Select Class --</option>
              {
                classes.length > 0 && classes.map((item) => (
                    <option key={item.id} value={item.id}>{item.class_name}({item.class_code})</option>
                ))
              }

            </select>
          </div>

          <button
            onClick={handleProceed}
            disabled={!selectedClass}
            className="flex justify-self-center mt-10 px-4 py-1.5 bg-purple-800 text-white text-lg font-semibold rounded-lg hover:bg-purple-900 transition disabled:opacity-50"
          >
            Proceed to Attendance
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default SelectClassForAttendance;