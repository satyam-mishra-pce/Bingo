import React, { useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import io from 'socket.io-client';

import './css/index.css';

import Splash from './Components/Splash';
import Lobby from './Lobby';
import HeaderStrip from './Components/HeaderStrip';
import Game from './Game';

let serverURL = (
  document.URL.startsWith("https://bingostreaks.web.app/") || document.URL.startsWith("https://bingostreaks.firebaseapp.com")
  ? "https://bingo-node-server.glitch.me/"
  : "http://localhost:8080"
  );
  const socket = io.connect(serverURL, { "secure": true });
  console.log("Connecting to:", serverURL);
  
  
  const App = () => {
    
    const [isSocketConnected, setSocketConnected] = useState(false);
    const [isSplashAnimating, setSplashAnimating] = useState(false);
    const [view, setView] = useState(0);
    const interactionPanelRef = useRef(undefined);

    // Function to animate between views in InteractionPanel
    const animateViews = (parentRef, currentPositionIndex, nextPositionIndex) => {
      const children = parentRef.current.children;
      const currentChild = children[currentPositionIndex];
      const nextChild = children[nextPositionIndex];
      const currentWidth = currentChild.offsetWidth;
      const nextWidth = nextChild.offsetWidth;
      if (currentPositionIndex < nextPositionIndex) {
        nextChild.style.left = (currentWidth + 100) + "px";
      } else {
        nextChild.style.left = (-nextWidth - 100) + "px";
      }
      currentChild.classList.add("transitioning");
      nextChild.classList.add("transitioning");
      setTimeout(() => {
        if (currentPositionIndex < nextPositionIndex) {
          currentChild.style.left = (-currentWidth - 100) + "px";
        } else {
          currentChild.style.left = (nextWidth + 100) + "px";
        }
        nextChild.style.left = "0";
        nextChild.style.opacity = "1";
        currentChild.style.opacity = "0";
        setTimeout(() => {
          currentChild.classList.remove("transitioning");
          nextChild.classList.remove("transitioning");
          currentChild.classList.remove("active");
          nextChild.classList.add("active");
        }, 300);
      }, 20);
    }
    
    // Add resize listener on every view change.
    useEffect(() => {
      if (interactionPanelRef.current === undefined)
      return;

      const interactionPanel = interactionPanelRef.current;
    
      const obs = new ResizeObserver( entries => {
        console.log(entries, interactionPanel.children, view);
        interactionPanel.style.height = entries[0].borderBoxSize[0].blockSize + "px";
        interactionPanel.style.width = entries[0].borderBoxSize[0].inlineSize + 2 + "px";
        
        // Remove phantom views while resizing:
        for (let i = 0; i < interactionPanel.children.length; i++) {
          if (i < view) {
            interactionPanel.children[i].style.left = -100 - interactionPanel.children[i].offsetWidth + "px";
          } else if (i > view) {
            interactionPanel.children[i].style.left = entries[0].borderBoxSize[0].inlineSize + 200 + "px";
          }          
        }
      })

      obs.observe(interactionPanel.children[view]);
    
      return () => {
        obs.unobserve(interactionPanel.children[view]);
      }
    }, [view]);

    // Set the dimensions of interactionPanel on first render
    // Also, set the splash animating false after 3s of first render
    useEffect(() => {
        setTimeout(() => {
          const interactionPanel = interactionPanelRef.current;
        }, 20);
        setTimeout(() => {
          setSplashAnimating(false);
        }, 3100);
    }, []);

    // Socket Connectivity
    useEffect(() => {
      socket.on("connect", () => {
        setSocketConnected(true);
        console.log("Socket connected:", socket.id);
      })
      
      return () => {
        socket.off("connect");
      }
    }, []);
  
    useEffect(() => {
      if (isSocketConnected && !isSplashAnimating) {
        if (interactionPanelRef.current === undefined)
        return
        
        
        const interactionPanel = interactionPanelRef.current;
        
        setTimeout(() => {

          interactionPanel.style.opacity = 0;
          interactionPanel.style.display = null;
          const children = interactionPanel.children;
          children[0].style.left = "0";
          const firstHeight = children[0].offsetHeight;
          const firstWidth = children[0].offsetWidth;
          for (let i = 1; i < children.length; i++) {
            children[i].style.left = firstWidth + "px";
          }
          interactionPanel.style.height = firstHeight + "px";
          interactionPanel.style.width = firstWidth + "px";
          setTimeout(() => {
            interactionPanel.style.opacity = null;
            interactionPanel.classList.add("bounce-in");
            setTimeout(() => {
              interactionPanel.classList.remove("bounce-in");
            }, 1000)
          }, 300);
        }, 1800)
      }
    }, [isSocketConnected, isSplashAnimating])
    
    
    // Create and Join Room:
    const createAndJoinRoom = (username, limit) => {
      
    socket.emit("create-and-join-room", {
      'displayName': username,
      'limit': limit
    });
    
    socket.on("create-and-join-room", data => {
      socket.off("create-and-join-room");
      if (data.success) {
        console.log(`You created and joined room.`);
        socket.displayName = username;
        animateViews(interactionPanelRef, 0, 1);
        setView(1);
      } else {
        console.log("Room creation failed:", data.response.message);
      }
    })
    
  }
  

  

  // Join Room:
  const joinRoom = (username, roomID) => {

    socket.emit("join-room", {
      'displayName': username,
      'roomID': roomID
    });


    socket.on("join-room", data => {
      socket.off("join-room");
      if (data.success) {
        console.log(`You joined the room.`);
        socket.displayName = username;
        animateViews(interactionPanelRef, 0, 1);
        setView(1);
      } else {
        console.log("Could not join Room:", data.response.message);
      }
    })
  }

  // Leave Room:
  const leaveRoom = () => {
    socket.emit("leave-room");
    socket.on("leave-room", data => {
      socket.off("leave-room");
      if (data.success) {
        console.log("You left the room successfully.");
        animateViews(interactionPanelRef, 1, 0);
        setView(0);
      } else {
        console.log("You could not leave the room:", data.response.message);
      }
    })
  }


  return (
    <>
      <HeaderStrip leaveRoom={leaveRoom} visible = {view === 1}/>
      <div id='backdrop'>
        <Splash fadeOut = {isSocketConnected && !isSplashAnimating} />
        <div id='interaction-panel' ref={interactionPanelRef} style={{display: "none"}}>
          <Lobby
            createAndJoinRoom={createAndJoinRoom} 
            joinRoom={joinRoom} 
          />
          <Game
            socket={socket} 
            leaveRoom = {leaveRoom}
          />
        </div>
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<React.StrictMode><App /></React.StrictMode>);