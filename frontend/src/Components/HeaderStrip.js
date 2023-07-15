import React from 'react';
import './../css/components/headerstrip.css';

const HeaderStrip = (
    {
        leaveRoom,
        visible
    }
) => {

  return (
    <div id='headerstrip' className={visible ? "visible": ""}>

        <div className='title'>BINGO</div>
        
        <div className='exit-wrapper'>
            <button id='exit-game-btn' onClick={() => {
              if (visible) {
                leaveRoom();
              }  
            }}>Exit</button>
        </div>

    </div>
  )
}

export default HeaderStrip