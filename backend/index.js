const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');
const { asyncGetRoom, getRoom, getParticipants, createAndJoinRoom, joinRoom, getNextTurn, leaveRoom } = require('./functions');

const app = express();
app.use(cors());
const http = require('http');
const server = http.createServer(app);


const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

io.on("connection", socket => {

  // Handle new connections:
  console.log("New connection:", socket.id);



  // Handle Create and Join Room:
  socket.on("create-and-join-room", async data => {
    const limit = data.limit;
    const displayName = data.displayName;

    try {
      const response = await createAndJoinRoom(limit, socket, displayName, io);

      socket.emit("participants-changed", {
        "success": true,
        response,
        "from": displayName,
        "event": "create-and-join-room"
      })

    } catch (error) {
      console.log(error);
      // console.log(io.sockets.adapter.rooms);
      socket.emit("participants-changed", {
        "success": false,
        "response": {
          "message": error.message
        },
        "from": displayName,
        "event": "create-and-join-room"
      })

    }
  
  })
  


  // Handle Join Room:
  socket.on("join-room", data => {
    const roomID = data.roomID;
    const displayName = data.displayName;

    try {
      const response = joinRoom(roomID, socket, displayName, io);

      socket.in(roomID).emit("participants-changed", {
        "success": true,
        response,
        "from": displayName,
        "event": "join-room"
      })

    } catch (error) {

      socket.emit("participants-changed", {
        "success": false,
        "response": {
          "message": error.message
        },
        "from": displayName,
        "event": "join-room"
      })

    }

  })



  // Handle Marking Numbers:
  socket.on("mark-number", data => {
    const roomID = [...socket.rooms][0];
    const room = getRoom(io, roomID);
    
    if (data.status)
    room["status"] = data.status

    const participants = getParticipants(io, room);
    const nextTurn = getNextTurn(participants, roomID, io);

    socket.in(roomID).emit("mark-number", {
      'success': true,
      'response': {
        'number': data.number,
        'turn': nextTurn,
      },
      'event': 'mark-number',
      'from': socket.displayName
    })
    
  })



  // Handle Winning:
  socket.on("win", () => {
    const roomID = [...socket.rooms][0];
    const displayName = socket.displayName;
    const room = getRoom(io, roomID);
    room["status"] = "waiting";
    socket.in(roomID).emit("game-over", {
      'winnerID': socket.id,
      'winnerName': displayName
    })
  })


  // Handle Leave Room:
  socket.on("leave-room", async () => {
    
    try {
      const roomID = [...socket.rooms][0];
      const response = leaveRoom(roomID, socket, io);

      const room = await asyncGetRoom(io, roomID);
      
      if (room) {
        
        socket.in(roomID).emit("participants-changed", {
        "success": true,
        response,
        "from": socket.displayName,
          "event": "leave-room"
        })

      }

      socket.emit("participants-changed", {
        "success": true,
        response,
        "from": socket.displayName,
        "event": "leave-room",
        "for": socket.id
      })

    } catch (error) {

      socket.emit("participants-changed", {
        "success": false,
        "response": {
          "message": error.message
        },
        "from": socket.displayName,
        "event": "leave-room",
        "for": socket.id
      })

    }

  })



  // Handle Abnormal Game Leaves:
  socket.on("disconnecting", () => {

    const roomID = [...socket.rooms][0];
    if (roomID == socket.id) {
      console.log(`${socket.displayName} left from lobby.`);
      return;
    }

    try {

      const response = leaveRoom(roomID, socket, io);
      console.log(`${socket.displayName} disconnected.`);
      socket.in(roomID).emit("participants-changed", {
        "success": true,
        response,
        "from": socket.displayName,
        "event": "disconnect"
      })

    } catch (error) {
      console.log(`Could not notify disconnection of ${socket.data.displayName} due to`, error);
    }


  })

})



const PORT = 8080;

server.listen(PORT, () => {
  console.log("Listening on port", PORT);
})