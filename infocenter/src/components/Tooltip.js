import { useState } from "react";

function toggleHovered(setHovered) {
    setHovered(h => !h);   
}

export function Tooltip({content, location, ButtonComponent, onClick}) {

    const [hovered, setHovered] = useState(false);
    
    if (location === "right") {
        return (
            <div className="tooltip-button-container flex-c">
                <ButtonComponent onMouseOver={() => toggleHovered(setHovered)} onMouseOut={() => toggleHovered(setHovered)} onClick={onClick}></ButtonComponent>
                <div className="tooltip" style={hovered ? {opacity: 1} : {opacity: 0}}>{content}</div>
            </div>
        );
    }
    else {
        return (
            <div className="tooltip-button-container flex-c">
                <div className="tooltip" style={hovered ? {opacity: 1} : {opacity: 0}}>{content}</div>
                <ButtonComponent onMouseOver={() => toggleHovered(setHovered)} onMouseOut={() => toggleHovered(setHovered)} onClick={onClick}></ButtonComponent>
            </div>
        );
    }
}