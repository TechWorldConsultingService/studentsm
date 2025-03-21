import React from "react";
import { FaTrash, FaCheckCircle, FaClock } from "react-icons/fa";

const TaskItem = ({ task, onDelete, onUpdate, provided }) => {
  const daysLeft = Math.ceil(
    (new Date(task.due_date) - new Date()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      ref={provided.innerRef} // necessary for drag functionality
      className="flex justify-between items-center bg-white p-3 rounded shadow-md mb-2 border-l-4"
      style={{
        borderColor:
          task.priority === "high"
            ? "red"
            : task.priority === "medium"
            ? "orange"
            : "green",
      }}
    >
      {/* Task content */}
      <div>
        <h3 className="text-lg font-semibold">{task.title}</h3>
        <p className="text-sm text-gray-600">{task.description}</p>
        <p className="text-xs text-gray-500">
          {daysLeft >= 0 ? (
            <>
              <FaClock className="inline mr-1 text-yellow-500" />
              {daysLeft} days left
            </>
          ) : (
            <span className="text-red-500">Overdue</span>
          )}
        </p>
      </div>

      {/* Actions (Complete and Delete) */}
      <div className="flex items-center space-x-2">
        <progress value={task.completion_percentage} max="100"></progress>

        <button
          onClick={() => onUpdate(task.id, { is_completed: !task.is_completed })}
          className={`text-lg ${task.is_completed ? "text-green-500" : "text-gray-400"}`}
        >
          <FaCheckCircle />
        </button>

        <button onClick={() => onDelete(task.id)} className="text-red-500">
          <FaTrash />
        </button>
      </div>
    </div>
  );
};

export default TaskItem;
