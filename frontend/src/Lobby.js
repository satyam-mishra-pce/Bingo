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
    <div id='lobby' className='active'>

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
                <div id='create-room-form'>
                    <label>Limit</label>
                    <div id='limit-box'>
                        <button className='primary-btn' onClick={() => setlimit(Math.max(2, limit - 1))} disabled = {limit === 2}><i className='fa-solid fa-minus'></i></button>
                        <div className='limit default-cursor'>{limit}</div>
                        <button className='primary-btn' onClick={() => setlimit(Math.min(10, limit + 1))} disabled = {limit === 10}><i className='fa-solid fa-plus'></i></button>
                    </div>
                </div>
                <div className='form-btn-grp'>
                    <button id='create-room-btn' className="primary-btn" onClick={() => {createAndJoinRoom(name, limit)}}>Create and Join Room</button>
                </div>
            </div>
        : 
            <div id='join-room-section'>
                <div id='join-room-form'>
                    <label htmlFor='room'>Room Code</label>
                    <input id='room-input' name='room' type='text' placeholder='Room Code' value={roomIDForJoining} 
                        onInput={(evt) => setRoomIDForJoining(evt.target.value)}
                    />
                </div>
                <div className='form-btn-grp'>
                    <button id='join-room-btn' className='primary-btn' onClick={() => joinRoom(name, roomIDForJoining)}>Join Room</button>
                </div>
            </div>
        }

    </div>
  )
}

export default Lobby