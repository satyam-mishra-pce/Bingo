import React from "react";

import "./../css/components/markinghistory.css";

const MarkingHistory = (
    {
        markedNumbers,
        markMap
    }
    ) => {
    return (
        <div className='marked-wrapper'>
            <div className='title'>History</div>
            { markedNumbers.length === 0 
            ? (
                <div className='no-markings'>No numbers marked yet.</div>
            )
            : (
                <ul>
                {
                    markedNumbers.map(number => {
                    return (
                        <li key={'num-' + number}>
                        <div className='player-name'>{markMap[number]}</div>
                        <div className='number default-cursor'>{number}</div>
                        </li>
                    )
                    })
                }
                </ul>
            )
            }
        </div>
    )
}

export default MarkingHistory