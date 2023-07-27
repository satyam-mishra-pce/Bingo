import React, {useState} from 'react';

import "./../css/components/tooltipbutton.css";

const TooltipButton = (
    {
        id,
        classList = "",
        buttonContent = "",
        buttonFunction = () => {},
        buttonDisabled = false,
        tooltipDirection = 0,
        tooltipContent = 0,
        autoCloseTooltip = true,
        tooltipForm = <></>
    }
) => {

  // Usefull for CSS Classes addition.
  const cornerOrientation = {
    0: "bottom", // The tooltip would display above the button
    1: "left", // The tooltip would display to the right of the button
    2: "top", // The tooltip would display below the button
    3: "right"  // The tooltip would display to the left of the button
  }

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const showTooltip = () => {
    setTooltipVisible(true);

    // Auto Close Popup after a time period
    if (autoCloseTooltip) {
      setTimeout(() => {
        setTooltipVisible(false);
      }, 5000);
    }
  }

  return (
    <button 
      disabled={buttonDisabled}
      className={"tooltip-btn " + classList} 
      onClick={
        () => {
          buttonFunction();
          showTooltip();
        }
      }

      onBlur={
        () => {
          if (autoCloseTooltip) {
            setTooltipVisible(false);
          }
        }
      }
      id={id}
    >
        {buttonContent}
        <div className={`tooltip ${cornerOrientation[tooltipDirection]} ${tooltipVisible ? "" : "invisible"}`}>
            <div className='tooltip-inner'>
                {tooltipContent}
                <div className='tooltip-form'>
                  {tooltipForm}
                </div>
                <div className={`tooltip-corner ${cornerOrientation[tooltipDirection]}`}></div>
            </div>
        </div>
    </button>
  )
}

export default TooltipButton