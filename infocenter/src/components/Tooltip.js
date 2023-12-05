import { useState } from "react";

function toggleHovered(setHovered) {
    setHovered(h => !h);   
}

export function Tooltip({content, xPos, yPos, btnColor, btnTranslateX="0px", btnTranslateY="0px", ButtonComponent, onClick, href}) {

    const [hovered, setHovered] = useState(false);
    
    return (
        <div className="tooltip-button-container flex-c" style={{transform: `translate(${btnTranslateX}, ${btnTranslateY})`}}>
            <div className="tooltip-relative-parent">
                <div className="main-btn-tooltip" style={hovered ? {opacity: 1, left: xPos, top: yPos} : {opacity: 0, left: xPos, top: yPos}}>{content}</div>
            </div>
            <ButtonComponent onMouseOver={() => toggleHovered(setHovered)} onMouseOut={() => toggleHovered(setHovered)} onClick={onClick} href={href} imageColor={btnColor} ></ButtonComponent>
        </div>
    );
}
