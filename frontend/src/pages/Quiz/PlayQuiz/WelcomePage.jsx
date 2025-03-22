import React from "react";
import { FaBook, FaRocket, FaLightbulb, FaQuestionCircle } from "react-icons/fa"; // Icons
import './WelcomePage.css';

const WelcomePage = ({ onStartQuiz }) => {

  
  return (
    <div className="welcome-container">
      {/* Quote Text */}
      <div className="quote-container">
        <h1 className="quote-text">"Get Ready to Challenge Your Knowledge!"</h1>
        <p className="quote-subtext">Your adventure into the world of quizzes starts now!</p>
      </div>

      {/* Start Quiz Button Box */}
      <div className="start-button-box">
        <button className="start-button" onClick={onStartQuiz}>Start Quiz</button>
      </div>

      {/* Icon Section */}
      <div className="icons-container">
        <FaBook className="icon book-icon" />
        <FaRocket className="icon rocket-icon" />
        <FaLightbulb className="icon light-icon" />
        <FaQuestionCircle className="icon question-icon" />
       
      </div>
    </div>
  );
};

export default WelcomePage;