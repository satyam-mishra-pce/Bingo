import React, { useState, useEffect, useContext } from 'react';

import './../css/components/participantsview.css';
import AsyncButton from './AsyncButton';
import DisabledContext from '../Contexts/DisabledContext';

const ParticipantsView = (
    {
        userID,
        participants,
        participantsViewVisibility,
        setParticipantsViewVisibility,
        leaveRoom
    }
) => {

    const [invisible, setInvisible] = useState(true);
    const [nodisplay, setNodisplay] = useState(true);

    const isDisabled = useContext(DisabledContext);

    useEffect(() => {

        if (participantsViewVisibility) {
            setNodisplay(false);
            setTimeout(() => {
                setInvisible(false);
            }, 10);
        }

        else {
            setInvisible(true);
            setTimeout(() => {
                setNodisplay(true);
            }, 250);
        }

    }, [participantsViewVisibility]);

    return (
        <div id='participants-view-backdrop' className={`${invisible ? "invisible": ""} ${nodisplay ? "nodisplay" : ""}`} >
            <div className='participants-view-box'>
                <div className='title'>
                    <h1>Participants</h1>
                    <button className='close-btn' onClick={() => setParticipantsViewVisibility(false)} disabled = {isDisabled}>
                        <i className='fa-regular fa-xmark'></i>
                    </button>
                </div>

                <ul className='participants-list'>
                    {
                        [...Object.keys(participants)].map(participant_key => {
                            return(
                                    <li className='participant' key={participant_key}>
                                        <div className='participant-info'>
                                            <div className='profile-placeholder'></div>
                                            <div className='display-name'>{participants[participant_key]}</div>
                                        </div>
                                        {
                                            participant_key === userID &&
                                            <div className='user-options'>
                                                <AsyncButton 
                                                    id='leave-rooom-btn'
                                                    classList='leave-btn'
                                                    onClick={{
                                                        func: leaveRoom,
                                                        args: [],
                                                        positiveCallback: () => {setParticipantsViewVisibility(false)}
                                                    }}
                                                    content={<i className="fa-regular fa-arrow-right-from-bracket"></i>}
                                                    loadingFilter="white"
                                                    disabled={isDisabled}
                                                />
                                            </div>
                                        }
                                    </li>
                            )
                        })
                    }
                </ul>
            </div>
        </div>
    )
}

export default ParticipantsView