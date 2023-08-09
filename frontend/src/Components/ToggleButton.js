import React, { useEffect, useState } from 'react';
import '../css/components/togglebutton.css'

const ToggleButton = ({
    symbol,
    init,
    defaultState,
    onToggleOn,
    onToggleOff
}) => {

    const [toggleState, setToggleState] = useState(defaultState || false);

    const handleClick = () => {
        setToggleState(prev => {
            const next = !prev;
            if (next) {
                onToggleOn();
            } else {
                onToggleOff();
            }
            return next;
        });
    }

    useEffect(() => {
        init();
    }, []);

  return (
    <button className={`toggle-button ${toggleState ? "active" : ""}`} onClick={handleClick}>
        <div className='circle-container'>
            <div className='circle'>{symbol}</div>
        </div>
    </button>
  )
}

export default ToggleButton