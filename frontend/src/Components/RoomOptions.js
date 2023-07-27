import React from "react";

import TooltipButton from "./TooltipButton";

import "./../css/components/roomoptions.css";

const RoomOptions = (
    {
        roomID,
        participants,
        setParticipantsViewVisibility
    }
) => {

    const copyRoomID = () => {
        navigator.clipboard.writeText(roomID);
    }

    return (
        <div id='room-options'>

            <div className='room-box'>
                <div className='room-id-text'>{roomID.toUpperCase()}</div>
                <TooltipButton 
                    classList="copy-btn sec-btn" 
                    buttonFunction={copyRoomID} 
                    buttonContent={
                        <>
                            <i className="fa-regular fa-clipboard"></i>
                        </>
                    }
                    tooltipDirection={2}
                    tooltipContent={"Copied!"}
                />
            </div>

            <button className='sec-btn participants-btn' onClick={() => setParticipantsViewVisibility(true)}>
            <i className="fa-regular fa-user-group"></i> {Object.keys(participants).length}
            </button>

        </div>
    )
}

export default RoomOptions