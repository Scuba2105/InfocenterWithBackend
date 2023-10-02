import { useState } from "react";
import { serverConfig } from "../server";

function toggleHovered(setHovered) {
    setHovered(h => !h);   
}

export function TooltipButton({content, boolean, toggleFunction}) {

    const [hovered, setHovered] = useState(false);
    
    return (
        <div className="tooltip-button">
            <div className="tooltip" style={hovered ? {opacity: 1} : {opacity: 0}}>{content}</div>
            <button onMouseOut={() => toggleHovered(setHovered)} onMouseOver={() => toggleHovered(setHovered)} onClick={toggleFunction} style={boolean ? {backgroundColor: '#ff69b4'} : {backgroundColor: 'rgb(3, 252, 156)'}}>
                <img className="add-new-edit-button" src={boolean ? `https://${serverConfig.host}:${serverConfig.port}/images/undo.svg` : `https://localhost:5000/images/edit.svg`} alt="edit"></img>
            </button>
        </div>
    );
}