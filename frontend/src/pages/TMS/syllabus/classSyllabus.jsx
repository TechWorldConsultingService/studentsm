import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import toast from "react-hot-toast";

// Layout + Components
import ClassLayout from "../../../layout/ClassLayout";
import Spinner from "../../../components/Spinner";
import CheckIcon from "../../../components/CheckIcon";
import SyllabusModal from "./SyllabusModal";
import DeleteSyllabusModal from "./DeleteSyllabusModal";

// A simple message card
const MessageCard = ({ title, message, onRetry, variant = "error" }) => {
  const iconColor = variant === "error" ? "text-red-500" : "text-purple-500";

  return (
    <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 text-center mx-auto max-w-md mt-8">
      <div className="mb-4">
        <svg
          className={`w-12 h-12 mx-auto ${iconColor}`}
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
};

const ClassSyllabus = () => {
  const {
    access,
    id: teacher_id,
    selectedClassName,
  } = useSelector((state) => state.user);

  // -- State --
  const [subjectList, setSubjectList] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");

  const [syllabusData, setSyllabusData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [noSyllabusFound, setNoSyllabusFound] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedSyllabusForEdit, setSelectedSyllabusForEdit] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSyllabusForDelete, setSelectedSyllabusForDelete] =
    useState(null);

  // ========== Fetch Subjects ==========
  useEffect(() => {
    if (access && teacher_id && selectedClassName) {
      fetch(
        `http://localhost:8000/api/filter-subjects/?teacher=${teacher_id}&class_assigned=${selectedClassName}`
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
    }
  }, [access, teacher_id, selectedClassName]);

  // ========== Fetch Syllabus ==========
  const fetchSyllabusData = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    if (!selectedSubject) return;

    try {
      setIsLoading(true);
      setErrorMessage("");
      setNoSyllabusFound(false);

      const response = await axios.get(
        `http://localhost:8000/api/syllabus/filter/?subject_id=${selectedSubject}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );

      // If we get a valid array, we store it
      setSyllabusData(response.data || []);

      // If the data array is empty, we’ll consider that “No Syllabus Found”
      if (!response.data || response.data.length === 0) {
        setNoSyllabusFound(true);
      }
    } catch (error) {
      // If the server returned a custom error message
      const serverMsg = error?.response?.data?.message ?? "";
      if (serverMsg.includes("No syllabus found for this subject")) {
        // We treat that as an expected “No Syllabus Found” case
        setNoSyllabusFound(true);
        setSyllabusData([]);
      } else {
        // Otherwise, store the error message
        setErrorMessage("Error fetching syllabus: " + serverMsg);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch whenever subject changes
  useEffect(() => {
    if (selectedSubject) {
      fetchSyllabusData();
    }
  }, [selectedSubject]);

  // ================= TOGGLE COMPLETION =================
  const patchSyllabusCompletion = async (syllabusId, patchData) => {
    if (!access) return;
    try {
      await axios.patch(
        `http://localhost:8000/api/syllabus/${syllabusId}/`,
        patchData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        }
      );
    } catch (error) {
      console.error("Patch error:", error);
      toast.error("Failed to update syllabus. Please try again.");
    }
  };

  const buildPatchData = (
    updatedData,
    syllabusId,
    chapterId,
    topicId,
    subtopicId
  ) => {
    const foundSyllabus = updatedData.find((s) => s.id === syllabusId);
    if (!foundSyllabus) return { chapters: [] };

    const foundChapter = foundSyllabus.chapters.find((c) => c.id === chapterId);
    if (!foundChapter) return { chapters: [] };

    const patchData = {
      chapters: [
        {
          id: chapterId,
          is_completed: foundChapter.is_completed,
          topics: [],
        },
      ],
    };

    if (topicId !== null) {
      const foundTopic = foundChapter.topics.find((t) => t.id === topicId);
      if (!foundTopic) return patchData;

      const topicObj = {
        id: topicId,
        is_completed: foundTopic.is_completed,
        subtopics: [],
      };

      if (subtopicId !== null) {
        const foundSubtopic = foundTopic.subtopics.find(
          (sub) => sub.id === subtopicId
        );
        if (foundSubtopic) {
          topicObj.subtopics.push({
            id: subtopicId,
            is_completed: foundSubtopic.is_completed,
          });
        }
      }
      patchData.chapters[0].topics.push(topicObj);
    }

    return patchData;
  };

  const toggleCompletion = (
    syllabusId,
    chapterId,
    topicId = null,
    subtopicId = null
  ) => {
    setSyllabusData((prevData) => {
      const updatedData = prevData.map((syllabus) => {
        if (syllabus.id === syllabusId) {
          const updatedChapters = syllabus.chapters.map((chapter) => {
            if (chapter.id === chapterId) {
              const updatedTopics = chapter.topics.map((topic) => {
                if (topic.id === topicId) {
                  // Toggle subtopic?
                  if (subtopicId !== null) {
                    const updatedSubtopics = topic.subtopics.map((sub) => {
                      if (sub.id === subtopicId) {
                        return { ...sub, is_completed: !sub.is_completed };
                      }
                      return sub;
                    });
                    const allSubtopicsDone = updatedSubtopics.every(
                      (s) => s.is_completed
                    );
                    return {
                      ...topic,
                      subtopics: updatedSubtopics,
                      is_completed: allSubtopicsDone,
                    };
                  }
                  // If no subtopics, toggle entire topic
                  if (topic.subtopics.length === 0) {
                    return { ...topic, is_completed: !topic.is_completed };
                  }
                }
                return topic;
              });

              // If all topics done, mark chapter as complete
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
      });

      // Send patch
      const patchData = buildPatchData(
        updatedData,
        syllabusId,
        chapterId,
        topicId,
        subtopicId
      );
      patchSyllabusCompletion(syllabusId, patchData);

      return updatedData;
    });
  };

  // ================== EDIT / DELETE =================
  // Add/Edit
  const openEditModal = (syllabus) => {
    setSelectedSyllabusForEdit(syllabus); // if null => we interpret as Add
    setShowEditModal(true);
  };

  const handleSyllabusUpdated = () => {
    setShowEditModal(false);
    fetchSyllabusData(); // refresh
    // If we just added a new syllabus, noSyllabusFound becomes false
    setNoSyllabusFound(false);
  };

  // Delete
  const openDeleteModal = (syllabus) => {
    setSelectedSyllabusForDelete(syllabus);
    setShowDeleteModal(true);
  };

  const handleSyllabusDeleted = () => {
    setShowDeleteModal(false);
    // Re-fetch
    fetchSyllabusData();
  };

  // ================== RENDER ==================
  return (
    <ClassLayout>
      <div className="bg-gradient-to-r from-gray-100 to-purple-50 min-h-screen p-8">
        <div className="max-w-5xl mx-auto bg-white p-6 rounded-lg shadow-lg border border-purple-300">
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-purple-800">
                Class Syllabus
              </h1>
              <p className="mt-2 text-gray-600">
                Explore and mark completed chapters, topics, and subtopics.
              </p>
            </div>

            {/* 
               Show "Add Syllabus" button if:
               1) noSyllabusFound is true, OR
               2) syllabusData is empty array
               Otherwise, we hide this button (because user should see Edit/Delete).
            */}
            {(noSyllabusFound || syllabusData.length === 0) && (
              <button
                onClick={() => openEditModal(null)} // Passing null => "Add" mode
                className="mt-4 sm:mt-0 bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
              >
                Add Syllabus
              </button>
            )}
          </div>

          {/* Subject Selector */}
          <div className="mt-6">
            <label className="block text-purple-700 font-semibold mb-1">
              Select Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => {
                setSelectedSubject(e.target.value);
                // Reset local states each time user picks a new subject
                setSyllabusData([]);
                setErrorMessage("");
                setNoSyllabusFound(false);
              }}
              className="w-full p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="">Choose a Subject</option>
              {subjectList.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.subject_name} ({sub.subject_code})
                </option>
              ))}
            </select>
          </div>

          {/* Loading / Error / Syllabus Content */}
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <MessageCard
              title="Oops!"
              message={errorMessage}
              onRetry={fetchSyllabusData}
            />
          ) : (
            <>
              {/* If we have data, show the first syllabus (or map them if multiple) */}
              {syllabusData.length > 0 &&
                syllabusData.map((syllabus) => (
                  <div key={syllabus.id} className="mt-8">
                    {/* Syllabus heading */}
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-semibold text-purple-800">
                        {syllabus.subject_name} - {syllabus.class_name}
                      </h2>
                      <p className="text-gray-600 mt-1">
                        Teacher: {syllabus.teacher_name}
                      </p>
                    </div>

                    {/* Edit / Delete */}
                    <div className="flex justify-center gap-4 mb-4">
                      <button
                        onClick={() => openEditModal(syllabus)}
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                      >
                        Edit Syllabus
                      </button>
                      <button
                        onClick={() => openDeleteModal(syllabus)}
                        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      >
                        Delete Syllabus
                      </button>
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
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={chapter.is_completed || false}
                            readOnly
                            className="mr-3 w-6 h-6 text-purple-700 focus:ring-purple-600 rounded"
                          />
                          <h3
                            className={`text-lg font-bold ${
                              chapter.is_completed
                                ? "text-green-700"
                                : "text-purple-800"
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
                                  topic.is_completed
                                    ? "text-green-700"
                                    : "text-gray-800"
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
                ))}

              {/* If noSyllabusFound is true (and no data), show a user-friendly message */}
              {noSyllabusFound && syllabusData.length === 0 && (
                <MessageCard
                  title="No Syllabus Found"
                  message="Please click on 'Add Syllabus' to create a new one."
                  variant="info"
                />
              )}
            </>
          )}
        </div>
      </div>

      {/* Add/Edit Syllabus Modal */}
      {showEditModal && (
        <SyllabusModal
          // If selectedSyllabusForEdit is null => "Add" mode
          isEdit={!!selectedSyllabusForEdit}
          syllabus={selectedSyllabusForEdit || {}}
          onClose={() => setShowEditModal(false)}
          onSuccess={handleSyllabusUpdated}
        />
      )}

      {/* Delete Syllabus Modal */}
      {showDeleteModal && (
        <DeleteSyllabusModal
          syllabus={selectedSyllabusForDelete}
          handleCloseModal={() => setShowDeleteModal(false)}
          onSyllabusDeleted={handleSyllabusDeleted}
        />
      )}
    </ClassLayout>
  );
};

export default ClassSyllabus;
