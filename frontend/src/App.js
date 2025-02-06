import React from "react";
import "./index.css";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/homepage";
import ChatPage from "./pages/ChatPage";
import NavBar from "./components/navBar"; // Import NavBar here
import Login from "./login/login"

function App() {
  return (
    <div>
      {/* <NavBar /> 
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/chat/:id" element={<ChatPage />} />
      </Routes>    */}
      <Login />
    </div>
  );
}

export default App;

