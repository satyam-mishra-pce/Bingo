import React from 'react';
import './../css/components/headerstrip.css';

import LogoText from './../media/LogoText.svg';
import ToggleButton from './ToggleButton';

const HeaderStrip = (
    {
        visible
    }
) => {


  const init = () => {
    goLight();
  }
  
  const goLight = () => {
    const colors = {
      "--fg-100": "0, 0, 0",
      "--fg-90": "10, 10, 10",
      "--fg-85": "15, 15, 15",
      "--fg-80": "20, 20, 20",
      "--fg-75": "30, 30, 30",
      "--fg-70": "40, 40, 40",
      "--fg-60": "50, 50, 50",
      "--fg-50": "60, 60, 60",
      "--fg-40": "75, 75, 75",
      "--fg-30": "90, 90, 90",
      "--fg-20": "100, 100, 100",
      "--fg-10": "110, 110, 110",
      "--fg-0": "120, 120, 120",
    
      "--bg-100": "255, 255, 255",
      "--bg-90": "245, 245, 245",
      "--bg-80": "235, 235, 235",
      "--bg-70": "225, 225, 225",
      "--bg-60": "215, 215, 215",
    }

    const root = document.documentElement;
    for (const key in colors) {
      root.style.setProperty(key, colors[key]);
    }
  }
  
  const goDark = () => {
    const colors = {
      "--fg-100": "255, 255, 255",
      "--fg-90": "245, 245, 245",
      "--fg-85": "240, 240, 240",
      "--fg-80": "230, 230, 230",
      "--fg-75": "220, 220, 220",
      "--fg-70": "210, 210, 210",
      "--fg-60": "200, 200, 200",
      "--fg-50": "190, 190, 190",
      "--fg-40": "180, 180, 180",
      "--fg-30": "170, 170, 170",
      "--fg-20": "155, 155, 155",
      "--fg-10": "145, 145, 145",
      "--fg-0": "135, 135, 135",

      "--bg-100": "50, 50, 50",
      "--bg-90": "35, 35, 35",
      "--bg-80": "22, 22, 22",
      "--bg-70": "10, 10, 10",
      "--bg-60": "0, 0, 0",
    }

    const root = document.documentElement;
    for (const key in colors) {
      root.style.setProperty(key, colors[key]);
    }
  }
  

  return (
    <div id='headerstrip' className={visible ? "visible": ""}>

        <a className='title' href='/'>
          <img src={LogoText} />
        </a>
        
        <div className='utils-wrapper'>
          <ToggleButton symbol={<><i className='fa fa-moon'></i></>} init = {init} defaultState={false} onToggleOn = {goDark} onToggleOff={goLight}/>
        </div>

    </div>
  )
}

export default HeaderStrip