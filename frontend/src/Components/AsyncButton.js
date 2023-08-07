import React, { useState } from 'react';

import loadingIcon from "../media/loading-icon.svg";

const AsyncButton = ({
    id,
    classList,
    content,
    onClick,
    loadingFilter,
    disabled
}) => {

    const [buttonState, setButtonState] = useState("loaded");

    const handleOnClick = () => {
        setButtonState("loading");
        onClick.func.apply(null, onClick.args).then(data => {
            if (onClick.positiveCallback !== undefined) {
                onClick.positiveCallback();
            }
        }).catch(err => {
            if (onClick.negativeCallback !== undefined) {
                onClick.negativeCallback();
            }
        }).finally(() => {
            setButtonState("loaded");
            if (onClick.callback !== undefined) {
                onClick.callback();
            }
        })
    }

    return (
        <button 
            id={id}
            className={classList + (" " + buttonState)} 
            onClick={handleOnClick} 
            style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center"
            }}
            disabled={disabled || buttonState==="loading"}
        >
            {content}
            {
                (buttonState === "loading")
                    ?
                        <img 
                            src={loadingIcon} 
                            height="16px" 
                            style={{
                                marginLeft: "5px", 
                                filter: `var(--filter-${loadingFilter})`, 
                                animation: `rotate-loader linear 2s infinite`
                            }}
                            alt=''
                        />
                    :
                        <></>
            }
        </button>
    )
}

export default AsyncButton