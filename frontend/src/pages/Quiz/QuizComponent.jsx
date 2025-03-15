import React, { useState, useEffect } from "react";
import axios from "axios";
import categories from "./categoryQuestions";
import "./quiz.css";
import { FaBrain, FaFlask, FaLandmark, FaFutbol } from "react-icons/fa";
import MainLayout from "../../layout/MainLayout";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
 
const Quiz = () => {
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswers, setSelectedAnswers] = useState([]);


  const [categoriesList, setCategoryList]  = useState([]);
  const { access } = useSelector((state) => state.user);
  const navigate = useNavigate();




  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerClick = (selectedOption) => {
    const isCorrect = selectedOption === questions[currentQuestion].answer;
    setSelectedAnswers([...selectedAnswers, { question: questions[currentQuestion].question, selectedOption, correctAnswer: questions[currentQuestion].answer }]);

    if (isCorrect) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      handleNextQuestion();
    }, 1000);
  };

  const handleNextQuestion = () => {
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(10);
    } else {
      setShowReview(true);
    }
  };

  const handleReviewDone = () => {
    setShowReview(false);
    setShowResult(true);
  };

  const restartQuiz = () => {
    setCategory(null);
    setQuestions([]);
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
    setShowReview(false);
    setTimeLeft(10);
    setSelectedAnswers([]);
  };





  const fetchCategoryList = async () => {
    if (!access) {
      toast.error("User is not authenticated. Please log in.");
      return;
    }
    try {
      const { data } = await axios.get("http://localhost:8000/api/quizzes/", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${access}`,
        },
      });
      setCategoryList(data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        navigate("/");
      } else {
        toast.error("Error fetching Category: " + (error.message || error));
      }
    }
  };

  useEffect(() => {
    fetchCategoryList();
  }, [access, navigate]);





  return (
    <MainLayout >
      <div>
        {categoriesList.length > 0 && categoriesList.map((cat) => (
          <div>
            {cat.title}
          </div>
        ) ) }



      </div>

    <div className="quiz-container">

      {!category ? (
        <div>
          <h2>Select Quiz Category</h2>
          <div className="category-container">
            <div className="category-card general" onClick={() => { setCategory("general"); setQuestions(categories.general); }}>
              <FaBrain className="category-icon" />
              <p>General Knowledge</p>
            </div>
            <div className="category-card science" onClick={() => { setCategory("science"); setQuestions(categories.science); }}>
              <FaFlask className="category-icon" />
              <p>Science</p>
            </div>
            <div className="category-card politics" onClick={() => { setCategory("politics"); setQuestions(categories.politics); }}>
              <FaLandmark className="category-icon" />
              <p>Politics</p>
            </div>
            <div className="category-card sports" onClick={() => { setCategory("sports"); setQuestions(categories.sports); }}>
              <FaFutbol className="category-icon" />
              <p>Sports</p>
            </div>
          </div>
        </div>
      ) : showReview ? (
        <div className="review-container">
          <h2>Review Your Answers</h2>
          {selectedAnswers.map((item, index) => (
            <div key={index} className="review-item">
              <p><strong>Q{index + 1}:</strong> {item.question}</p>
              <p>Your Answer: <span className={item.selectedOption === item.correctAnswer ? "correct-answer" : "wrong-answer"}>{item.selectedOption}</span></p>
              <p>Correct Answer: <span className="correct-answer">{item.correctAnswer}</span></p>
            </div>
          ))}
          <button className="review-done-button" onClick={handleReviewDone}>✅Review Done</button>
        </div>
      ) : showResult ? (
        <div className="result">
          <h2>Quiz Completed!</h2>
          <p>Your Score: {score} / {questions.length}</p>
          <button className="restart-button" onClick={restartQuiz}>Restart Quiz</button>
        </div>
      ) : (
        <div>
          <h2>Question {currentQuestion + 1}: {questions[currentQuestion].question}</h2>
          <p className="timer">⏳ Time Left: {timeLeft}s</p>
          <div className="options">
            {questions[currentQuestion].options.map((option, index) => (
              <button 
                key={index} 
                onClick={() => handleAnswerClick(option)}
              >
                {String.fromCharCode(65 + index)}. {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
    </MainLayout>
  );
};

export default Quiz;