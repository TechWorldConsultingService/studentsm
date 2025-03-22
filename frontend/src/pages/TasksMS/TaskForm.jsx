import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

const taskSchema = Yup.object().shape({
  title: Yup.string().trim().required("Task Details are required."),
  // priority: Yup.string()
  //   .oneOf(["low", "medium", "high"], "Invalid Priority value.")
  //   .required("Priority is required."),
  due_date: Yup.date()
    .nullable()
    .required("Date is required.")
});

const TaskForm = ({ addTask, onClose }) => {
  const formik = useFormik({
    initialValues: {
      title: "",
      // priority: "medium",
      due_date: ""
    },
    validationSchema: taskSchema,
    onSubmit: (values, { resetForm }) => {
      addTask(values);
      resetForm();
    }
  });

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg shadow-lg w-11/12 md:w-1/2">
        <h2 className="text-2xl font-bold text-purple-800 mb-4">Add To-do List</h2>
        <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-2 mb-4">
          {/* Due Date */}
          <div>
            <label className="block text-gray-700 font-semibold" htmlFor="due_date">
              Date:
            </label>
            <input
              id="due_date"
              type="date"
              name="due_date"
              value={formik.values.due_date}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="p-2 border rounded w-full"
            />
            {formik.touched.due_date && formik.errors.due_date && (
              <div className="p-1 text-red-500 text-sm">{formik.errors.due_date}</div>
            )}
          </div>

          {/* Task Details */}
          <div>
            <label className="block text-gray-700 font-semibold" htmlFor="title">
              Task Details:
            </label>
            <textarea
              id="title"
              name="title"
              placeholder="Enter Task"
              value={formik.values.title}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="p-2 border rounded w-full"
            />
            {formik.touched.title && formik.errors.title && (
              <div className="p-1 text-red-500 text-sm">{formik.errors.title}</div>
            )}
          </div>

          {/* Priority */}
          {/* <div>
            <label className="block text-gray-700 font-semibold" htmlFor="priority">
              Priority:
            </label>
            <select
              id="priority"
              name="priority"
              value={formik.values.priority}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="p-2 border rounded w-full"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            {formik.touched.priority && formik.errors.priority && (
              <div className="p-1 text-red-500 text-sm">{formik.errors.priority}</div>
            )}
          </div> */}

          {/* Buttons */}
          <div className="flex justify-center pt-3 space-x-5">
            <button
              type="submit"
              className="bg-purple-800 text-white px-4 py-2 rounded-lg"
            >
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
