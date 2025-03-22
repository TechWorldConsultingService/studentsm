import React, { useEffect, useState } from "react";
import "./ScoreBoard.css"; // ✅ Ensure CSS is linked
import { useSelector } from "react-redux";

const ScoreBoard = () => {
  const [scores, setScores] = useState([]);
  const {access, role} = useSelector(state => state.user);

  useEffect(() => {
    // API ya backend se score fetch karna hai
    fetch("http://localhost:8000/api/scores/",{
      headers: { Authorization: `Bearer ${access}` },
    })
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
                <td>{item.quiz || "Some Quiz"}</td>
                <td>{item.user || "Anonymous User"}</td>
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

export default ScoreBoard;