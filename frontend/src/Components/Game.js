import React from 'react'
import { useState, useEffect } from 'react';

import './../css/game.css';

import RoomOptions from './RoomOptions';
import TurnIndicator from './TurnIndicator';
import MarkingHistory from './MarkingHistory';
import WinPopup from './WinPopup';

import { getRandomNumbers } from '../functions';


const Game = ({
    socket,
    roomID,
    initialTurn,
    initialParticipants,
    leaveRoom,
  }) => {

  const [turn, setTurn] = useState(initialTurn);
  const [participants, setParticipants] = useState(initialParticipants);
  const [gridNumbers, setGridNumbers] = useState(getRandomNumbers(25));
  const [winningCriteria, setWinningCriteria] = useState([]);
  const [markingHistory, setMarkingHistory] = useState({});
  const [markedNumbers, setMarkedNumbers] = useState([]);
  const [isMyTurn, setMyTurn] = useState(turn === socket.id);
  const [haltMode, setHaltMode] = useState(false);
  const [restartRequired, setRestartRequired] = useState(false);

  // Handle checking for your turn
  useEffect(() => {
    setMyTurn(turn === socket.id);
  }, [turn, socket]);

  // Handle socket incoming events
  useEffect(() => {

    // Handle change in participants
    socket.on("participants-changed", data => {
      
      if (!data.success) {
        return;
      }
      if (data["for"]) {
        return;
      }

      console.log("Participants changed");
      setParticipants(data.response.participants);
      setTurn(data.response.turn);

    })

    // Handle a mark request
    socket.on('mark-number', data => {
      setHaltMode(false);
      
      if (!data.success) {
        return;
      }

      const number = data.response.number;
      
      const button = document.querySelector(`button.grid-btn.num-${number}`);
      button.classList.remove('temp-marked');
      
      setMarkedNumbers( prev => {
        return [number, ...prev]; 
      });

      setMarkingHistory( prev => {
        return {
          ...prev,
          [number]: [data.from]
        }
      });

      setTurn(data.response.turn);
      
    })

    return () => {
      socket.off("participants-changed");
      socket.off('mark-number');
    }
  }, [socket]);

  // Handle calculating winning criteria
  useEffect(() => {
    let newCriteria = [[], []];
    let gridSize = gridNumbers.length;
    let rowSize = Math.sqrt(gridSize);

    for (let i = 0; i < rowSize; i++ ) {
      newCriteria[0].push(gridNumbers[(rowSize + 1) * i]);
      newCriteria[1].push(gridNumbers[(rowSize - 1) * (i + 1)]);
      let row = [];
      let col = [];
      for (let j = 0; j < rowSize; j++ ) {
        row.push(gridNumbers[i * rowSize + j]);
        col.push(gridNumbers[j * rowSize + i]);
      }
      newCriteria.push(row);
      newCriteria.push(col);
    }

    setWinningCriteria(newCriteria);
  }, [gridNumbers]);

  // Handle winning
  useEffect(() => {
    let score = getScore();
    const winningScore = Math.floor(Math.sqrt(gridNumbers.length));
    
    if (score >= winningScore)
    score = winningScore;

    const boardLetters = document.querySelectorAll(".game-board .bingo-marker .bingo-letter");
    for (let i = 0; i < score; i++) {
      boardLetters[i].classList.add("marked");
    }

    if (score === winningScore)
    socket.emit("win");

  }, [markingHistory])
  
  // Handle sending a mark-number request
  const markNumber = (number) => {

    // 0. Check if the turn is user's.
    // 1. Check if the halt mode was false.
    // 2. Check if the number is not already marked.
    // 3. Disable the other buttons meanwhile
    // 4. Mark the number in database

    console.log("Marking event fired for", number);
    if (!isMyTurn) {
      console.log("Turn is not yours!");
      return;
    }
    
    if (haltMode) {
      console.log("Please wait...");
      return;
    }

    if (markedNumbers.includes(number.toString())) {
      console.log(`${number} is already marked.`);
      return;
    }
    
    setHaltMode(true);
    let data = {
      'number': number.toString()
    }
    if (markedNumbers.length === 0)
      data["status"] = "started";

    socket.emit("mark-number", data);
    
    const button = document.querySelector(`button.grid-btn.num-${number}`);
    button.classList.add('temp-marked');

  }

  // Function to check if user won
  const getScore = () => {
    let score = 0;
    winningCriteria.forEach(row => {
      let tempScore = 0;
      row.forEach(number => {
        if (number in markingHistory)
        tempScore += 1;
      });
      if (tempScore === row.length)
      score += 1;
    });

    return score;
  }
  
  // Function to restart the game
  const restart = () => {
    if (!restartRequired)
    return
    
    setGridNumbers(getRandomNumbers(25));
    setMarkingHistory({});
    setMarkedNumbers([]);
    setHaltMode(false);
    setRestartRequired(false);
  }

  return (
    <div id='game'>

      <div id='topbar'>
        <div className='title'>BINGO</div>
        <div className='exit-wrapper'>
          <button id='exit-game-btn' onClick={() => leaveRoom()}>Exit</button>
        </div>
      </div>

      <div className='under'></div>
      
      <div className='backdrop'>
        <div className='game-frame'>

          < RoomOptions roomID = {roomID} participants = {participants}/>
          
          <div className='splitter'>

            <div className={'game-board-wrapper' + (isMyTurn ? " my-turn " : "")}>
              <div className='game-board'>

                <div className='bingo-marker'>
                  <div className='bingo-letter b'>B</div>
                  <div className='bingo-letter i'>I</div>
                  <div className='bingo-letter n'>N</div>
                  <div className='bingo-letter g'>G</div>
                  <div className='bingo-letter o'>O</div>
                </div>

                <div id='bingo-grid'>
                  {
                    gridNumbers.map((number) => {
                      return <button 
                        className={`grid-btn num-${number} ${(number in markingHistory) ? "marked" : ""}`} 
                        key={`num-${number}`} 
                        onClick={
                          () => {
                            markNumber(number);
                          }
                        }>{number}</button>
                    })
                  }
                </div>
              </div>

              < TurnIndicator
                isMyTurn = {isMyTurn} 
                participants = {participants} 
                turn = {turn} 
                started={markedNumbers.length !== 0} 
                restartRequired = {restartRequired}
                restart = {restart}
              />
            </div>


            < MarkingHistory markedNumbers = {markedNumbers} markMap = {markingHistory}/>
            
          </div>
        </div>
      </div>
      <WinPopup socket = {socket} setHaltMode = {setHaltMode} setRestartRequired = {setRestartRequired}/>
    </div>
  )
}

export default Game