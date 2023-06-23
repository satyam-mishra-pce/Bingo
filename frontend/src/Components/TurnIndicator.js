import React from "react";

const TurnIndicator = (
    {
        isMyTurn,
        participants,
        turn,
        started,
        restartRequired,
        restart
    }
) => {
    return (
        <div id='turn-indicator'>
            <div className='player-indicator'>
                {
                    restartRequired
                        ? "Game Over"
                        : (
                            isMyTurn ? "Your Turn" : `${participants[turn]}'s Turn`
                        )
                }
            </div>
            <div className='directions'>
                {
                    restartRequired
                        ? (
                            <button onClick={restart}>Play Again</button>
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