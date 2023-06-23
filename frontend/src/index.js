import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom/client';
import io from 'socket.io-client';

import './css/index.css';

import Lobby from './Components/Lobby';
import Game from './Components/Game';

const socket = io.connect("https://bingo-node-server.glitch.me/");


const App = () => {

  const [roomID, setRoomID] = useState(undefined);
  const [issocketConnected, setSocketConnected] = useState(false);
  const [initialParticipants, setInitialParticipants] = useState({});
  const [initialTurn, setInitialTurn] = useState('');
  

  useEffect(() => {
    socket.on("connect", () => {
      setSocketConnected(true);
      console.log("socket connected");
    })

    return () => {
      socket.off("connect");
    }
  }, [])



  // Create and Join Room:
  const createAndJoinRoom = (username, limit) => {

    socket.emit("create-and-join-room", {
      'displayName': username,
      'limit': limit
    });

    socket.on("participants-changed", data => {
      socket.off("participants-changed");
      if(data.success) {
        console.log(`You created and joined Room ${data.response.roomID}`);
        socket.displayName = username;
        setInitialParticipants(data.response.participants);
        setInitialTurn(socket.id);
        setRoomID(data.response.roomID);
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


    socket.on("participants-changed", data => {
      socket.off("participants-changed");
      if(data.success) {
        console.log(`You joined Room ${data.response.roomID}`);
        socket.displayName = username;
        setInitialParticipants(data.response.participants);
        setInitialTurn(data.response.turn);
        setRoomID(data.response.roomID);

      } else {
        console.log("Could not join Room:", data.response.message);
      }
    })
  }



  // Leave Room:
  const leaveRoom = () => {
    socket.emit("leave-room");
    socket.on("participants-changed", data => {
      
      if (data["for"] !== socket.id) {
        return;
      }
      
      socket.off("participants-changed");
      if (data.success) {
        console.log("You left the room successfully.");
        setRoomID(undefined);
        setInitialTurn('');
        setInitialParticipants({});
      } else {
        console.log("You could not leave the room:", data.response);
      }
    })
  }


  return (
    <>
      {issocketConnected 
        ? (
          (roomID)
            ? (
              <Game socket = {socket} roomID = {roomID} initialTurn = {initialTurn} initialParticipants = {initialParticipants} leaveRoom = {leaveRoom} />
            )
            : (
              <Lobby createAndJoinRoom={createAndJoinRoom} joinRoom={joinRoom}/>
            )
        )
        : (<div>Connecting to socket...</div>)
      }
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);