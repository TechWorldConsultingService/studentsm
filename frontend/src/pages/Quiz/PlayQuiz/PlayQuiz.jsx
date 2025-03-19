import React, { useState, useEffect } from "react";
import WelcomePage from "./WelcomePage";
import "./PlayQuiz.css";
import Scoreboard from "./ScoreBoard";
import { useNavigate } from "react-router-dom";
import { FaBrain, FaFlask, FaLandmark, FaFutbol } from "react-icons/fa";

const PlayQuiz = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isWelcomePageVisible, setIsWelcomePageVisible] = useState(true);
  const [wrongAnswer, setWrongAnswer] = useState(null);
  const [showScoreBoard, setShowScoreBoard] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);

  // Fetch quizzes from backend
  useEffect(() => {
    fetch("http://localhost:8000/api/quizzes")
      .then((response) => response.json())
      .then((data) => setQuizzes(data))
      .catch((error) => console.error("Error fetching quizzes:", error));
  }, []);

  // Fetch questions when a category is selected
  useEffect(() => {
    if (category) {
      setLoadingQuestions(true);
      fetch(`http://localhost:8000/api/questions/by-quiz/?quiz_id=${category}`)
        .then((response) => response.json())
        .then((data) => {
          setQuestions(data.length > 0 ? data : [{ question: "No questions found!", options: ["-", "-", "-", "-"] }]);
          setLoadingQuestions(false);
        })
        .catch((error) => {
          console.error("Error fetching questions:", error);
          setLoadingQuestions(false);
        });
    }
  }, [category]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === 0) handleNextQuestion();
    const timer = setInterval(() => {
      if (timeLeft > 0) setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerClick = (selectedOption) => {
    const isCorrect = selectedOption === questions[currentQuestion].answer;
    setSelectedAnswers([...selectedAnswers, { question: questions[currentQuestion].question, selectedOption, correctAnswer: questions[currentQuestion].answer }]);
    if (isCorrect) {
      setScore(score + 1);
      setTimeout(handleNextQuestion, 1000);
    } else {
      setWrongAnswer(selectedOption);
      setTimeout(() => setShowResult(true), 1500);
    }
  };

  const handleNextQuestion = () => {
    setWrongAnswer(null);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(20);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCategory(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setTimeLeft(20);
    setSelectedAnswers([]);
    setWrongAnswer(null);
  };

  // Save score to localStorage
  useEffect(() => {
    if (showResult) {
      const previousScores = JSON.parse(localStorage.getItem("quizScores")) || [];
      localStorage.setItem("quizScores", JSON.stringify([...previousScores, { category, score }]));
    }
  }, [showResult]);

  const handleStartQuiz = () => setIsWelcomePageVisible(false);

  return (
    <div className="quiz-container">
      {isWelcomePageVisible ? (
        <WelcomePage onStartQuiz={handleStartQuiz} />
      ) : !category ? (
        <div className="category-container">
          <h1 className="category-page-title">Select a Quiz Category</h1>
          {quizzes.length > 0 ? (
            quizzes.map((quiz) => (
              <div key={quiz.id} className="category-card" onClick={() => setCategory(quiz.id)}>
                <p>{quiz.name}</p>
              </div>
            ))
          ) : (
            <p>Loading categories...</p>
          )}
        </div>
      ) : showResult ? (
        <div className="result-container" style={{ backgroundColor: score > questions.length / 2 ? "#d4edda" : "#f8d7da" }}>
          <h2 className="result-title">{score > questions.length / 2 ? "🎉 Congratulations!" : "😞 Better Luck Next Time!"}</h2>
          <p className="score-text">Your Score: <strong>{score} / {questions.length}</strong></p>
          <button className="restart-button" onClick={restartQuiz}>🔄Restart Quiz</button>
          <button className="ScoreBoard-button" onClick={() => navigate("/scoreboard")}>🏆View ScoreBoard</button>
        </div>
      ) : (
        <div>
          <div className="question-container">
            <p className="timer">⏳ Time Left: {timeLeft}s</p>
            <div className="question-text">
              <h2>{questions[currentQuestion]?.question}</h2>
            </div>
            <div className="options">
              {questions[currentQuestion]?.options.map((option, index) => (
                <button key={index} onClick={() => handleAnswerClick(option)} className={`option-button ${option === wrongAnswer ? "wrong-answer" : ""}`}>{String.fromCharCode(65 + index)}. {option}</button>
              ))}
            </div>
            {wrongAnswer && <div className="wrong-answer-message"><p>Oops! Wrong Answer, Better luck next time....</p></div>}
          </div>
        </div>
      )}
      {showScoreBoard && <Scoreboard onClose={() => setShowScoreBoard(false)} />}
    </div>
  );
};

export default PlayQuiz;
