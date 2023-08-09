import React, { useEffect, useState, useRef } from 'react';

import "./css/lobby.css";
import HeroImage from "./media/hero.webp";
import AsyncButton from './Components/AsyncButton';
import DisabledContext from './Contexts/DisabledContext';

const Lobby = ({
    createAndJoinRoom,
    joinRoom,
    isActive
}) => {

    const [tab, settab] = useState(0);
    const [limit, setlimit] = useState(2);
    const [name, setname] = useState("");
    const [roomIDForJoining, setRoomIDForJoining] = useState("");
    const [isLobbyActive, setLobbyActive] = useState(isActive);
    const autoFocusRef = useRef(undefined);

    useEffect(() => {
        setLobbyActive(isActive);
        if (isActive) {
            setTimeout(() => {
                autoFocus();
            }, 100);
        }
    }, [isActive]);

    const autoFocus = () => {
        if (autoFocusRef.current !== undefined) {
            autoFocusRef.current.focus();
        }
    }


  return (
    <DisabledContext.Provider value={!isLobbyActive}>
        <div id='lobby' className={`${isLobbyActive ? "active" : ""}`}>

            <div id='hero' style={{backgroundImage: `url(${HeroImage})`}}>

            </div>

            <div id='name-section'>
                <label htmlFor='name'>Name</label> 
                <input ref={autoFocusRef} id='name-input' name='name' type='text' placeholder='Enter your name' value={name} onInput={(evt) => setname(evt.target.value)} disabled={!isLobbyActive}/>
            </div>

            <div id='tab-slider-wrapper'>
                <div id='tab-slider'>
                    <button className={'tab-option' + ((tab === 0) ? " active" : "")} onClick={() => settab(0)} disabled={!isLobbyActive}>Create</button>
                    <button className={'tab-option' + ((tab === 1) ? " active" : "")} onClick={() => settab(1)} disabled={!isLobbyActive}>Join</button>
                </div>
            </div>

            {(tab === 0)
            ? 
                <div id='create-room-section'>
                    <div id='create-room-form'>
                        <label>Limit</label>
                        <div id='limit-box'>
                            <button className='primary-btn' onClick={() => setlimit(Math.max(2, limit - 1))} disabled = {limit === 2 || !isLobbyActive}><i className='fa-solid fa-minus'></i></button>
                            <div className='limit default-cursor'>{limit}</div>
                            <button className='primary-btn' onClick={() => setlimit(Math.min(10, limit + 1))} disabled = {limit === 10 || !isLobbyActive}><i className='fa-solid fa-plus'></i></button>
                        </div>
                    </div>
                    <div className='form-btn-grp'>
                        <AsyncButton 
                            id='create-room-btn' 
                            classList="primary-btn" 
                            onClick={ {
                                func: createAndJoinRoom, 
                                args: [name, limit]
                            } } 
                            content={"Create and Join Room"}
                            loadingFilter="white"
                            disabled={!isLobbyActive}
                        />
                    </div>
                </div>
            : 
                <div id='join-room-section'>
                    <div id='join-room-form'>
                        <label htmlFor='room'>Room Code</label>
                        <input 
                            id='room-input' 
                            name='room' 
                            type='text' 
                            placeholder='Room Code' 
                            value={roomIDForJoining} 
                            onInput={(evt) => setRoomIDForJoining(evt.target.value)}
                            disabled={!isLobbyActive}
                        />
                    </div>
                    <div className='form-btn-grp'>
                    <AsyncButton 
                            id='join-room-btn' 
                            classList="primary-btn" 
                            onClick={ {
                                func: joinRoom, 
                                args: [name, roomIDForJoining]
                            } } 
                            content={"Join Room"}
                            loadingFilter="white"
                            disabled={!isLobbyActive}
                        />
                    </div>
                </div>
            }

        </div>
    </DisabledContext.Provider>
  )
}

export default Lobby