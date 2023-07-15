import React from 'react';
import { useRef } from 'react';

import "./../css/components/splash.css";

import Logo from "./../media/Logo.svg";
import LogoText from "./../media/LogoText.svg";
import loadingIcon from "./../media/loading-icon.svg";

const Splash = (
    {
        fadeOut
    }
) => {

    const splashRef = useRef(undefined);
    if (fadeOut) {
      
        const splash = splashRef.current;
        splash.classList.add("fade-out");
        setTimeout(() => {
            splash.style.opacity = "0";
            setTimeout(() => {
                splash.style.display = "none";
            }, 300);
        }, 1500);

    }

    return (
        <div id='splash' ref={splashRef}>
            <div id='splash-animation-wrapper'>
                <img src={Logo} height="100px" width="100px" className='logo' alt='logo'/>
                <div className='logo-text-animator'>
                    <div className='logo-text-wrapper'>
                        <img src={LogoText} width="300px" alt='logo-with-text'/>
                    </div>
                </div>
            </div>
            <div id='loading-circle-wrapper'>
                <img src={loadingIcon} alt='loading-icon' height="24px"/>
            </div>
        </div>
    )
}

export default Splash;