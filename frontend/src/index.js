import React, { createContext, useEffect, useRef, useState } from 'react';
import ReactDOM from 'react-dom/client';
import io from 'socket.io-client';

import './css/index.css';

import Splash from './Components/Splash';
import Lobby from './Lobby';
import HeaderStrip from './Components/HeaderStrip';
import Game from './Game';

import Toast from './Components/Toast';
import useElementSize from './Hooks/useElementSize';

let serverURL = (
  document.URL.startsWith("https://bingostreaks.web.app/") || document.URL.startsWith("https://bingostreaks.firebaseapp.com")
    ? "https://bingo-node-server.glitch.me/"
    : "http://localhost:8080"
);
const socket = io.connect(serverURL, { "secure": true });
console.log("Connecting to:", serverURL);


const App = () => {

  const [isSocketConnected, setSocketConnected] = useState(false);
  const [isSplashAnimating, setSplashAnimating] = useState(true);
  const [view, setView] = useState(null);
  const [toastObjects, setToastObjects] = useState([]);
  const interactionPanelRef = useRef(undefined);
  const [resizeObs, setResizeObs] = useState(null);


  // Function to add toasts
  const addToast = (
    id, message,
    hasButton = false,
    buttonText = "",
    buttonFunction = () => { },
    tooltipContent = ""
  ) => {
    setToastObjects(prev => {
      if (prev.length === 4) {
        prev.shift();
      }
      return [
        ...prev,
        {
          id, message, hasButton, buttonText, buttonFunction, tooltipContent
        }
      ];
    })
  }

  // Function to remove a toast by toastID
  const removeToast = toastID => {
    setToastObjects(prev => {
      const newObjects = [];
      for (let obj of prev) {
        if (obj.id === toastID)
          continue

        newObjects.push(obj);
      }
      return [...newObjects]
    });
  }

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
      adjustInteractionPanel(nextPositionIndex);
      nextChild.style.left = "0";
      nextChild.style.opacity = "1";
      currentChild.style.opacity = "0";
      setTimeout(() => {
        currentChild.classList.remove("transitioning");
        nextChild.classList.remove("transitioning");
        setView(nextPositionIndex);
      }, 300);
    }, 20);
  }



  const adjustInteractionPanel = (newView) => {
    const interactionPanel = interactionPanelRef.current;
    for (let i = 0; i < interactionPanel.children.length; i++) {
      if (i === newView) {
        resizeObs.observe(interactionPanel.children[i]);
      } else {
        resizeObs.unobserve(interactionPanel.children[i]);
      }
    }
  }
  
  
  // Set the dimensions of interactionPanel on first render
  // Also, set the splash animating false after 3s of first render
  useEffect(() => {
    const interactionPanel = interactionPanelRef.current;

    const obs = new ResizeObserver(entries => {
      interactionPanel.style.height = entries[0].borderBoxSize[0].blockSize + "px";
      interactionPanel.style.width = entries[0].borderBoxSize[0].inlineSize + 2 + "px";
    });
    setResizeObs(obs);
    
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


  // Remove the splash once animation is complete and socket is connected.
  useEffect(() => {
    if (isSocketConnected && !isSplashAnimating) {

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
            //Attach Adjustment Hook / Listener
            adjustInteractionPanel(0);
            //Auto Focus for the first time:
            //⚠️⚠️⚠️ Remember to update the element here, if you change autofocus config on the lobby page ⚠️⚠️⚠️
            interactionPanel.children[0].querySelector("#name-input").focus();
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

    const promise = new Promise((resolve, reject) => {
      
      const id = Date.now() + Math.floor(Math.random() * 10000);

      const autoReject = setTimeout(() => {
        socket.off("create-and-join-room");
        addToast(id, `Could not create room: Unable to connect.`);
        reject({"status": false, "message": "Unable to connect."});
      }, 5000);

      socket.on("create-and-join-room", data => {
        clearTimeout(autoReject);
        socket.off("create-and-join-room");
        if (data.success) {
          addToast(
            id,
            "You joined a fresh room. You can invite your friends now.",
            true,
            "Copy Room Code",
            () => {
              navigator.clipboard.writeText(data.response.roomID);
            },
            "Copied!"
          );
          socket.displayName = username;
          animateViews(interactionPanelRef, 0, 1);
          resolve({"status": true});
        } else {
          addToast(id, `Could not create room: ${data.response.message}`);
          resolve({"status": true});        }
      })
      


    })

    return promise;

  }




  // Join Room:
  const joinRoom = (username, roomID) => {

    socket.emit("join-room", {
      'displayName': username,
      'roomID': roomID
    });

    const promise = new Promise((resolve, reject) => {
      
      const id = Date.now() + Math.floor(Math.random() * 10000);

      const autoReject = setTimeout(() => {
        socket.off("join-room");
        addToast(id, `Could not join room: Unable to connect.`);
        reject({"status": false, "message": "Unable to connect."});
      }, 5000);

      socket.on("join-room", data => {
        clearTimeout(autoReject);
        socket.off("join-room");
        if (data.success) {
          addToast(
            id,
            "You joined a room. You can also invite your friends.",
            true,
            "Copy Room Code",
            () => {
              navigator.clipboard.writeText(data.response.roomID);
            },
            "Copied!"
          );
          socket.displayName = username;
          animateViews(interactionPanelRef, 0, 1);
          resolve({"status": true});
        } else {
          addToast(id, `Could not join room: ${data.response.message}`);
          resolve({"status": true});

        }
      });

    });

    return promise;
  }

  // Leave Room:
  const leaveRoom = () => {
    socket.emit("leave-room");

    const promise = new Promise((resolve, reject) => {
      
      const id = Date.now() + Math.floor(Math.random() * 10000);
      const autoReject = setTimeout(() => {
        socket.off("leave-room");
        addToast(id, "Cannot leave room: Unable to connect.");
        reject({"status": false, "message": "Unable to connect."})
      }, 5000);

      socket.on("leave-room", data => {
        clearTimeout(autoReject);
        socket.off("leave-room");
        if (data.success) {
          addToast(id, "You left the room.");
          animateViews(interactionPanelRef, 1, 0);
          resolve({"status": true});
        } else {
          addToast(id, `Could not leave the room: ${data.response.message}`);
          resolve({"status": true});
        }
      });

    })

    return promise;
  }


  return (
    <>
      <HeaderStrip visible={isSocketConnected && !isSplashAnimating} />
      <div id='backdrop'>
        <Splash fadeOut={isSocketConnected && !isSplashAnimating} />
        <div id='interaction-panel' ref={interactionPanelRef} style={{ display: "none" }}>
          <Lobby
            createAndJoinRoom={createAndJoinRoom}
            joinRoom={joinRoom}
            isActive={view === 0 || view === null}
          />
          <Game
            socket={socket}
            leaveRoom={leaveRoom}
            addToast={addToast}
            isActive={view === 1}
          />
        </div>
      </div>

      <div id="toasts-container">
        {
          // Toast Messages
          toastObjects.map((toastObject, index) => {
            const isLast = index === toastObjects.length - 1;
            return <Toast
              key={toastObject.id}
              id={toastObject.id}
              message={toastObject.message}
              hasButton={toastObject.hasButton}
              buttonText={toastObject.buttonText}
              buttonFunction={toastObject.buttonFunction}
              isLast={isLast}
              dispose={removeToast}
              tooltipContent={toastObject.tooltipContent}
            />
          })
        }
      </div>
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <App />
  // </React.StrictMode>
);