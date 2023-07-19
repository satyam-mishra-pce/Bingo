import React from 'react';
import './../css/components/headerstrip.css';

import LogoText from './../media/LogoText.svg';

const HeaderStrip = (
    {
        leaveRoom,
        visible
    }
) => {

  return (
    <div id='headerstrip' className={visible ? "visible": ""}>

        <a className='title' href='/'>
          <img src={LogoText} />
        </a>
        
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