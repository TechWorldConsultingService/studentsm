import React, { useEffect, useState } from "react";
import "./ScoreBoard.css"; // ✅ Ensure CSS is linked

const Scoreboard = () => {
  const [scores, setScores] = useState([]);

  useEffect(() => {
    // API ya backend se score fetch karna hai
    fetch("http://127.0.0.1:8000/api/scores/")
      .then((response) => response.json())
      .then((data) => setScores(data))
      .catch((error) => console.error("Error fetching scores:", error));
  }, []);

  return (
    <div className="scoreboard-container">
      <h1 className="scoreboard-title">🏆 Scoreboard</h1>
      <table className="scoreboard-table">
        <thead>
          <tr>
            <th>Quiz</th>
            <th>Student</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {scores.length > 0 ? (
            scores.map((item, index) => (
              <tr key={index}>
                <td>{item.quiz_name || "Unknown Quiz"}</td>
                <td>{item.student_name || "Anonymous"}</td>
                <td>{item.score}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3">No scores available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Scoreboard;