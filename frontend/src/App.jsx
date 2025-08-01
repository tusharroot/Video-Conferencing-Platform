import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./pages/landing";
import { AuthProvider } from "./contexts/AuthContext";
import Authentication from "./pages/authentication";
import VideoMeet from "./pages/VideoMeet";
import Home from "./pages/home";
import History from "./pages/History";

function App() {
  return (
    <div>
      <Router>
        <AuthProvider>
        <Routes>
          {/* <Routes path='/home'/> */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/Home" element={<Home/>} />
          <Route path="/history" element={<History/>} />
          <Route path="/auth" element={<Authentication/>} />
          <Route path="/:url" element={<VideoMeet/>} />
        </Routes>
        </AuthProvider>
      </Router>
      </div>
  );
}

export default App;
