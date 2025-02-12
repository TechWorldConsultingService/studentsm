// ClassSyllabus.js

import React, { useState, useEffect } from "react";
import AddSyllabusByTeacher from "./AddSyllabusByTeacher";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

// A small check icon for completed items
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

const ClassSyllabus = () => {
  const navigate = useNavigate();
  const { access, selectedClassID, id: teacher_id, selectedClass } = useSelector(
    (state) => state.user
  );

  const [syllabusData, setSyllabusData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  // Fetch subjects for the logged-in teacher & selected class
  useEffect(() => {
    if (access && teacher_id && selectedClass) {
      fetch(
        `http://localhost:8000/api/filter-subjects/?teacher=${teacher_id}&class_assigned=${selectedClass}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data?.subjects) {
            setSubjectList(data.subjects);
          }
        })
        .catch((error) => {
          console.error("Error fetching subjects:", error);
        });
    } else {
      console.error("Teacher ID or class is undefined");
    }
  }, [access, teacher_id, selectedClass]);

  // Fetch syllabus data when a subject is selected
  const fetchSyllabusData = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    if (!selectedSubject) return;

    try {
      const response = await axios.get(
        `http://localhost:8000/api/syllabus/filter/?subject_id=${selectedSubject}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
      setSyllabusData(response.data); // The API returns an array
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error fetching syllabus: " + (error.message || error));
      }
    }
  };

  // Call fetch when subject changes
  useEffect(() => {
    if (selectedSubject) fetchSyllabusData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubject]);

  // Toggle completion state locally
  const toggleCompletion = (
    syllabusId,
    chapterId,
    topicId = null,
    subtopicId = null
  ) => {
    setSyllabusData((prevData) =>
      prevData.map((syllabus) => {
        if (syllabus.id === syllabusId) {
          const updatedChapters = syllabus.chapters.map((chapter) => {
            if (chapter.id === chapterId) {
              const updatedTopics = chapter.topics.map((topic) => {
                if (topic.id === topicId) {
                  // Toggling a subtopic
                  if (subtopicId !== null) {
                    const updatedSubtopics = topic.subtopics.map((subtopic) => {
                      if (subtopic.id === subtopicId) {
                        return {
                          ...subtopic,
                          is_completed: !subtopic.is_completed,
                        };
                      }
                      return subtopic;
                    });
                    // A topic is complete if all its subtopics are complete
                    const allSubtopicsDone = updatedSubtopics.every(
                      (s) => s.is_completed
                    );
                    return {
                      ...topic,
                      subtopics: updatedSubtopics,
                      is_completed: allSubtopicsDone,
                    };
                  }
                  // Toggling a topic with no subtopics
                  if (topic.subtopics.length === 0) {
                    return {
                      ...topic,
                      is_completed: !topic.is_completed,
                    };
                  }
                }
                return topic;
              });

              // A chapter is complete if all its topics are complete
              const allTopicsDone = updatedTopics.every((t) => t.is_completed);
              return {
                ...chapter,
                topics: updatedTopics,
                is_completed: allTopicsDone,
              };
            }
            return chapter;
          });
          return { ...syllabus, chapters: updatedChapters };
        }
        return syllabus;
      })
    );
  };

  return (
    <div className="bg-gradient-to-r from-gray-100 to-purple-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
          <div>
            <h1 className="text-3xl font-extrabold text-purple-800">Class Syllabus</h1>
            <p className="mt-2 text-gray-600">
              Explore and mark completed chapters, topics, and subtopics.
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="mt-4 sm:mt-0 bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
          >
            Add Syllabus
          </button>
        </div>

        {/* Subject selector */}
        <div className="mt-6">
          <label className="block text-purple-700 font-semibold mb-1">
            Select Subject
          </label>
          <select
            id="subject"
            name="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="w-full p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">-- Choose a Subject --</option>
            {subjectList.length > 0 ? (
              subjectList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.subject_name}
                </option>
              ))
            ) : (
              <option disabled value="">
                No subjects available
              </option>
            )}
          </select>
        </div>

        {/* Syllabus data */}
        {syllabusData.length > 0 ? (
          syllabusData.map((syllabus) => (
            <div key={syllabus.id} className="mt-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-purple-800">
                  {syllabus.subject_name} - {syllabus.class_name}
                </h2>
                <p className="text-gray-600 mt-1">Teacher: {syllabus.teacher_name}</p>
              </div>

              {/* Chapters */}
              {syllabus.chapters.map((chapter) => (
                <div
                  key={chapter.id}
                  className={`p-4 mb-6 rounded-xl shadow-md border ${
                    chapter.is_completed
                      ? "border-green-300 bg-green-50"
                      : "border-purple-200 bg-purple-50"
                  }`}
                >
                  {/* Chapter */}
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={chapter.is_completed || false}
                      readOnly
                      className="mr-3 w-6 h-6 text-purple-700 focus:ring-purple-600 rounded"
                    />
                    <h3
                      className={`text-lg font-bold ${
                        chapter.is_completed ? "text-green-700" : "text-purple-800"
                      }`}
                    >
                      Chapter: {chapter.name}
                      {chapter.is_completed && <CheckIcon />}
                    </h3>
                  </label>

                  {/* Topics */}
                  {chapter.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="ml-6 mt-3 p-3 bg-white rounded-lg shadow-sm border border-gray-300"
                    >
                      <label className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={topic.is_completed || false}
                          onChange={() =>
                            toggleCompletion(
                              syllabus.id,
                              chapter.id,
                              topic.id
                            )
                          }
                          className="mr-3 w-5 h-5 text-purple-600 focus:ring-purple-500 rounded"
                        />
                        <span
                          className={`text-base font-semibold ${
                            topic.is_completed ? "text-green-700" : "text-gray-800"
                          }`}
                        >
                          Topic: {topic.name}
                          {topic.is_completed && <CheckIcon />}
                        </span>
                      </label>

                      {/* Subtopics */}
                      {topic.subtopics.map((subtopic) => (
                        <div
                          key={subtopic.id}
                          className="ml-6 mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={subtopic.is_completed || false}
                              onChange={() =>
                                toggleCompletion(
                                  syllabus.id,
                                  chapter.id,
                                  topic.id,
                                  subtopic.id
                                )
                              }
                              className="mr-3 w-4 h-4 text-purple-500 focus:ring-purple-400 rounded"
                            />
                            <span
                              className={`text-sm ${
                                subtopic.is_completed
                                  ? "font-semibold text-green-700"
                                  : "text-gray-700"
                              }`}
                            >
                              Subtopic: {subtopic.name}
                              {subtopic.is_completed && <CheckIcon />}
                            </span>
                          </label>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))
        ) : (
          <p className="mt-8 text-red-500">
            No syllabus found for this subject.
          </p>
        )}

        {/* Modal for adding new syllabus */}
        {showModal && (
          <AddSyllabusByTeacher
            handleCloseModal={() => setShowModal(false)}
            fetchSyllabus={fetchSyllabusData}
          />
        )}
      </div>
    </div>
  );
};

export default ClassSyllabus;
