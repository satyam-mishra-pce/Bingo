import React from "react";

import "./../css/components/roomoptions.css";

const RoomOptions = (
    {
        roomID,
        participants
    }
) => {

    const copyRoomID = () => {
        navigator.clipboard.writeText(roomID);
    }

    return (
        <div id='room-options'>

            <div className='room-box'>
                <div className='room-id-text'>{roomID.toUpperCase()}</div>
                <button className='copy-btn sec-btn' onClick={copyRoomID}>
                    <i className="fa-regular fa-clipboard"></i>
                </button>
            </div>

            <button className='sec-btn participants-btn'>
            <i className="fa-regular fa-user-group"></i> {Object.keys(participants).length}
            </button>

        </div>
    )
}

export default RoomOptions