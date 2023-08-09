import React, { useContext, useEffect, useState } from 'react';
import './../css/components/winpopup.css';
import ReactCanvasConfetti from 'react-canvas-confetti';
import DisabledContext from '../Contexts/DisabledContext';

const WinPopup = (
    {
        socket,
        setHaltMode,
        setResetRequired
    }
) => {
    
    const title = "Game Over";
    const [winnerList, setWinnerList] = useState([]);
    const [isGameOver, setGameOver] = useState(false);
    const [isWinner, setWinner] = useState(false);
    const [invisible, setInvisible] = useState(true);
    const [nodisplay, setNodisplay] = useState(true);

    const isDisabled = useContext(DisabledContext);

    // confetti states:
    const [fire, setFire] = useState(false);

    const confettiStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 2000,
        pointerEvents: 'none'
    }


    
    // Listen for wins.
    useEffect(() => {
        socket.on("game-over", data => {
            
            // Data hash format is: id#name
            const datahash = data.winnerID + "#" + data.winnerName;
            
            // Update the winner list:
            setWinnerList( prev => {
                return [...prev, datahash];
            });

            // If the winner is user.
            if (data.winnerID === socket.id) {
                setWinner(true);
                setTimeout(() => {
                    celebrate(); 
                }, 250);
            }
        });
        
        return () => {
            socket.off("game-over");
        }
    }, [socket]);
    
    
    // Check if the game is over using the winners array
    useEffect(() => {
        if (winnerList.length === 0) {
            setGameOver(false);
        } else {
            setHaltMode(true);
            setGameOver(true);
            setResetRequired(true);
        }
    }, [winnerList]);


    // Show the popup if the game is over
    useEffect(() => {
        if (isGameOver) {
            startPopup();
        }
    }, [isGameOver]);

    const celebrate = () => {
        setFire(true);
        setTimeout(() => {
            setFire(false);
        })
    }

    const startPopup = () => {
        setNodisplay(false);
        setTimeout(() => {
            setInvisible(false);
        }, 100);
    }

    const closePopup = () => {
        setInvisible(true);
        setTimeout(() => {
            setNodisplay(true);
            
            // Reset the state variables on close.
            setWinnerList([]);
            setWinner(false);
        }, 200);

    }


    return (
        <div id='win-popup-backdrop' className={`${nodisplay ? "nodisplay": ""} ${invisible ? "invisible" : ""}`}>
            <ReactCanvasConfetti 
                style={confettiStyle}
                fire={fire}
                particleCount={1400}
                spread={120}
                origin={{x: 0.5, y: 1.4}}
                ticks={300}
                startVelocity={150}
                gravity={1.6}
                scalar={1.15}
            />
            <div id='win-popup'>
                <div className='title'>
                    <h1>{title}</h1>
                    <button className='close-popup-btn' onClick={closePopup} disabled={isDisabled}>
                        <i className='fa-regular fa-xmark'></i>
                    </button>
                </div>
                <div className='winner-caption'>Winner{winnerList.length === 1 ? " is" : "s are"}:</div>

                <ul id='winner-list'>
                    {
                        winnerList.map(winner => {
                            const hashIndex = winner.indexOf("#");
                            return (
                                <li key={winner.substring(0, hashIndex)}>
                                    <div className='visuals'>
                                        <div style={{
                                            height: "80px",
                                            width: "80px",
                                            borderRadius: "40px",
                                            background: "pink",
                                            border: "1px solid rgb(0, 0, 0, 0.3)"
                                        }}>

                                        </div>
                                    </div>
                                    <div className='text'>
                                        {winner.substring(hashIndex + 1)}
                                    </div>
                                </li>
                            );
                        })
                    }
                </ul>
                
                {isWinner 
                    ? (
                        <div className='btn-group'>
                            <button disabled={isDisabled} className='primary-btn' onClick={(evt) => {
                                const btn = evt.target;
                                btn.disabled = isDisabled || true;
                                celebrate();
                                setTimeout(() => {
                                    btn.disabled = isDisabled || false;
                                }, 2500);
                            }}>Celebrate</button>
                        </div>
                    )
                    : (
                        ""
                    )
                }
                
            </div>
        </div>
    )
}

export default WinPopup;