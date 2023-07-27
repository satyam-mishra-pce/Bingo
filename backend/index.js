const express = require("express");
const cors = require("cors");
const { Server } = require("socket.io");
const { asyncGetRoom, getRoom, getParticipants, createAndJoinRoom, joinRoom, getNextTurn, leaveRoom } = require("./functions");

const app = express();
app.use(cors());
const http = require("http");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*"
  }
})

const maxNameLength = 20;

io.on("connection", socket => {

  // Handle new connections:
  console.log("New connection:", socket.id);

  // Handle Create and Join Room:
  socket.on("create-and-join-room", async data => {
    const limit = data.limit;
    let displayName = data.displayName.trim();
    if (displayName.length > maxNameLength) {
        displayName = displayName.slice(0, maxNameLength);
    }
    if (displayName == "") {
        const randomNum = Math.floor((Math.random() * 10000) + 1);
        const leadingZeroes = "0".repeat(5 - ("" + randomNum).length);
        displayName = `Player ${leadingZeroes}${randomNum}`;
    }


    try {
      const response = await createAndJoinRoom(limit, socket, displayName, io);

      socket.emit("create-and-join-room", {
        "success": true,
        response
      })
      socket.emit("participants-changed", {
        "success": true,
        response,
        "fromName": displayName,
        "fromID": socket.id,
        "event": "create-and-join-room"
      })

    } catch (error) {
      socket.emit("create-and-join-room", {
        "success": false,
        "response": {
          "message": error.message
        }
      })
    }
  
  })
  


  // Handle Join Room:
  socket.on("join-room", data => {
    const roomID = data.roomID.toUpperCase();
    let displayName = data.displayName.trim();
    if (displayName.length > maxNameLength) {
        displayName = displayName.slice(0, maxNameLength);
    }
    if (displayName == "") {
        const randomNum = Math.floor((Math.random() * 10000) + 1);
        const leadingZeroes = "0".repeat(5 - ("" + randomNum).length);
        displayName = `Player ${leadingZeroes}${randomNum}`;
    }

    try {
      const response = joinRoom(roomID, socket, displayName, io);
      socket.emit("join-room", {
        "success": true,
        response
      });
      socket.in(roomID).emit("participants-changed", {
        "success": true,
        response,
        "fromName": displayName,
        "fromID": socket.id,
        "event": "join-room"
      })

    } catch (error) {
      socket.emit("join-room", {
        "success": false,
        "response": {
          "message": error.message
        }
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
      "success": true,
      "response": {
        "number": data.number,
        "turn": nextTurn,
      },
      "event": "mark-number",
      "fromName": socket.displayName
    })
    
  })



  // Handle Winning:
  socket.on("win", () => {
    const roomID = [...socket.rooms][0];
    const displayName = socket.displayName;
    const room = getRoom(io, roomID);
    socket.in(roomID).emit("game-over", {
      "winnerID": socket.id,
      "winnerName": displayName
    })
  })

  

  // Handle Game Reset:
  socket.on("reset", () => {
    const roomID = [...socket.rooms][0];
    const room = getRoom(io, roomID);
    const displayName = socket.displayName;
    if (room["status"] === "waiting") {
      socket.in(roomID).emit("reset", {
        "success": false,
        "response": {
          "message": "Room is already ready for a new game."
        },
        "event": "reset",
        "fromName": displayName
      })
    } else {
      room["status"] = "waiting";
      socket.in(roomID).emit("reset", {
        "success": true,
        "event": "reset",
        "fromName": displayName
      })
    }
  })


  // Handle Leave Room:
  socket.on("leave-room", async () => {
    
    const socketid = socket.id;
    try {
      const roomID = [...socket.rooms][0];
      const response = leaveRoom(roomID, socket, io);

      const room = await asyncGetRoom(io, roomID);
      
      if (room) {
        socket.in(roomID).emit("participants-changed", {
        "success": true,
        response,
        "fromName": socket.displayName,
        "fromID": socketid,
        "event": "leave-room"
        })

      }

      socket.emit("leave-room", {
        "success": true,
        response
      })

    } catch (error) {

      socket.emit("leave-room", {
        "success": false,
        "response": {
          "message": error.message
        }
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
        "fromName": socket.displayName,
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