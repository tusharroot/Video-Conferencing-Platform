import React from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
function LandingPage() {
  const router = useNavigate();
  return (
    <div className="landingPageContainer">
      <nav>
        <div className="navHeader">
          <h2>Emeet Video Call</h2>
        </div>
        <div className="navlist">
          <p
            onClick={() => {
              router("/guest");
            }}
          >
            Join as Guset
          </p>
          <p
            onClick={() => {
              router("/auth");
            }}
          >
            Register
          </p>
          <div role="button">
            <p
              onClick={() => {
                router("/auth");
              }}
            >
              Login
            </p>
          </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
          <h1>
            <span style={{ color: "#FF9839" }}>Connect</span> With your loved
            ones
          </h1>
          <p>Cover a distance by Emeet Video Call</p>
          <div role="button">
            <Link to={"/auth"}>Get Started</Link>
          </div>
        </div>
        <div>
          <img src="/mobile.png" alt="mobile image " />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
