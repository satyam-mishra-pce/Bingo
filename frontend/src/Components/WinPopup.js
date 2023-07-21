import React, { useEffect, useState, useRef } from 'react';
import './../css/components/winpopup.css';
import JSConfetti from 'js-confetti';


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
    const confettiCanvasRef = useRef(null);
    const [jsConfetti, setJsConfetti] = useState(null);
    const [isWinner, setWinner] = useState(false);
    const [invisible, setInvisible] = useState(true);
    const [nodisplay, setNodisplay] = useState(true);


    // Inititialize confettiCanvas in the first render
    useEffect(() => {
        if (confettiCanvasRef.current) {
            initJSConfetti();
        }
    }, []);

    
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
    })
    
    
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

    const initJSConfetti = () => {
        const confettiCanvas = confettiCanvasRef.current;
        setJsConfetti( new JSConfetti({ confettiCanvas }) );
    }


    const celebrate = () => {
        jsConfetti.addConfetti({
            confettiRadius: 10
        });
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
            <canvas id='confetti-canvas' ref={confettiCanvasRef}></canvas>
            <div id='win-popup'>
                <div className='title'>
                    <h1>{title}</h1>
                    <button className='close-popup-btn' onClick={closePopup}>
                        <i className='fa-regular fa-xmark'></i>
                    </button>
                </div>

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
                            <button className='primary-btn' onClick={(evt) => {
                                const btn = evt.target;
                                btn.disabled = true;
                                celebrate();
                                setTimeout(() => {
                                    btn.disabled = false;
                                }, 1000);
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