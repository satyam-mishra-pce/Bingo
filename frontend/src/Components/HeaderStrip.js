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
        
        <div className='utils-wrapper'>
            <button id='exit-game-btn' onClick={leaveRoom} disabled={!visible}>Exit</button>
        </div>

    </div>
  )
}

export default HeaderStrip