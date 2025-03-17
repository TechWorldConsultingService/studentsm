import React, { useState } from "react";

const TaskForm = ({ addTask }) => {
  const [task, setTask] = useState({
    title: "",
    priority: "medium",
    due_date: "",
  });

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!task.title.trim()) return;
    addTask(task);
    setTask({ title: "", priority: "medium", due_date: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="flex space-x-2 mb-4">
      <input
        type="text"
        placeholder="Task title"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        className="p-2 border rounded w-full"
      />
      <input
        type="date"
        value={task.due_date}
        onChange={(e) => setTask({ ...task, due_date: e.target.value })}
        className="p-2 border rounded"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add
      </button>
    </form>
  );
};

export default TaskForm;
