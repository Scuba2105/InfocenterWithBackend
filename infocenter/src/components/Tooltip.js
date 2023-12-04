import { useState } from "react";

function toggleHovered(setHovered) {
    setHovered(h => !h);   
}

export function Tooltip({content, ButtonComponent, onClick}) {

    const [hovered, setHovered] = useState(false);
    
    return (
        <div className="tooltip-button flex-c-col">
            <div className="tooltip" style={hovered ? {opacity: 1} : {opacity: 0}}>{content}</div>
            <ButtonComponent onMouseOver={() => toggleHovered(setHovered)} onClick={onClick}></ButtonComponent>
        </div>
    );
}