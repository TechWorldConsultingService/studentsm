import React, { useState, useEffect } from "react";
import categories from "../data/categoryQuestions";
import "../quiz.css";

import { FaBrain, FaFlask, FaLandmark, FaFutbol } from "react-icons/fa";

const QuizComponent = () => {
  const [category, setCategory] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10);
  const [selectedAnswers, setSelectedAnswers] = useState([]);

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

  return (
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
  );
};

export default QuizComponent;


// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { toast } from "react-hot-toast";
// import { useSelector } from "react-redux";


// const QuizComponent = () => {
//   const { access,role } = useSelector((state) => state.user);
//   const [quizzes, setQuizzes] = useState([]);
//   const [selectedQuiz, setSelectedQuiz] = useState(null);
//   const [answers, setAnswers] = useState({});
//   const [score, setScore] = useState(null);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     fetchQuizzes();
//   }, []);

//   const fetchQuizzes = async () => {
//     try {
//       const response = await axios.get("http://localhost:8000/api/quizzes/", {
//         headers: { Authorization: `Bearer ${access}` },
//       });
//       setQuizzes(response.data);
//     } catch (error) {
//       toast.error("Error fetching quizzes");
//     }
//   };

//   const startQuiz = (quiz) => {
//     setSelectedQuiz(quiz);
//     setAnswers({});
//     setScore(null);
//   };

//   const handleAnswer = (questionId, answer) => {
//     setAnswers({ ...answers, [questionId]: answer });
//   };

//   const submitQuiz = async () => {
//     let totalScore = 0;
//     selectedQuiz.questions.forEach((q) => {
//       if (answers[q.id] === q.correct_option) {
//         totalScore += 1;
//       }
//     });

//     setScore(totalScore);

//     try {
//       await axios.post(
//         "http://localhost:8000/api/scores/",
//         { quiz: selectedQuiz.id, score: totalScore },
//         { headers: { Authorization: `Bearer ${access}` } }
//       );
//       toast.success("Score submitted!");
//     } catch (error) {
//       toast.error("Error submitting score");
//     }
//   };

//   return (
//     <div className="p-4">
//       <h2 className="text-2xl font-bold mb-4">Quiz Game</h2>
//       {selectedQuiz ? (
//         <div className="p-4 border rounded">
//           <h3 className="text-xl font-bold">{selectedQuiz.title}</h3>
//           {selectedQuiz.questions.map((q) => (
//             <div key={q.id} className="mt-4">
//               <p className="font-semibold">{q.text}</p>
//               {["A", "B", "C", "D"].map((opt) => (
//                 <label key={opt} className="block">
//                   <input
//                     type="radio"
//                     name={`question-${q.id}`}
//                     value={opt}
//                     checked={answers[q.id] === opt}
//                     onChange={() => handleAnswer(q.id, opt)}
//                   />
//                   {q[`option_${opt.toLowerCase()}`]}
//                 </label>
//               ))}
//             </div>
//           ))}
//           <button
//             onClick={submitQuiz}
//             className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
//           >
//             Submit Quiz
//           </button>
//           {score !== null && <p className="mt-4 font-bold">Your Score: {score}</p>}
//         </div>
//       ) : (
//         <div>
//           {quizzes.length === 0 ? (
//             <p>No quizzes available.</p>
//           ) : (
//             quizzes.map((quiz) => (
//               <button
//                 key={quiz.id}
//                 onClick={() => startQuiz(quiz)}
//                 className="block bg-blue-600 text-white p-2 rounded mb-2"
//               >
//                 {quiz.title}
//               </button>
//             ))
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default QuizComponent;
