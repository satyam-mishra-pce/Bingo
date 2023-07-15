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
    
    useEffect(() => {
        if (confettiCanvasRef.current) {
            initJSConfetti();
        }
    }, [])
    
    useEffect(() => {
        socket.on("game-over", data => {
            const datahash = data.winnerID + "#" + data.winnerName;
            console.log("Got a winner:", datahash);
            setWinnerList( prev => {
                return [...prev, datahash];
            });
            if (data.winnerID === socket.id) {
                setWinner(true);
                setHaltMode(true);
                setTimeout(() => {
                    celebrate(); 
                }, 250);
            }
        });
        
        return () => {
            socket.off("game-over");
        }
    })
    
    
    useEffect(() => {
        // console.log(winnerList);
        if (winnerList.length === 0) {
            setGameOver(false);
        } else {
            setGameOver(true);
            setResetRequired(true);
        }
    }, [winnerList]);


    useEffect(() => {
        if (isGameOver) {
            startPopup();
        } else {
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
        const backDrop = document.getElementById("win-popup-backdrop");
        backDrop.classList.remove("nodisplay");
        setTimeout(() => {
            backDrop.classList.remove("invisible");
        }, 100);
    }

    const closePopup = () => {
        const backDrop = document.getElementById("win-popup-backdrop");
        backDrop.classList.add("invisible");
        setTimeout(() => {
            backDrop.classList.add("nodisplay");
        }, 500);
        setGameOver(false);
        setWinnerList([]);
        setWinner(false);
    }


    return (
        <div id='win-popup-backdrop' onClick={
            () => {
                    // setWinnerList([...winnerList, "user" + winnerList.length + "#ABCDEFGHIJKLMNOPQRST"]);
            }
        } className='invisible nodisplay'>
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