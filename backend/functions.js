const generateRoomID = length => {
    // Generate a 6-character room ID using randomized lowercase letters and digits
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let roomID = '';
    for (let i = 0; i < length; i++) {
        roomID += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return roomID;
}



const asyncGetRoom = (io, roomID) => {
    return new Promise ((resolve) => {
        setTimeout(() => {
            resolve(io.sockets.adapter.rooms.get(roomID));
        }, 5);
    })
}

const getRoom = (io, roomID) => {
    return io.sockets.adapter.rooms.get(roomID);
}

const getParticipants = (io, room) => {
    let participants = {};
    room.forEach((id) => {
        participants[id] = io.sockets.sockets.get(id).displayName;
    })

    return participants;
} 



const createAndJoinRoom = async (limit, firstUser, displayName, io) => {

    const previousRoomID = [...firstUser.rooms][0];
    const newRoomID = generateRoomID(6);
    firstUser.leave(previousRoomID);
    firstUser.join(newRoomID);
    firstUser.displayName = displayName;

    let room = await asyncGetRoom(io, newRoomID);
    room["limit"] = Math.min(10, Math.max(2, limit));
    room["turn"] = firstUser.id;
    room["status"] = "waiting";

    let participants = {};
    participants[firstUser.id] = firstUser.displayName;

    return {
        "roomID": newRoomID,
        "participants": participants,
        "turn": firstUser.id
    }
}



const joinRoom = (roomID, user, displayName, io) => {
    let room = getRoom(io, roomID);
    
    if (room == undefined) 
    throw new Error("Room is not available.")

    let participants = getParticipants(io, room);
    undefined
    if (room["status"] == "started") 
    throw new Error("Game has already started.");

    if (Object.keys(participants).length >= room["limit"])
    throw new Error("Room has reached it's limit.");

    const previousRoomID = [...user.rooms][0];
    user.leave(previousRoomID);
    user.join(roomID);
    user.displayName = displayName;

    participants[user.id] = displayName;

    return {
        "roomID": roomID,
        "turn": room["turn"],
        "participants": participants
    }
}



const getNextTurn = (participants, roomID, io) => {
    
    const room = getRoom(io, roomID);
    const turn = room["turn"];
    const participantIDs = Object.keys(participants);
    const index = participantIDs.indexOf(turn);
    const length = participantIDs.length;
    const nextIndex = (index + 1) % length;
    const nextTurn = participantIDs[nextIndex];

    room["turn"] = nextTurn;
    return nextTurn;
}



const leaveRoom = (roomID, user, io) => {
    
    const room = getRoom(io, roomID);
    const participants = getParticipants(io, room);
    const turn = room["turn"];
    
    let response = {};
    response['turn'] = (turn == user.id) ? getNextTurn(participants, roomID, io) : turn;
    
    user.leave(roomID);
    user.join(user.id);

    delete participants[user.id];
    response['participants'] = participants;
    response["roomID"] = roomID;
    
    return response;
}


module.exports = { asyncGetRoom, getRoom, getParticipants, createAndJoinRoom, joinRoom, getNextTurn, leaveRoom};