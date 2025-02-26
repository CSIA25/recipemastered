import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import RecipePage from "./pages/RecipePage";
import LandingPage from "./pages/LandingPage"; // Import LandingPage

function App() {
  return (
    <Router>
      <Routes>
        {/* LandingPage is the default route */}
        <Route path="/" element={<LandingPage />} />
        
        {/* Other routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected route for RecipePage */}
        <Route path="/recipes" element={<RecipePage />} />
      </Routes>
    </Router>
  );
}

export default App;
