import React, { useState } from "react";

const TaskForm = ({ addTask, onClose }) => {
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
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-1/2">
      <h2 className="text-2xl font-bold text-purple-800 mb-4">Add To-do List</h2>
    <form onSubmit={handleSubmit} className="flex flex-col  space-y-2 mb-4">
      <div>
      <label className="block text-gray-700 font-semibold">
              Date:
            </label>        
               <input
        type="date"
        value={task.due_date}
        onChange={(e) => setTask({ ...task, due_date: e.target.value })}
        className="p-2 border rounded"
      />
      </div>
<div>
<label className="block text-gray-700 font-semibold">
              Task Details:
            </label> 
            <textarea
        placeholder="Enter Task"
        value={task.title}
        onChange={(e) => setTask({ ...task, title: e.target.value })}
        className="p-2 border rounded w-full"
      />
</div>

 <div className="flex justify-center pt-3 space-x-5">
 <button type="submit" className="bg-purple-800 text-white px-4 py-2 rounded-lg ">
        Add Task
      </button>
      <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
            >
              Cancel
            </button>
 </div>

    </form>
    </div>
    </div>
  );
};

export default TaskForm;
