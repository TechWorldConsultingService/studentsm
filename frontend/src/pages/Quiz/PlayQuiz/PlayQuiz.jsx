import React, { useState, useEffect } from "react";
import WelcomePage from "./WelcomePage";
import "./PlayQuiz.css";
import Scoreboard from "./ScoreBoard";
import { useNavigate } from "react-router-dom";
import { FaBrain, FaFlask, FaLandmark, FaFutbol } from "react-icons/fa";
import MainLayout from "../../../layout/MainLayout";
// import categories from "../../data/categoryQuestions";  // Correct path to 


// import categories from "../../data/categoryQuestions";  // Correct path to categoryQuestions

const PlayQuiz = () => {
    const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [isWelcomePageVisible, setIsWelcomePageVisible] = useState(true); // State for welcome page visibility
  const [wrongAnswer, setWrongAnswer] = useState(null);
  const [showScoreBoard, setShowScoreBoard] = useState(false);
  const [quizzes, setQuizzes] = useState([]);  // Backend se categories store karne ke liye
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  
  // ✅ Pehle backend se quizzes fetch karenge
  useEffect(() => {
    fetch("http://localhost:8000/api/quizzes")
        .then(response => response.json())
        .then(data => setQuizzes(data))
        .catch(error => console.error("Error fetching quizzes:", error));
}, []);

// ✅ Jab category select ho, backend se questions fetch karo
useEffect(() => {
    if (category) {
        setLoadingQuestions(true);
        fetch(`http://localhost:8000/api/questions/by-quiz/?quiz_id=${category}`)
            .then(response => response.json())
            .then(data => {
                setQuestions(data.length > 0 ? data : [{ question: "No questions found!", options: ["-", "-", "-", "-"] }]); 
                setLoadingQuestions(false);
            })
            .catch(error => {
                console.error("Error fetching questions:", error);
                setLoadingQuestions(false);
            });
    }
}, [category]);

  // Start the timer countdown
  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }

    const timer = setInterval(() => {
      if (timeLeft > 0) {
        setTimeLeft((prev) => prev - 1);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  // Handle user's answer click
  const handleAnswerClick = (selectedOption) => {
    const isCorrect = selectedOption === questions[currentQuestion].answer;
    setSelectedAnswers([...selectedAnswers, { 
        question: questions[currentQuestion].question, selectedOption, correctAnswer: questions[currentQuestion].answer }]);

    if (isCorrect) {
      setScore(score + 1);
      setTimeout(() => {
        handleNextQuestion();  // Continue to next question if the answer is correct
      }, 1000);
    } else {
        setWrongAnswer(selectedOption);
        setTimeout(() => {
      setShowResult(true);
    }, 1500);  // End quiz if the answer is wrong
    }
  };

  // Move to next question
  const handleNextQuestion = () => {
    setWrongAnswer(null);
    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setTimeLeft(20 );
    } else {
            setShowResult(true);  // Show result if no more questions
    }
  };

  // restart quiz
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
const previousScores = JSON.parse(localStorage.getItem("quizScores")) || [];
localStorage.setItem("quizScores", JSON.stringify([...previousScores, { category, score }]));


  // Function to start the quiz (hide welcome page)
  const handleStartQuiz = () => {
    setIsWelcomePageVisible(false);
  };

  return (
    // <MainLayout>
    <div className="quiz-container">
      {isWelcomePageVisible ? (
        <WelcomePage onStartQuiz={handleStartQuiz} />  // Welcome page component
      ) : (
        !category ? (
          <div className="category-container">
            <h1 className="category-page-title">Select a Quiz Category</h1>
             {/* Backend se fetched quizzes */}
             {quizzes.length > 0 ? (
                            quizzes.map((quiz) => (
                                <div key={quiz.id} className="category-card" onClick={() => setCategory(quiz.id)}>
                                    <p>{quiz.name}</p>
                                </div>
                            ))
                        ) : (
                            <p>NO Quizzes Available</p>
                        )}

                        {/* Dummy categories (fallback) */}
            
          </div>
        ) : showResult ? (
            <div 
            className="result-container"
            style={{
              backgroundColor: score > questions.length / 2 ? "#d4edda" : "#f8d7da", // Green for good score, Red for low score
            }}
          >
            <h2 className="result-title">
              {score > questions.length / 2 ? "🎉 Congratulations!" : "😞 Better Luck Next Time!"}
            </h2>
            
            <p className="score-text">Your Score: <strong>{score} / {questions.length}</strong></p>
        
            {/* Encouraging message */}
            <p className="encouraging-message">
              {score > questions.length / 2 
                ? "You did a fantastic job! Keep it up! 🚀"
                : "Don't worry, try again and improve your score! 💪"}
            </p>
            <button className="restart-button" onClick={restartQuiz}>🔄Restart Quiz</button>
            <button className="ScoreBoard-button" onClick={() =>  navigate("/scoreboard")}>🏆View ScoreBoard</button>
          </div>
        ) : (
          <div>
            <div className="question-container">
              {/* Timer */}
              <p className="timer">⏳ Time Left: {timeLeft}s</p>
              
              {/* Question */}
              <div className="question-text">
                <h2>{questions[currentQuestion]?.question}</h2>
              </div>

              {/* Answer Options */}
              <div className="options">
                {questions[currentQuestion]?.options.map((option, index) => {
                     // Apply red color for wrong answer
                  const isWrongAnswer = option === wrongAnswer ? "wrong-answer" : "";
                  return (
                    <button 
                    key={index} 
                    onClick={() => handleAnswerClick(option)} 
                    className={`option-button ${isWrongAnswer}`}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </button>
                );
              })}
            </div>

            {/* Wrong answer message */}
            {wrongAnswer && (
              <div className="wrong-answer-message">
                <p>Oops! Wrong Answer, Better luck next time....</p>
              </div>
            )}
          </div>
        </div>
      )
    )}
     {/* ✅ Scoreboard Show Karne Ka Logic */}
     {showScoreBoard && <Scoreboard onClose={() => setShowScoreBoard(false)} />}
  </div>
//   </MainLayout>
);
};

export default PlayQuiz;
