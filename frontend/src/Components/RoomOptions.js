import React, { useContext } from "react";

import TooltipButton from "./TooltipButton";

import "./../css/components/roomoptions.css";
import DisabledContext from "../Contexts/DisabledContext";

const RoomOptions = (
    {
        roomID,
        participants,
        setParticipantsViewVisibility,
    }
) => {

    const isDisabled = useContext(DisabledContext);
    const copyRoomID = () => {
        navigator.clipboard.writeText(roomID);
    }

    return (
        <div id='room-options'>

            <div className='room-box'>
                <div className='room-id-text'>{roomID.toUpperCase()}</div>
                <TooltipButton 
                    buttonClassList="copy-btn sec-btn" 
                    buttonFunction={copyRoomID} 
                    buttonContent={
                        <>
                            <i className="fa-regular fa-clipboard"></i>
                        </>
                    }
                    tooltipDirection={2}
                    tooltipContent={"Copied!"}
                    buttonDisabled={isDisabled}
                />
            </div>

            <button className='sec-btn participants-btn' onClick={() => setParticipantsViewVisibility(true)} disabled = {isDisabled}>
                <i className="fa-regular fa-user-group"></i> {Object.keys(participants).length}
            </button>

        </div>
    )
}

export default RoomOptions