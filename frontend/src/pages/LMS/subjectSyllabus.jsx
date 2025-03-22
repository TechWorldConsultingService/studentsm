import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import SubjectLayout from "../../layout/SubjectLayout";
import Spinner from "../../components/Spinner";

const MessageCard = ({ title, message, onRetry }) => (
  <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 text-center mx-auto max-w-md">
    <div className="mb-4">
      <svg
        className="w-12 h-12 mx-auto text-red-500"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 mb-4">{message}</p>
    {onRetry && (
      <button
        onClick={onRetry}
        className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded"
      >
        Retry
      </button>
    )}
  </div>
);

const SubtopicItem = ({ sub }) => (
  <div
    className={`p-2 rounded border ${
      sub.is_completed ? "border-green-300 bg-green-50" : "border-gray-100 bg-gray-50"
    }`}
  >
    <label className="flex items-center">
      <input type="checkbox" disabled checked={sub.is_completed} className="mr-2" />
      <span className="text-sm text-gray-700">Subtopic: {sub.name}</span>
    </label>
  </div>
);

const TopicItem = ({ topic }) => (
  <div
    className={`p-3 rounded-lg border ${
      topic.is_completed ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"
    }`}
  >
    <label className="flex items-center">
      <input type="checkbox" disabled checked={topic.is_completed} className="mr-2" />
      <span className="text-base font-semibold text-gray-800">Topic: {topic.name}</span>
    </label>
    {topic.subtopics && topic.subtopics.length > 0 && (
      <div className="ml-4 mt-2 space-y-2">
        {topic.subtopics.map((sub) => (
          <SubtopicItem key={sub.id} sub={sub} />
        ))}
      </div>
    )}
  </div>
);

const ChapterItem = ({ chapter }) => (
  <div
    className={`p-4 rounded-lg border transition duration-300 ease-in-out transform hover:scale-105 ${
      chapter.is_completed ? "border-green-300 bg-green-50" : "border-purple-100 bg-purple-50"
    }`}
  >
    <label className="flex items-center">
      <input type="checkbox" disabled checked={chapter.is_completed} className="mr-2" />
      <h3 className="text-lg font-bold text-purple-800">Chapter: {chapter.name}</h3>
    </label>
    {chapter.topics && chapter.topics.length > 0 && (
      <div className="ml-4 mt-3 space-y-3">
        {chapter.topics.map((topic) => (
          <TopicItem key={topic.id} topic={topic} />
        ))}
      </div>
    )}
  </div>
);

const SubjectSyllabus = () => {
  const [syllabusData, setSyllabusData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { subjectName } = useParams();
  const { access, selectedSubject } = useSelector((state) => state.user);

  const fetchSyllabusData = async () => {
    if (!access) {
      setErrorMessage("User is not authenticated. Please login.");
      return;
    }
    try {
      setIsLoading(true);
      setErrorMessage("");
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
      setErrorMessage("Error fetching syllabus data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (access) {
      fetchSyllabusData();
    }
  }, [access]);

  const filteredSyllabus = syllabusData.filter(
    (item) => item.subject_name === subjectName
  );

  return (
    <SubjectLayout>
      <div className="w-full p-4 bg-purple-50 min-h-screen">
        {isLoading ? (
          <Spinner />
        ) : errorMessage ? (
          <MessageCard
            title="Oops!"
            message={errorMessage}
            onRetry={fetchSyllabusData}
          />
        ) : filteredSyllabus.length > 0 ? (
          <div className="space-y-6">
            <h2 className="text-3xl font-extrabold text-center text-purple-800 mb-8">
              Syllabus for{" "}
              {subjectName.charAt(0).toUpperCase() + subjectName.slice(1)}
            </h2>

            {filteredSyllabus.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-lg shadow-lg border border-purple-300"
              >
                <p className="text-gray-600 mt-1">
                  <strong className="text-purple-700">Teacher:</strong> {item.teacher_name}
                </p>
                <p className="text-gray-600 mt-1">
                  <strong className="text-purple-700">Class:</strong> {item.class_name}
                </p>

                {item.chapters && item.chapters.length > 0 ? (
                  <div className="mt-4 space-y-4">
                    {item.chapters.map((chapter) => (
                      <ChapterItem key={chapter.id} chapter={chapter} />
                    ))}
                  </div>
                ) : (
                  <MessageCard
                    title="No Chapters Found"
                    message="We couldn't locate any chapters for this subject. Please check back later or try refreshing."
                    onRetry={fetchSyllabusData}
                  />
                )}

              </div>
            ))}
          </div>
        ) : (
          <MessageCard
            title="No Syllabus Found"
            message="We could not find any syllabus data for this subject. Please ensure the subject name is correct or try again later."
            onRetry={fetchSyllabusData}
          />
        )}
      </div>
    </SubjectLayout>
  );
};

export default SubjectSyllabus;
