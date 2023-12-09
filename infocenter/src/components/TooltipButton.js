import { useState } from "react";
import { serverConfig } from "../server";
import { delayFunctionInitiation } from "../utils/utils"
import tinycolor from "tinycolor2";

function toggleHovered(setHovered) {
    delayFunctionInitiation(() => {
        setHovered(h => !h);   
    })
}

export function TooltipButton({content, boolean, translateY="0px", toggleFunction}) {

    const [hovered, setHovered] = useState(false);
    
    // Set the background color
    const btnColor = boolean ? '#ff69b4' : 'rgb(3, 252, 156)'

    // Get the darker color for the button gradient.
    const darkBtnColorObject = tinycolor(btnColor).darken(20);
    const darkBtnColor = (`rgb(${darkBtnColorObject["_r"]}, ${darkBtnColorObject["_g"]}, ${darkBtnColorObject["_b"]})`)


    return (
        <div className="tooltip-button flex-c-col" style={{transform: `translateY(${translateY})`}}>
            <div className="tooltip" style={hovered ? {opacity: 1} : {opacity: 0}}>{content}</div>
            <button className="tooltip-button-img flex-c-col form-button-transition" onMouseOut={() => toggleHovered(setHovered)} onMouseOver={() => toggleHovered(setHovered)} onClick={toggleFunction} style={{background: `linear-gradient(${btnColor}, ${darkBtnColor})`}}>
                <img className="add-new-edit-button" src={boolean ? `https://${serverConfig.host}:${serverConfig.port}/images/undo.svg` : `https://${serverConfig.host}:${serverConfig.port}/images/edit.svg`} alt="edit"></img>
            </button>
        </div>
    );
}