import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";


const QuizComponent = () => {
  const { access,role } = useSelector((state) => state.user);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/quizzes/", {
        headers: { Authorization: `Bearer ${access}` },
      });
      setQuizzes(response.data);
    } catch (error) {
      toast.error("Error fetching quizzes");
    }
  };

  const startQuiz = (quiz) => {
    setSelectedQuiz(quiz);
    setAnswers({});
    setScore(null);
  };

  const handleAnswer = (questionId, answer) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const submitQuiz = async () => {
    let totalScore = 0;
    selectedQuiz.questions.forEach((q) => {
      if (answers[q.id] === q.correct_option) {
        totalScore += 1;
      }
    });

    setScore(totalScore);

    try {
      await axios.post(
        "http://localhost:8000/api/scores/",
        { quiz: selectedQuiz.id, score: totalScore },
        { headers: { Authorization: `Bearer ${access}` } }
      );
      toast.success("Score submitted!");
    } catch (error) {
      toast.error("Error submitting score");
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Quiz Game</h2>
      {selectedQuiz ? (
        <div className="p-4 border rounded">
          <h3 className="text-xl font-bold">{selectedQuiz.title}</h3>
          {selectedQuiz.questions.map((q) => (
            <div key={q.id} className="mt-4">
              <p className="font-semibold">{q.text}</p>
              {["A", "B", "C", "D"].map((opt) => (
                <label key={opt} className="block">
                  <input
                    type="radio"
                    name={`question-${q.id}`}
                    value={opt}
                    checked={answers[q.id] === opt}
                    onChange={() => handleAnswer(q.id, opt)}
                  />
                  {q[`option_${opt.toLowerCase()}`]}
                </label>
              ))}
            </div>
          ))}
          <button
            onClick={submitQuiz}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Submit Quiz
          </button>
          {score !== null && <p className="mt-4 font-bold">Your Score: {score}</p>}
        </div>
      ) : (
        <div>
          {quizzes.length === 0 ? (
            <p>No quizzes available.</p>
          ) : (
            quizzes.map((quiz) => (
              <button
                key={quiz.id}
                onClick={() => startQuiz(quiz)}
                className="block bg-blue-600 text-white p-2 rounded mb-2"
              >
                {quiz.title}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default QuizComponent;
