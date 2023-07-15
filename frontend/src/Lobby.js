import React from 'react';
import { useState } from 'react';

import "./css/lobby.css";
import HeroImage from "./media/hero.svg";

const Lobby = ({
    createAndJoinRoom,
    joinRoom
}) => {

    const [tab, settab] = useState(0);
    const [limit, setlimit] = useState(2);
    const [name, setname] = useState("");
    const [roomIDForJoining, setRoomIDForJoining] = useState("");



  return (
    <div id='lobby'>

        <div id='hero' style={{backgroundImage: `url(${HeroImage})`}}>

        </div>

        <div id='name-section'>
            <label htmlFor='name'>Name</label> <input id='name-input' name='name' type='text' placeholder='John Doe' value={name} onInput={(evt) => setname(evt.target.value)}/>
        </div>

        <div id='tab-slider-wrapper'>
            <div id='tab-slider'>
                <button className={'tab-option' + ((tab === 0) ? " active" : "")} onClick={() => settab(0)}>Create</button>
                <button className={'tab-option' + ((tab === 1) ? " active" : "")} onClick={() => settab(1)}>Join</button>
            </div>
        </div>

        {(tab === 0)
        ? 
            <div id='create-room-section'>
                <span className='label'>Limit</span>
                <div id='limit-box'>
                    <button className='dec primary-btn' onClick={() => setlimit(Math.max(2, limit - 1))} disabled = {limit === 2}>-</button>
                    <div className='limit'>{limit}</div>
                    <button className='inc primary-btn' onClick={() => setlimit(Math.min(10, limit + 1))} disabled = {limit === 10}>+</button>
                </div>
                <button id='create-room-btn' className={"primary-btn"} onClick={() => {createAndJoinRoom(name, limit)}}>Create and Join Room</button>
            </div>
        : 
            <div id='join-room-section'>
                <div id='room-form'>
                    <label htmlFor='room'>Room Code</label> <input id='room-input' name='room' type='text' placeholder='Room Code' value={roomIDForJoining} onInput={(evt) => setRoomIDForJoining(evt.target.value)}/>
                </div>
                <button id='join-room-btn' onClick={() => joinRoom(name, roomIDForJoining)}>Join Room</button>
            </div>
        }

    </div>
  )
}

export default Lobby