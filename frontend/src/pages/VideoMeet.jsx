import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import TextField from "@mui/material/TextField";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import CallEndIcon from "@mui/icons-material/CallEnd";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import Button from "@mui/material/Button";
import styles from "../style/VideoComponent.module.css";
import IconButton from "@mui/material/IconButton";
import ChatIcon from "@mui/icons-material/Chat";
import { color } from "@mui/system";
import Badge from "@mui/material/Badge";
import { useNavigate } from "react-router-dom";
const server_url = "http://localhost:4000";

var connections = {};

const peerConfigConnections = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

export default function VideoMeet() {
  // let connections = useRef();
  var socketref = useRef(null);
  let socketIdref = useRef();

  let localvideoref = useRef();

  let [videoAviallable, setVideoAviallable] = useState(true);
  let [audioAviallable, setaudioAviallable] = useState(true);

  let [video, setVideo] = useState([]);
  let [audio, setAudio] = useState();
  let [screen, setScreen] = useState();
  let [showModel, setModel] = useState(true);
  let [screenAvailable, setScreenAvailable] = useState();
  let [messages, setMessages] = useState([]);
  let [message, setMessage] = useState("");
  let [newmessages, setNewMessages] = useState(3);
  let [askforusername, setAskForUsername] = useState(true);
  let [username, setUsername] = useState("");
  const videoref = useRef([]);
  let [videos, setVideos] = useState([]);

  let routerTo = useNavigate();

  const getpermission = async () => {
    try {
      const videopermission = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      if (videopermission) {
        setVideoAviallable(true);
      } else {
        setVideoAviallable(false);
      }
      const audiopermission = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      if (audiopermission) {
        setaudioAviallable(true);
      } else {
        setaudioAviallable(false);
      }

      if (navigator.mediaDevices.getDisplayMedia) {
        setScreenAvailable(true);
      } else {
        setScreenAvailable(false);
      }

      if (videoAviallable || audioAviallable) {
        const usermediaStream = await navigator.mediaDevices.getUserMedia({
          video: videoAviallable,
          audio: audioAviallable,
        });

        if (usermediaStream) {
          window.localStream = usermediaStream;
          if (localvideoref.current) {
            localvideoref.current.srcObject = usermediaStream;
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getpermission();
  }, []);

  let getUserMediaSuccess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }
    window.localStream = stream;
    localvideoref.current.srcObject = stream;

    for (let id in connections) {
      console.log("2", socketIdref.current);
      console.log("1", id);

      if (id === socketIdref.current) {
        console.log("Thaya che ");

        continue;
      }
      connections[id].addStream(window.localStream);
      connections[id]
        .createOffer()
        .then((description) => {
          connections[id].setLocalDescription(description).then(() => {
            socketref.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          });
        })
        .catch((e) => console.log(e));
    }
    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setVideo(false);
          setAudio(false);

          try {
            let tracks = localvideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }
          //TODO BlackSilence
          let blackslience = (...args) =>
            new MediaStream([black(...args), silence()]);
          window.localStream = blackslience();
          localvideoref.current.srcObject = window.localStream;
          window.localStream.getTracks().forEach((track) => {
            connections[socketListId].addTrack(track, window.localStream);
          });
          for (let id in connections) {
            connections[id].addStream(window.localStream);
            connections[id].createOffer().then((description) => {
              console.log("✅ Creating offer for", id); // Add this
              connections[id]
                .setLocalDescription(description)
                .then(() => {
                  socketref.current.emit(
                    "signal",
                    id,
                    JSON.stringify({ sdp: connections[id].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        })
    );
  };

  let gotMessageFromServer = (fromId, message) => {
    var signal = JSON.parse(message);

    if (fromId !== socketIdref.current) {
      if (signal.sdp) {
        connections[fromId]
          .setRemoteDescription(new RTCSessionDescription(signal.sdp))
          .then(() => {
            if (signal.sdp.type === "offer") {
              connections[fromId]
                .createAnswer()
                .then((description) => {
                  connections[fromId]
                    .setLocalDescription(description)
                    .then(() => {
                      socketref.current.emit(
                        "signal",
                        fromId,
                        JSON.stringify({
                          sdp: connections[fromId].localDescription,
                        })
                      );
                    })
                    .catch((e) => console.log(e));
                })
                .catch((e) => console.log(e));
            }
          })
          .catch((e) => console.log());
      }
      if (signal.ice) {
        connections[fromId]
          .addIceCandidate(new RTCIceCandidate(signal.ice))
          .catch((e) => console.log(e));
      }
    }
  };
  //TODO
  let addMessage = (data, sender, socketIdSender) => {
    console.log("🔥 Received message from socket:", {
      data,
      sender,
      socketIdSender,
    });
    setMessages((previousMessage) => [
      ...previousMessage,
      { sender: sender, data: data },
    ]);

    if (socketIdSender !== socketIdref.current) {
      setNewMessages((prev) => prev + 1);
    }
  };
  let ConnectToScoketServer = () => {
    socketref.current = io(server_url, { secure: false });

    socketref.current.on("connect", () => {
      socketIdref.current = socketref.current;

      socketIdref.current.on("signal", gotMessageFromServer);
      socketIdref.current.emit("join-call", window.location.href);
      socketIdref.current.on("chat-message", addMessage);
      socketIdref.current.on("user-left", (id) => {
        setVideos((videos) => videos.filter((video) => video.socketId !== id));
      });
      socketIdref.current.on("user-joined", (id, clients) => {
        clients.forEach((socketListId) => {
          connections[socketListId] = new RTCPeerConnection(
            peerConfigConnections
          );
          connections[socketListId].onicecandidate = (event) => {
            if (event.candidate !== null) {
              socketref.current.emit(
                "signal",
                socketListId,
                JSON.stringify({ ice: event.candidate })
              );
            }
          };

          //   connections[socketListId].onaddstream = (event) => {
          //     let videoExists = videoref.current.find(
          //       (video) => video.socketId === socketListId
          //     );
          //     if (videoExists) {
          //       setVideo((videos) => {
          //         const updateVideos = videos.map((video) =>
          //           video.socketId === socketListId
          //             ? { ...video, stream: event.stream }
          //             : video
          //         );
          //         videoref.current = updateVideos;
          //         return updateVideos;
          //       });
          //     } else {
          //       let newvideo = {
          //         socketId: socketListId,
          //         stream: event.stream,
          //         autoPlay: true,
          //         playsinline: true,
          //       };
          //       //   setVideo((videos = []) => [...videos, newvideo]); // ✅ FIX

          //       setVideos((videos) => {
          //         const updatedVideos = [...videos, newvideo];
          //         videoref.current = updatedVideos;
          //         return updatedVideos;
          //       });
          //     }
          //   };
          connections[socketListId].onaddstream = (event) => {
            console.log("✅ onaddstream triggered for:", socketListId);
            console.log("✅ Received stream:", event.stream);
            setVideos((prevVideos) => {
              const videoExists = prevVideos.find(
                (video) => video.socketId === socketListId
              );

              if (videoExists) {
                const updatedVideos = prevVideos.map((video) =>
                  video.socketId === socketListId
                    ? { ...video, stream: event.stream }
                    : video
                );
                videoref.current = updatedVideos;
                return updatedVideos;
              } else {
                const newVideo = {
                  socketId: socketListId,
                  stream: event.stream,
                  autoPlay: true,
                  playsinline: true,
                };
                const updatedVideos = [...prevVideos, newVideo];
                videoref.current = updatedVideos;
                return updatedVideos;
              }
            });
          };

          if (window.localStream !== undefined && window.localStream !== null) {
            connections[socketListId].addStream(window.localStream);
          } else {
            //ToDO blackslience
            // let blackslience
            let blackslience = (...args) =>
              new MediaStream([black(...args), silence()]);
            window.localStream = blackslience();
            connections[socketListId].addStream(window.localStream);
          }
        });
        if (id === socketIdref.current) {
          console.log("My socket id:", socketIdref.current);
          console.log("Joining client id:", id);

          for (let id2 in connections) {
            if (id2 === socketIdref.current) continue;

            try {
              connections[id2].addStream(window.localStream);
            } catch (e) {}
            connections[id2].createOffer().then((description) => {
              connections[id2]
                .setLocalDescription(description)
                .then(() => {
                  socketref.current.emit(
                    "signal",
                    id2,
                    JSON.stringify({ sdp: connections[id2].localDescription })
                  );
                })
                .catch((e) => console.log(e));
            });
          }
        }
      });
    });
  };
  let silence = () => {
    let ctx = new AudioContext();
    let oscillator = ctx.createOscillator();

    let dst = oscillator.connect(ctx.createMediaStreamDestination());

    oscillator.start();
    ctx.resume();
    return Object.assign(dst.stream.getAudioTracks()[0], { enable: false });
  };

  let black = ({ width = 640, height = 480 } = {}) => {
    let canvas = Object.assign(document.createElement("canvas"), {
      width,
      height,
    });
    canvas.getContext("2d").fillRect(0, 0, width, height);
    let stream = canvas.captureStream();
    return Object.assign(stream.getVideoTracks()[0], { enable: false });
  };

  let getUserMedia = () => {
    if ((video && videoAviallable) || (audio && audioAviallable)) {
      navigator.mediaDevices
        .getUserMedia({ video: video, audio: audio })
        .then(getUserMediaSuccess)
        .then((stream) => {})
        .catch((e) => {
          console.log(e);
        });
    } else {
      try {
        let tracks = localvideoref.current.srcObject.getTracks();
        tracks.forEach((track) => track.stop());
      } catch (e) {
        console.log(e);
      }
    }
  };
  useEffect(() => {
    if (video !== undefined && audio !== undefined) {
      getUserMedia();
    }
  }, [audio, video]);
  let getMedia = () => {
    setVideo(videoAviallable);
    setAudio(audioAviallable);
    ConnectToScoketServer();
  };
  let connect = () => {
    setAskForUsername(false);
    getMedia();
  };
  let handleVideo = () => {
    setVideo(!video);
  };
  let handleAudio = () => {
    setAudio(!audio);
  };
  let getDisplayMediaSucess = (stream) => {
    try {
      window.localStream.getTracks().forEach((track) => track.stop());
    } catch (e) {
      console.log(e);
    }
    window.localStream = stream;
    localvideoref.current.srcObject = stream;

    for (let id in connections) {
      if (id === socketIdref.current) continue;
      connections[id].addStream(window.localStream);
      connections[id].createOffer().then((description) => {
        connections[id]
          .setLocalDescription(description)
          .then(() => {
            socketref.current.emit(
              "signal",
              id,
              JSON.stringify({ sdp: connections[id].localDescription })
            );
          })
          .catch((e) => console.log(e));
      });
    }
    stream.getTracks().forEach(
      (track) =>
        (track.onended = () => {
          setScreen(false);

          try {
            let tracks = localvideoref.current.srcObject.getTracks();
            tracks.forEach((track) => track.stop());
          } catch (e) {
            console.log(e);
          }
          //TODO BlackSilence
          //   let blackslience = (...args) =>
          //     new MediaStream([black(...args), silence()]);
          //   window.localStream = blackslience();
          localvideoref.current.srcObject = window.localStream;
          getUserMedia();
        })
    );
  };
  let getDisplayMedia = () => {
    if (screen) {
      if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices
          .getDisplayMedia({ video: true, audio: true })
          .then(getDisplayMediaSucess)
          .then((stream) => {})
          .catch((e) => console.log(e));
      }
    }
  };
  useEffect(() => {
    if (screen !== undefined) {
      getDisplayMedia();
    }
  }, [screen]);
  let handleScreen = () => {
    setScreen(!screen);
  };
  let handleChat = () => {
    setModel(!showModel);
  };
  let sendMessage = () => {
    socketref.current.emit("chat-message", message, username);
    setMessage("");
  };
  let handleEndCall = () =>{
    try{
        let tracks = localvideoref.current.srcObject.getTracks();
        tracks.forEach(track=>track.stop())
    }catch(e){}

    routerTo("/Home")
    
  }
  return (
    <div>
      {askforusername === true ? (
        <div>
          <h2>Enter into Lobby</h2>
          {/* <p>{username}</p> */}
          <TextField
            id="outlined-basic"
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="outlined"
          />
          <Button variant="contained" onClick={connect}>
            Connect
          </Button>
          <div>
            <video ref={localvideoref} autoPlay muted></video>
          </div>
        </div>
      ) : (
        <div className={styles.meetVideoContainer}>
          {showModel ? (
            // <div className={styles.chatContainer}>
              <div className={styles.chatRoom}>
                <h1>Chat</h1>
                <div className={styles.chattingDisplay}>
                  {messages.map((item, index) => (
                    <div key={index}>
                      <p style={{ fontWeight: "bold" }}>{item.sender}</p>
                      <p>{item.data}</p>
                    </div>
                  ))}
                </div>
                <div className={styles.chattingArea}>
                  {/* {message}                    */}
                  <TextField
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    id="outlined-basic"
                    label="Enter Your Chat"
                    variant="outlined"
                  />
                  <Button variant="contained" onClick={sendMessage}>
                    Send
                  </Button>
                </div>
              </div>
            // </div>
          ) : (
            <></>
          )}

          <div className={styles.buttonContainer}>
            <IconButton onClick={handleVideo} style={{ color: "white" }}>
              {video === true ? <VideocamIcon /> : <VideocamOffIcon />}
            </IconButton>
            <IconButton onClick={handleAudio} style={{ color: "white" }}>
              {audio === true ? <MicIcon /> : <MicOffIcon />}
            </IconButton>
            <Badge badgeContent={newmessages} max={999} color="error">
              <IconButton onClick={handleChat} style={{ color: "white" }}>
                <ChatIcon />
              </IconButton>
            </Badge>
            {screenAvailable === true ? (
              <IconButton onClick={handleScreen} style={{ color: "white" }}>
                {screen === true ? (
                  <ScreenShareIcon />
                ) : (
                  <StopScreenShareIcon />
                )}
              </IconButton>
            ) : (
              <></>
            )}
            <IconButton onClick={handleEndCall} style={{ color: "red" }}>
              <CallEndIcon  />

            </IconButton>
          </div>
          <video
            ref={localvideoref}
            className={styles.meetUserVideo}
            autoPlay
          ></video>
          <div className={styles.conferenceview}>
            {videos
              .filter((video) => video.socketId !== socketref.current?.id)
              .map((video) => (
                <div key={video.socketId}>
                  {/* <h2 style={{ color: "white" }}>{video.socketId}</h2> */}
                  <video
                    data-socket={video.socketId}
                    ref={(ref) => {
                      if (ref && video.stream) {
                        ref.srcObject = video.stream;
                      }
                    }}
                    autoPlay
                  ></video>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
