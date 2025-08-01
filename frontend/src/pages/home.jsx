import React, { useContext, useState } from "react";
import withAuth from "../utils/withAuth";
import { useNavigate } from "react-router-dom";
import "../App.css";
import IconButton from "@mui/material/IconButton";
import RestoreIcon from "@mui/icons-material/Restore";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { AuthContext } from "../contexts/AuthContext";
function Home() {
  let navigate = useNavigate();
  const [meetingCode, setMeetingCode] = useState("");
  
  const {addToUserHistory} = useContext(AuthContext);
  let handleJoinVIdeoCall = async () => {
    await addToUserHistory(meetingCode)
    console.log(meetingCode);
    
    navigate(`/${meetingCode}`);
  };
  return (
    <>
      <div className="navBar">
        <div style={{ display: "flex", alignItems: "center" }}>
          <h3>Emeet Video Call</h3>
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={
            ()=>{
              navigate('/history')
            }
          }>
            <RestoreIcon />
            <p>History</p>
          </IconButton>
          <Button
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/auth");
            }}
          >
            LogOut
          </Button>
        </div>
      </div>
      <div className="meetContainer">
        <div className="leftPanel">
          <div>
            <h2>Providing Quality Video Calls...</h2>
            <div style={{ display: "flex", gap: "10px" }}>
              <TextField
                onChange={(e) => setMeetingCode(e.target.value)}
                id="outlined-basic"
                label="Meeting Code"
                variant="outlined"
              />
              <Button onClick={handleJoinVIdeoCall} variant="contained">
                Join
              </Button>
            </div>
          </div>
        </div>
        <div className="rightPanel">
          <img srcSet="/logo3.png" alt="" />
        </div>
      </div>
    </>
  );
}

// export default withAuth(Home);
export default Home;
