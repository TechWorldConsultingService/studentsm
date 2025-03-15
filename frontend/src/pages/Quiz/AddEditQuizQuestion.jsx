import axios from "axios";
import * as Yup from "yup";
import { useFormik } from "formik";
import toast from "react-hot-toast";
import React, { useState } from "react";
import { Checkbox, Modal } from "antd";
import { useSelector } from "react-redux";

const quizeCategorySchema = Yup.object().shape({
  question_text: Yup.string()
    .required("Quiz question is required.")
    .typeError("Quiz question must be a string."),
  option1: Yup.string()
    .required("Quiz option 1 is required.")
    .typeError("Quiz option 1 must be a string."),
  option2: Yup.string()
    .required("Quiz option 2 is required.")
    .typeError("Quiz option 2 must be a string."),
  option3: Yup.string()
    .required("Quiz option 3 is required.")
    .typeError("Quiz option 3 must be a string."),
  option4: Yup.string()
    .required("Quiz option 4 is required.")
    .typeError("Quiz option 4 must be a string."),
});

const options = [
  { key: "option1", value: "Option 1" },
  { key: "option2", value: "Option 2" },
  { key: "option3", value: "Option 3" },
  { key: "option4", value: "Option 4" },
];

export default function AddEditQuizQuestion({
  addQuizQuestionCategory,
  onClose,
}) {
  const { access } = useSelector(state => state.user);
  const [correctAnswer, setCorrectAnswer] = useState("");

  const formik = useFormik({
    initialValues: {
      question_text: addQuizQuestionCategory?.question_text || "",
      option1: addQuizQuestionCategory?.option1 || "",
      option2: addQuizQuestionCategory?.option2 || "",
      option3: addQuizQuestionCategory?.option3 || "",
      option4: addQuizQuestionCategory?.option4 || "",
      correct_answer: addQuizQuestionCategory?.correct_answer || "",
    },
    validationSchema: quizeCategorySchema,
    onSubmit: async values => {
      if (!access) {
        return toast.error("User is not authenticated. Please log in.");
      }

      if (!correctAnswer) {
        return toast.error("Please select a correct answer");
      }

      values.correct_answer = values[correctAnswer];
      return console.log({ values });

      try {
        await axios.post("http://localhost:8000/api/questions/", values, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`,
          },
        });
        toast.success("Quiz category added successfully.");

        onClose();
      } catch (error) {
        if (error.response && error.response.status === 401) {
          toast.error("Authentication error. Please log in again.");
        } else {
          toast.error(
            "Error saving quiz category: " +
              (error.response?.data?.detail || error.message)
          );
        }
      }
    },
  });

  const handleCorrectAnswer = optionKey => {
    setCorrectAnswer(optionKey);
  };

  console.log({ formik });

  return (
    <Modal
      centered
      footer={null}
      onCancel={onClose}
      open={!!addQuizQuestionCategory}
      title={
        <div className="flex items-baseline gap-1">
          <h2 className="text-2xl font-bold text-purple-800 mb-4">
            Add Quiz Question
          </h2>
          <small>for {addQuizQuestionCategory?.title}</small>
        </div>
      }
    >
      <form onSubmit={formik.handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-semibold" htmlFor="question">
            Question
          </label>
          <input
            id="question"
            type="text"
            name="question_text"
            onBlur={formik.handleBlur}
            placeholder="Enter question"
            value={formik.values.question_text}
            onChange={formik.handleChange}
            className="border border-gray-300 p-2 rounded w-full mt-1"
          />
          {formik.touched.question_text && formik.errors.question_text && (
            <div className="text-red-500 text-sm mt-1">
              {formik.errors.question_text}
            </div>
          )}
        </div>

        {options.map(option => (
          <div className="mb-4">
            <label className="block text-sm font-semibold" htmlFor={option.key}>
              {option.value}
            </label>
            <input
              id={option.key}
              type="text"
              name={option.key}
              onBlur={formik.handleBlur}
              placeholder={`Enter ${option.key}`}
              value={formik.values[option.key]}
              onChange={formik.handleChange}
              className="border border-gray-300 p-2 rounded w-full mt-1"
            />
            <Checkbox
              checked={correctAnswer === option.key}
              onChange={() => handleCorrectAnswer(option.key)}
            >
              Correct Answer
            </Checkbox>
            {formik.touched[option.key] && formik.errors[option.key] && (
              <div className="text-red-500 text-sm mt-1">
                {formik.errors[option.key]}
              </div>
            )}
          </div>
        ))}

        <div className="mt-6 flex justify-center">
          <button
            type="submit"
            className="bg-purple-700 text-white px-6 py-2 rounded-lg hover:bg-purple-800 mr-4"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </Modal>
  );
}
