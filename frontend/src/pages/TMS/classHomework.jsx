import React, { useState, useEffect } from "react";
import NewAssignment from "./NewAssignment";
import { useSelector } from "react-redux";
import useFetchData from "../../hooks/useFetch";
import { Link } from "react-router-dom";


const ClassHomework = () => {
  const [newHomeworkModal, setNewHomeworkModal] = useState(false);
  const [previousAssignments, setPreviousAssignments] = useState([]);
  const [runningAssignments, setRunningAssignments] = useState([]);
  const user = useSelector((state) => state.user);
  const { access } = user;
  const teacher_id = user?.id;
  const selectedClass = user?.selectedClass;
  const [subjects, setSubjects] = useState([]);

  const todayDate = new Date().toISOString().split("T")[0];

  const { fetchedData: homeworkList = [], loadingData, fetchData:fetchHomeworkList } = useFetchData(
    "http://localhost:8000/api/teacher/assignments/"
  );

  useEffect(() => {
    if (access && teacher_id && selectedClass) {
      fetch(
        `http://localhost:8000/api/filter-subjects/?teacher=${teacher_id}&class_assigned=${selectedClass}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data?.subjects) {
            setSubjects(data.subjects);
          }
        })
        .catch((error) => {
          console.error("Error fetching subjects:", error);
        });
    } else {
      console.error("Teacher ID or class is undefined");
    }
  }, [access, teacher_id, selectedClass]);

  useEffect(() => {
    if (homeworkList && todayDate) {
      const running = []
      const previous = []

      homeworkList.forEach((homework) => {
        const dueDate = new Date(homework.due_date)
        const today = new Date(todayDate)

        if (dueDate >= today) {
          running.push(homework);
        } else {
          previous.push(homework);
        }
      });

      setRunningAssignments(running)
      setPreviousAssignments(previous)
    }
}, [homeworkList, todayDate])

  const toggleNewHomeworkModal = () => setNewHomeworkModal(!newHomeworkModal);

  if (loadingData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="bg-purple-50 p-6">
      <div className="bg-white p-6 rounded-lg shadow-lg border border-purple-300">
        <h1 className="text-3xl font-extrabold text-purple-800">
          Class Homework
        </h1>

        {/* New Assignment Button */}
        <div className="mt-6 text-center">
          <button
            onClick={toggleNewHomeworkModal}
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 focus:outline-none"
          >
            Create New Assignment
          </button>
        </div>

        {/* Running Assignments Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-purple-700">
            Running Assignments
          </h2>
          {runningAssignments.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {runningAssignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="p-4 border rounded-lg shadow-md hover:shadow-lg"
                >
                  <span className="flex ">
                    <strong className="block text-purple-800 mr-2">
                      Subject:
                    </strong>
                    {assignment.subject}
                  </span>
                  <span className="flex ">
                    <strong className="block text-purple-800 mr-2">
                      Topic:
                    </strong>
                    {assignment.assignment_name}
                  </span>
                  <span className="flex ">
                    <strong className="block text-purple-800 mr-2">
                      Description:
                    </strong>
                    <p className="italic"> {assignment.description}</p>
                  </span>
                  <span className="text-gray-500 block mt-2">
                    Due: {assignment.due_date}
                  </span>
                  <span className="text-gray-500 block ">
                    Assign Date: {" "}
                    {
                      new Date(assignment.assigned_on)
                        .toISOString()
                        .split("T")[0]
                    }
                  </span>
                  <a
                    href={`/submissions/${assignment.id}`}
                    className="text-purple-700 hover:underline mt-2 block"
                  >
                    View Submissions
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No running assignments.</p>
          )}
        </div>

        {/* Previously Given Assignments Section */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-purple-700">
            Previously Given Assignments
          </h2>
          {previousAssignments.length > 0 ? (
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {previousAssignments.map((assignment) => (
                <li
                  key={assignment.id}
                  className="p-4 border rounded-lg shadow-md hover:shadow-lg"
                >
                  <span className="flex ">
                    <strong className="block text-purple-800 mr-2">
                      Subject:
                    </strong>
                    {assignment.subject}
                  </span>
                  <span className="flex ">
                    <strong className="block text-purple-800 mr-2">
                      Topic:
                    </strong>
                    {assignment.assignment_name}
                  </span>
                  <span className="flex ">
                    <strong className="block text-purple-800 mr-2">
                      Description:
                    </strong>
                    <p className="italic"> {assignment.description}</p>
                  </span>
                  <span className="text-gray-500 block mt-2">
                    Due: {assignment.due_date}
                  </span>
                  <span className="text-gray-500 block ">
                    Assign Date:{" "}
                    {
                      new Date(assignment.assigned_on)
                        .toISOString()
                        .split("T")[0]
                    }
                  </span>
                  <Link
                    href={`/submissions/${assignment.id}`}
                    className="text-purple-700 hover:underline mt-2 block"
                  >
                    View Submissions
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No previously given assignments.</p>
          )}
        </div>

        {/* New Homework Modal */}
        {newHomeworkModal && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-1/2 max-h-[90vh] overflow-y-auto relative">
              <button
                onClick={toggleNewHomeworkModal}
                className="absolute top-2 text-2xl right-2 text-purple-700 hover:text-purple-900"
              >
                X
              </button>

              <NewAssignment
                closeModal={toggleNewHomeworkModal}
                access={access}
                subjects={subjects}
                selectedClass={selectedClass}
                fetchHomeworkList={fetchHomeworkList}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassHomework;
