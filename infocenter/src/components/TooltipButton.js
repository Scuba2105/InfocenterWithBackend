import { useState } from "react";

export function TooltipButton({content, boolean, toggleFunction}) {

    const [hovered, setHovered] = useState(false);
    
    function toggleHovered() {
        setHovered(h => !h);   
    }

    return (
        <div className="tooltip-button">
            <div className="tooltip" style={hovered ? {opacity: 1} : {opacity: 0}}>{content}</div>
            <button onMouseOut={toggleHovered} onMouseOver={toggleHovered} onClick={toggleFunction} style={boolean ? {backgroundColor: '#ff69b4'} : {backgroundColor: 'rgb(16, 172, 105)'}}>
                <img className="add-new-edit-button" src={boolean ? `http://localhost:5000/images/undo.svg` : `http://localhost:5000/images/edit.svg`} alt="edit"></img>
            </button>
        </div>
    );
}