import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaGripVertical } from "react-icons/fa";
import { useSelector } from "react-redux";
import MainLayout from "../../layout/MainLayout";
import TaskForm from "./TaskForm"; // Import TaskForm
import "./TodoListPage.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const { access } = useSelector((state) => state.user);

  // Fetch tasks on component mount
  useEffect(() => {
    axios.get('http://localhost:8000/api/tasks/', {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
    }).then((res) => setTasks(res.data));
  }, [access]);

  // Add a new task (Callback for TaskForm)
  const handleAddTask = (newTask) => {
    axios.post("http://localhost:8000/api/tasks/", newTask, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access}`,
      },
    }).then((res) => {
      setTasks([...tasks, res.data]);
    });
  };

  // Delete a task
  const handleDeleteTask = (taskId) => {
    axios.delete(`http://localhost:8000/api/tasks/${taskId}/`, {
      headers: {
        Authorization: `Bearer ${access}`,
        "Content-Type": "application/json",
      },
    }).then(() => {
      setTasks(tasks.filter((task) => task.id !== taskId));
    });
  };

  // Handle drag start
  const handleDragStart = (event, index) => {
    event.dataTransfer.setData("index", index);
  };

  // Handle drop and reorder
  const handleDrop = (event, targetIndex) => {
    const sourceIndex = event.dataTransfer.getData("index");
    if (sourceIndex === targetIndex) return;

    const reorderedTasks = [...tasks];
    const [movedItem] = reorderedTasks.splice(sourceIndex, 1);
    reorderedTasks.splice(targetIndex, 0, movedItem);
    setTasks(reorderedTasks);

    // Update order in the backend
    reorderedTasks.forEach((task, index) => {
      if (task.order !== index) {
        axios.patch(`http://localhost:8000/api/tasks/${task.id}/`, { order: index }, {
          headers: {
            Authorization: `Bearer ${access}`,
          },
        });
      }
    });
  };

  return (
    <MainLayout>
      <div className="p-5 bg-gray-100 min-h-screen">
        <div className="bg-white p-5 rounded shadow-md">
          <h2 className="text-xl font-semibold mb-4">To-Do Lists</h2>

          {/* TaskForm Component */}
          <TaskForm addTask={handleAddTask} />

          {/* Task List */}
          <div>
            {tasks.map((task, index) => (
              <div
                key={task.id}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => handleDrop(e, index)}
                className="flex justify-between items-center bg-white p-3 rounded shadow-md mb-2 border-l-4"
              >
                {/* Drag Handle */}
                <div className="mr-3">
                  <FaGripVertical className="cursor-move" />
                </div>

                {/* Task Content */}
                <div className="flex-1">
                  <div className="font-semibold">{task.title}</div>
                  <div className="text-sm text-gray-500">{task.due_date}</div>
                </div>

                {/* Delete Button */}
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 p-1"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default TaskList;
