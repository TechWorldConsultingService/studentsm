import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const SubjectSyllabus = () => {
  const [syllabusData, setSyllabusData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { subject } = useParams();
  const { access, class: userClass } = useSelector((state) => state.user);

  const fetchSyllabusData = async () => {
    if (!access) {
      setErrorMessage("User is not authenticated. Please Login.");
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/api/syllabus/class/${userClass.class_code}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      setSyllabusData(data);
    } catch (error) {
      setErrorMessage("Error fetching syllabus data.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSyllabusData();
  }, [access]);

  const filteredSyllabus = syllabusData.filter(
    (item) => item.subject_name.toLowerCase() === subject.toLowerCase()
  );

  return (
    <div className="w-full p-4 bg-gray-100 min-h-screen">
      {errorMessage ? (
        <p className="text-red-500 text-center">{errorMessage}</p>
      ) : isLoading ? (
        <p className="text-center text-blue-500">Loading...</p>
      ) : filteredSyllabus.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-center text-gray-700">
            Syllabus for {subject.charAt(0).toUpperCase() + subject.slice(1)}
          </h2>

          {filteredSyllabus.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-lg shadow-lg">
              <p className="text-gray-600 mt-2">
                <strong>Teacher: </strong>
                {item.teacher_name}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Class: </strong>
                {item.class_name}
              </p>

              <div className="mt-4">
                <h4 className="text-lg font-medium text-gray-800">Topics</h4>
                <p className="text-gray-600">{item.topics}</p>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-medium text-gray-800">
                  Completed Topics
                </h4>
                <p className="text-gray-600">{item.completed_topics}</p>
              </div>

              <div className="mt-4">
                <h4 className="text-lg font-medium text-gray-800">
                  Completion Percentage
                </h4>
                <p className="text-gray-600">{item.completion_percentage}%</p>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  <strong>Created At:</strong>{" "}
                  {new Date(item.created_at).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Updated At:</strong>{" "}
                  {new Date(item.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">
          No syllabus found for this subject.
        </p>
      )}
    </div>
  );
};

export default SubjectSyllabus;
