import React from "react";

import "./../css/components/turnindicator.css";

const TurnIndicator = (
    {
        isMyTurn,
        participants,
        turn,
        started,
        resetRequired,
        reset
    }
) => {
    return (
        <div id='turn-indicator'>
            <div className='player-indicator'>
                {
                    resetRequired
                        ? "Game Over"
                        : (
                            isMyTurn ? "Your Turn" : `${turn === "Unset" ? "No-one": participants[turn]}'s Turn`
                        )
                }
            </div>
            <div className='directions'>
                {
                    resetRequired
                        ? (
                            <button onClick={reset}>Play Again</button>
                        )
                        : ( 
                            isMyTurn ? (
                                started ? `It's your turn. Tap on any number in the grid to mark it.` : "Tap any number in the grid to start the game."
                            ): (
                                started ? `Waiting for ${participants[turn]} to mark a number...` : `Waiting for ${participants[turn]} to start the game...`
                            )
                        )
                }
            </div>
        </div>
    )
}

export default TurnIndicator