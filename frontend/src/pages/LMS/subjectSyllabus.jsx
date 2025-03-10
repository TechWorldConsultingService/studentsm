import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SubjectLayout from "../../layout/SubjectLayout";

const CheckIcon = () => (
  <svg
    className="w-4 h-4 inline-block ml-1"
    fill="none"
    stroke="currentColor"
    strokeWidth={3}
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
  </svg>
);

const SubjectSyllabus = () => {
  const [syllabusData, setSyllabusData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { subject } = useParams();
  const { access,  selectedSubject } = useSelector((state) => state.user);

  const fetchSyllabusData = async () => {
    if (!access) {
      setErrorMessage("User is not authenticated. Please login.");
      return;
    }
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        `http://localhost:8000/api/syllabus/filter/?subject_id=${selectedSubject}`,
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
    if (access) {
      fetchSyllabusData();
    }
  }, [access]);

  // Filter syllabus by subject in URL param
  const filteredSyllabus = syllabusData.filter(
    (item) => item.subject_name.toLowerCase() === subject.toLowerCase()
  );

  return (
    <SubjectLayout >
    <div className="w-full p-4 bg-purple-50 min-h-screen">
      {isLoading ? (
        <p className="text-center text-blue-500 font-semibold">Loading...</p>
      ) : filteredSyllabus.length > 0 ? (
        <div className="space-y-6">
          <h2 className="text-3xl font-extrabold text-center text-purple-800 mb-8">
            Syllabus for{" "}
            {subject.charAt(0).toUpperCase() + subject.slice(1)}
          </h2>

          {filteredSyllabus.map((item) => (
            <div
              key={item.id}
              className="bg-white p-6 rounded-lg shadow-lg border border-purple-300"
            >
              {/* Basic Info */}
              <p className="text-gray-600 mt-1">
                <strong className="text-purple-700">Teacher:</strong>{" "}
                {item.teacher_name}
              </p>
              <p className="text-gray-600 mt-1">
                <strong className="text-purple-700">Class:</strong>{" "}
                {item.class_name}
              </p>

              {/* Chapters → Topics → Subtopics */}
              {item.chapters && item.chapters.length > 0 ? (
                <div className="mt-4 space-y-4">
                  {item.chapters.map((chapter) => (
                    <div
                      key={chapter.id}
                      className={`p-4 rounded-lg border ${
                        chapter.is_completed
                          ? "border-green-300 bg-green-50"
                          : "border-purple-100 bg-purple-50"
                      }`}
                    >
                      {/* Chapter header */}
                      <h3 className="text-lg font-bold text-purple-800">
                        Chapter: {chapter.name}
                        {chapter.is_completed && <CheckIcon />}
                      </h3>

                      {/* Topics */}
                      {chapter.topics && chapter.topics.length > 0 && (
                        <div className="ml-4 mt-3 space-y-3">
                          {chapter.topics.map((topic) => (
                            <div
                              key={topic.id}
                              className={`p-3 rounded-lg border ${
                                topic.is_completed
                                  ? "border-green-300 bg-green-50"
                                  : "border-gray-200 bg-white"
                              }`}
                            >
                              <h4 className="text-base font-semibold text-gray-800">
                                Topic: {topic.name}
                                {topic.is_completed && <CheckIcon />}
                              </h4>

                              {/* Subtopics */}
                              {topic.subtopics && topic.subtopics.length > 0 && (
                                <div className="ml-4 mt-2 space-y-2">
                                  {topic.subtopics.map((sub) => (
                                    <div
                                      key={sub.id}
                                      className={`p-2 rounded border ${
                                        sub.is_completed
                                          ? "border-green-300 bg-green-50"
                                          : "border-gray-100 bg-gray-50"
                                      }`}
                                    >
                                      <p className="text-sm text-gray-700">
                                        Subtopic: {sub.name}
                                        {sub.is_completed && <CheckIcon />}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-3">No chapters available.</p>
              )}

              {/* Additional Info (Optional) */}
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
      ) : errorMessage ? (
        <p className="text-center text-red-500">{errorMessage}</p>
      ) : (
        <p className="text-center text-gray-500">
          No syllabus found for this subject.
        </p>
      )}
    </div>
    </SubjectLayout>
  );
};

export default SubjectSyllabus;
