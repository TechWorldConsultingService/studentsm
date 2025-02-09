// ClassSyllabus.js
import React, { useState, useEffect } from "react";
import AddSyllabusByTeacher from "./AddSyllabusByTeacher";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useSelector } from "react-redux";
import toast from "react-hot-toast";



const ClassSyllabus = () => {
    const navigate = useNavigate();
    const { access, selectedClassID, id: teacher_id, selectedClass } = useSelector((state) => state.user);

  const [syllabusData, setSyllabusData] = useState(null);
  const [showModal, setShowModal] = useState(false);




   // fetch syllabus
   const fetchSyllabusData = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      const { data } = await axios.get("http://localhost:8000/api/subjects/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      // setSyllabusData(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error('Error fetching subjects:', error.message || error);
      }
    } 
  };

  useEffect(() => {
    fetchSyllabusData();
  }, [access, navigate]);

  useEffect(() => {
    const data = {
      id: 9,
      class_assigned: 4,
      class_name: "four",
      subject: 3,
      subject_name: "Nepali",
      teacher: 20,
      teacher_name: "akashdai@12",
      chapters: [
        {
          id: 1,
          name: "Algebra Basics",
          is_completed: false,
          topics: [
            {
              id: 1,
              name: "Linear Equations",
              is_completed: false,
              subtopics: [
                { id: 1, name: "Solving Equations", is_completed: false },
                { id: 2, name: "Graphing Equations", is_completed: false },
              ],
            },
            {
              id: 2,
              name: "Quadratic Equations",
              is_completed: false,
              subtopics: [], // Topic without subtopics
            },
          ],
        },
        {
          id: 2,
          name: "Geometry Essentials",
          is_completed: false,
          topics: [
            {
              id: 3,
              name: "Triangles",
              is_completed: false,
              subtopics: [
                { id: 5, name: "Pythagorean Theorem", is_completed: false },
                { id: 6, name: "Properties of Triangles", is_completed: false },
              ],
            },
            {
              id: 4,
              name: "Circles",
              is_completed: false,
              subtopics: [], // Topic without subtopics
            },
          ],
        },
      ],
      created_at: "2025-02-04T06:55:15.018779Z",
      updated_at: "2025-02-04T06:55:15.018779Z",
    };
    setSyllabusData(data);
  }, []);

  const toggleCompletion = (chapterId, topicId = null, subtopicId = null) => {
    setSyllabusData((prevData) => {
      const updatedChapters = prevData.chapters.map((chapter) => {
        if (chapter.id === chapterId) {
          const updatedTopics = chapter.topics.map((topic) => {
            if (topic.id === topicId || topicId === null) {
              if (subtopicId !== null) {
                topic.subtopics = topic.subtopics.map((subtopic) => {
                  if (subtopic.id === subtopicId) {
                    subtopic.is_completed = !subtopic.is_completed;
                  }
                  return subtopic;
                });
                topic.is_completed = topic.subtopics.every(
                  (sub) => sub.is_completed
                );
              } else if (topic.subtopics.length === 0) {
                topic.is_completed = !topic.is_completed;
              }
              return { ...topic };
            }
            return topic;
          });

          chapter.is_completed = updatedTopics.every(
            (top) => top.is_completed
          );

          return { ...chapter, topics: updatedTopics };
        }
        return chapter;
      });
      return { ...prevData, chapters: updatedChapters };
    });
  };

  return (
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">Class Syllabus</h1>
        <p className="mt-4 text-gray-600">
          Explore the syllabus and topics for your class here.
        </p>

        <div className="mt-6">
          <h2 className="text-xl font-semibold text-purple-700">Syllabus Details</h2>
          <p className="text-gray-600 mt-2">
            Browse through the syllabus added by your teacher. Click on "Add Syllabus" to add new syllabus.
          </p>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
          >
            Add Syllabus
          </button>
        </div>

        {syllabusData && (
          <div className="mt-6 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-purple-800">
                {syllabusData.subject_name} - {syllabusData.class_name}
              </h2>
              <p className="text-gray-600 mt-1">Teacher: {syllabusData.teacher_name}</p>
            </div>

            {syllabusData.chapters.map((chapter) => (
              <div
                key={chapter.id}
                className="bg-purple-50 p-4 rounded-xl shadow-md border border-purple-300"
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={chapter.is_completed}
                    readOnly
                    className="mr-3 w-6 h-6 text-purple-700 focus:ring-purple-600 rounded"
                  />
                  <h3
                    className={`text-xl font-bold ${
                      chapter.is_completed
                        ? "line-through text-gray-400"
                        : "text-purple-800"
                    }`}
                  >
                    {chapter.name}
                  </h3>
                </label>

                {chapter.topics.map((topic) => (
                  <div
                    key={topic.id}
                    className="ml-4 mt-3 p-3 bg-white rounded-lg shadow-sm border border-gray-300"
                  >
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={topic.is_completed}
                        onChange={() => toggleCompletion(chapter.id, topic.id)}
                        className="mr-3 w-5 h-5 text-purple-600 focus:ring-purple-500 rounded"
                      />
                      <span
                        className={`text-lg font-medium ${
                          topic.is_completed
                            ? "line-through text-gray-400"
                            : "text-gray-800"
                        }`}
                      >
                        {topic.name}
                      </span>
                    </label>

                    {topic.subtopics.map((subtopic) => (
                      <div
                        key={subtopic.id}
                        className="ml-6 mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={subtopic.is_completed}
                            onChange={() =>
                              toggleCompletion(
                                chapter.id,
                                topic.id,
                                subtopic.id
                              )
                            }
                            className="mr-3 w-4 h-4 text-purple-500 focus:ring-purple-400 rounded"
                          />
                          <span
                            className={`text-md ${
                              subtopic.is_completed
                                ? "line-through text-gray-400"
                                : "text-gray-700"
                            }`}
                          >
                            {subtopic.name}
                          </span>
                        </label>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {showModal && (
          <AddSyllabusByTeacher
            handleCloseModal={() => setShowModal(false)}
            fetchSyllabus={() => console.log("Fetching syllabus...")}
          />
        )}
      </div>
    </div>
  );
};

export default ClassSyllabus;