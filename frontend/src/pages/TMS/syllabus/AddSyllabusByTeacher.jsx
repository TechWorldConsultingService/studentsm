import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";



const AddSyllabusByTeacher = ({ handleCloseModal }) => {
  const { access, selectedClassID, id: teacher_id, selectedClass } = useSelector((state) => state.user);


    const navigate = useNavigate();
  
  const [subjectList, setSubjectList] = useState ([])
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [chapterName, setChapterName] = useState("");
  const [topicName, setTopicName] = useState("");
  const [subtopicName, setSubtopicName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


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



  const handleAddChapter = () => {
    if (chapterName.trim() !== "") {
      const newChapter = { id: Date.now(), name: chapterName, topics: [] };
      setChapters([ ...chapters, newChapter]);
      setChapterName("");
      setError("");
    } else {
      setError("Chapter name cannot be empty.");
    }
  };

  const handleAddTopic = (chapterId) => {
    if (topicName.trim() !== "") {
      setChapters(
        chapters.map((chapter) =>
          chapter.id === chapterId
            ? { 
                ...chapter, 
                topics: [...chapter.topics, { id: Date.now(), name: topicName, is_completed: false, subtopics: [] }]
              }
            : chapter
        )
      );
      setTopicName("");
      setError("");
    } else {
      setError("Topic name cannot be empty.");
    }
  };
  

  const handleAddSubtopic = (chapterId, topicId) => {
    if (subtopicName.trim() !== "") {
      setChapters(
        chapters.map((chapter) =>
          chapter.id === chapterId
            ? {
                ...chapter,
                topics: chapter.topics.map((topic) =>
                  topic.id === topicId
                    ? {
                        ...topic,
                        subtopics: [...topic.subtopics, { id: Date.now(), name: subtopicName, is_completed: false }]
                      }
                    : topic
                ),
              }
            : chapter
        )
      );
      setSubtopicName("");
      setError("");
    } else {
      setError("Subtopic name cannot be empty.");
    }
  };
  
  const handleDelete = (type, chapterId, topicId, subtopicId) => {
    if (type === "chapter") {
      setChapters(chapters.filter((chapter) => chapter.id !== chapterId));
    } else if (type === "topic") {
      setChapters(
        chapters.map((chapter) =>
          chapter.id === chapterId
            ? { ...chapter, topics: chapter.topics.filter((topic) => topic.id !== topicId) }
            : chapter
        )
      );
    } else if (type === "subtopic") {
      setChapters(
        chapters.map((chapter) =>
          chapter.id === chapterId
            ? {
                ...chapter,
                topics: chapter.topics.map((topic) =>
                  topic.id === topicId
                    ? { ...topic, subtopics: topic.subtopics.filter((sub) => sub.id !== subtopicId) }
                    : topic
                ),
              }
            : chapter
        )
      );
    }
  };

  const handleEdit = (type, id, newName, chapterId, topicId) => {
    if (newName && newName.trim() !== "") {
      if (type === "chapter") {
        setChapters(
          chapters.map((chapter) => (chapter.id === id ? { ...chapter, name: newName } : chapter))
        );
      } else if (type === "topic") {
        setChapters(
          chapters.map((chapter) =>
            chapter.id === chapterId
              ? {
                  ...chapter,
                  topics: chapter.topics.map((topic) => (topic.id === id ? { ...topic, name: newName } : topic)),
                }
              : chapter
          )
        );
      } else if (type === "subtopic") {
        setChapters(
          chapters.map((chapter) =>
            chapter.id === chapterId
              ? {
                  ...chapter,
                  topics: chapter.topics.map((topic) =>
                    topic.id === topicId
                      ? {
                          ...topic,
                          subtopics: topic.subtopics.map((sub) =>
                            sub.id === id ? { ...sub, name: newName } : sub
                          ),
                        }
                      : topic
                  ),
                }
              : chapter
          )
        );
      }
      setError("");
    } else {
      setError("Name cannot be empty.");
    }
  };

  const addSyllabus = async (payload) => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }

    try {
      await axios.post("http://localhost:8000/api/syllabus/", payload, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      toast.success("Syllabus Added Successfully.");
      setError("");
      // fetchSubjects();  
      handleCloseModal();  
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        setError("Error submitting syllabus.")
      }
    }
  }

  const handleSubmit = () => {
    if (chapters.length === 0) {
      setError("Please add at least one chapter before submitting.");
      return;
    }

    const payload = {
      class_assigned: selectedClassID,
      subject: selectedSubject,
      chapters: chapters.map((chapter) => ({
        name: chapter.name,
        topics: chapter.topics.map((topic) => ({
          name: topic.name,
          is_completed: topic.is_completed,
          subtopics: topic.subtopics.map((sub) => ({
            name: sub.name,
            is_completed: sub.is_completed
          }))
        }))
      }))
    };

   addSyllabus(payload)

   
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
    <div className="bg-white p-8 rounded-lg shadow-lg  w-11/12 md:w-2/3 max-h-[90vh] overflow-y-auto">
        <h2 className="text-3xl mb-8 font-extrabold text-purple-800">Create New Syllabus</h2>

      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}
      {success && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">{success}</div>}

    {/* Subject select */}
    <div className="flex flex-col p-2">
          <label className="text-purple-700 font-semibold">Subject</label>
          <select
            id="subject"
            name="subject"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="mt-2 p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">Select Subject</option>
            {subjectList.length > 0 ? (
              subjectList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.subject_name}
                </option>
              ))
            ) : (
              <option disabled value="">No subjects available</option>
            )}
          </select>
        </div>

      {chapters.map((chapter) => (
        <div key={chapter.id} className="mb-6 bg-purple-50 p-4 rounded-xl border border-purple-200">
          <div className="flex justify-between items-center mb-3">
            <span className='text-purple-800'>Chapter: <strong> {chapter.name}</strong></span>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit("chapter", chapter.id, prompt("Edit Chapter Name", chapter.name))}
                className="text-purple-600 hover:text-purple-800"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete("chapter", chapter.id)}
                className="text-red-500 hover:text-red-700"
              >
                Delete
              </button>
            </div>
          </div>

          <div className="ml-4">

          {chapter.topics.map((topic) => (
              <div key={topic.id} className="mb-4 bg-white p-3 rounded-lg border border-purple-100">
                <div className="flex justify-between items-center mb-2">
                <span className='text-purple-800'>Topic:  {topic.name}</span>
                <div className="space-x-2">
                    <button
                      onClick={() => handleEdit("topic", topic.id, prompt("Edit Topic", topic.name), chapter.id)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete("topic", chapter.id, topic.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {topic.subtopics.map((subtopic) => (
                    <div key={subtopic.id} className="ml-4 mb-2 flex justify-between items-center bg-gray-50 p-2 rounded border border-gray-200">
                <span className='text-purple-800 text-sm'>Sub-topic:  {subtopic.name}</span>
                <div className="space-x-2">
                        <button
                          onClick={() => handleEdit("subtopic", subtopic.id, prompt("Edit Subtopic", subtopic.name), chapter.id, topic.id)}
                          className="text-purple-600 hover:text-purple-800"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete("subtopic", chapter.id, topic.id, subtopic.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}

                <div className="ml-4">
                  <div className="flex gap-4 mb-3">
                    <input
                      type="text"
                      placeholder="Subtopic Name"
                      value={subtopicName}
                      onChange={(e) => setSubtopicName(e.target.value)}
                      className="flex-1 p-2 border-2 border-purple-200 rounded-lg focus:border-purple-500"
                    />
                    <button
                      onClick={() => handleAddSubtopic(chapter.id, topic.id)}
                      className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800"
                    >
                      Add Subtopic
                    </button>
                  </div>


                </div>
              </div>
            ))}

            
            <div className="flex gap-4 mb-4">
              <input
                type="text"
                placeholder="Topic Name"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                className="flex-1 p-2 border-2 border-purple-200 rounded-lg focus:border-purple-500"
              />
              <button
                onClick={() => handleAddTopic(chapter.id)}
                className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-purple-800"
              >
                Add Topic
              </button>
            </div>


          </div>
        </div>
      ))}

      <div className="flex flex-col p-2">
        <label className='font-semibold text-purple-800 '>Chapter Name:</label>
        <div className="w-full flex items-center space-x-3  mb-6">
        <input
          type="text"
          placeholder="Chapter Name"
          value={chapterName}
          onChange={(e) => setChapterName(e.target.value)}
          className="mt-2 w-full p-2 rounded-lg border border-purple-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
        <button
          onClick={handleAddChapter}
          className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 transition-colors"
        >
          Add Chapter
        </button>
        </div>
      
      </div>



      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={handleCloseModal}
          className="px-6 py-2 border border-purple-700 text-purple-700 rounded-lg hover:bg-purple-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800"
        >
          Submit 
        </button>
      </div>
    </div>
  </div>
    
  );
}

export default AddSyllabusByTeacher;
