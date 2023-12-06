import { useState } from "react";

function handleButtonClick(onClick) {
    setTimeout(() => {
        onClick();
    }, 150)
}

function handleHover(setHovered) {
    setHovered(true);
}

function handleMouseOut(setHovered) {
    setHovered(false);
}

export function FormButton({content, btnColor, onClick, marginTop="30px", marginBottom="20px", marginLeft="0px", marginRight="0px"}) {
    
    const [hovered, setHovered] = useState(false);

    return (
        <div className="form-button-container form-btn-transition" style={{border: `1.3px solid ${btnColor}`, margin: `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`}} onMouseOver={() => handleHover(setHovered)} onMouseOut={() => handleMouseOut(setHovered)}>
            <div className="form-button" style={hovered ? {color: "#192130"} : {color: btnColor}} onClick={() => handleButtonClick(onClick)}>{content}</div>
            <div className={hovered ? "form-button-after form-button-hover-after form-btn-transition" : "form-button-after form-btn-transition"} style={hovered ? {background: btnColor, boxShadow: `0 0 10px ${btnColor}`} : null}></div>
        </div>
    )
}