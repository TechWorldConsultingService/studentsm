import React, { useState, useEffect } from "react";
import WelcomePage from './WelcomePage'; 
import { useNavigate } from "react-router-dom";
// import ScoreBoard from "../../data/ScoreBoard";  
import "./PlayQuizPage.css";  
import { useSelector } from "react-redux";


const PlayQuizPage = () => {
  const navigate = useNavigate();
  const { access, role } = useSelector(state => state.user);
  
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
    fetch("http://localhost:8000/api/quizzes", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${access}`, // ✅ Add Authorization header
        },
    })
        .then(response => response.json())
        .then(data => {
            console.log("Fetched quizzes data:", data);
            setQuizzes(data)
            }
        )
        .catch(error => console.error("Error fetching quizzes:", error));
}, []);

// ✅ Jab category select ho, backend se questions fetch karo
useEffect(() => {
    // if (category) {
    if (category) {
        setLoadingQuestions(true);
        fetch(`http://localhost:8000/api/questions/by-quiz/?quiz_id=${category}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${access}`, // ✅ Add Authorization header
            },
        })
            .then(response => response.json())
            .then(data => {
                setQuestions(data); 
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
    const isCorrect = selectedOption === questions[currentQuestion]?.correct_answer;
    setSelectedAnswers([...selectedAnswers, { 
        question: questions[currentQuestion]?.question_text, selectedOption, correctAnswer: questions[currentQuestion]?.correct_answer 
    }]);

    if (isCorrect) {
      setScore(score + 1);
      setTimeout(() => {
        handleNextQuestion();  // Continue to next question if the answer is correct
      }, 1000);
    } else {
        setWrongAnswer(selectedOption);
        setTimeout(() => { setShowResult(true);
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
            setShowResult(true); 
            saveScoreToBackend(); 
    }
  };



  const saveScoreToBackend = () => {
    fetch("http://127.0.0.1:8000/api/scores/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
                Authorization: `Bearer ${access}`,
        },
        body: JSON.stringify({
            category: category,
            score: score,
        }),
    })
    .then(response => response.json())
    .then(data => console.log("Score saved successfully:", data))
    .catch(error => console.error("Error saving score:", error));
};

  // restart quiz . only save if student is playing
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
  
  // Function to start the quiz (hide welcome page)
  const handleStartQuiz = () => {
    setIsWelcomePageVisible(false);
    
  };

  return (
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
                                    <p>{quiz.title}</p>
                                </div>
                            ))
                        ) : (
                            <p>Sorry No categories available.</p>
                        )}
                        
          </div>
        ) : showResult ? (
            <div className="result-container" style={{ backgroundColor: score > questions.length / 2 ? "#d4edda" : "#f8d7da", // Green for good score, Red for low score
            }}
          >
            <h2 className="result-title">
              {score > questions.length / 2 ? "🎉 Congratulations!" : "😞 Better Luck Next Time!"}
            </h2>
            
            <p className="score-text">Your Score: <strong>{score} </strong></p>
            {/* <p className="score-text">Your Score: <strong>{score} / {questions.length}</strong></p> */}
        
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
                <h2>{questions[currentQuestion]?.question_text}</h2>
              </div>

            <div className="options">
            {questions[currentQuestion] && [
              questions[currentQuestion].option1,
              questions[currentQuestion].option2,
              questions[currentQuestion].option3,
              questions[currentQuestion].option4
            ].map((option, index) => {
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
     {showScoreBoard && <ScoreBoard onClose={() => setShowScoreBoard(false)} />}
  </div>
);
};

export default PlayQuizPage;
