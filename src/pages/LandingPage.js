import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleGetStarted = () => {
    navigate("/signup"); // Redirect to the signup page
  };

  return (
    <div className="landing-page">
      <div className="content">
        <h1>Welcome to RecipeFinder</h1>
        <p>
          Discover recipes you can make with the ingredients you have. Your
          perfect kitchen companion for hassle-free cooking!
        </p>
        <button onClick={handleGetStarted}>Get Started</button>
      </div>
    </div>
  );
};

export default LandingPage;
