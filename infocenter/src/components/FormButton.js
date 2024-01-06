import { useState } from "react";
import tinycolor from "tinycolor2";

function handleButtonClick(onClick) {
    console.log(onClick)
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
    
    let darkBtnColorObject;
    if (content === "Delete") {
        // Get the darker color for the button gradient.
        darkBtnColorObject = tinycolor(btnColor).darken(8);
    }
    else {
        // Get the darker color for the button gradient.
        darkBtnColorObject = tinycolor(btnColor).darken(30);
    }
    
    // Generate the dark button color from the darkBtnColorObject properties.
    const darkBtnColor = (`rgb(${darkBtnColorObject["_r"]}, ${darkBtnColorObject["_g"]}, ${darkBtnColorObject["_b"]})`)
    
    return (
        <div className="form-button-container form-btn-transition" style={{margin: `${marginTop} ${marginRight} ${marginBottom} ${marginLeft}`}} onMouseOver={() => handleHover(setHovered)} onMouseOut={() => handleMouseOut(setHovered)}>
            <div className="form-button" style={hovered ? {color: "#192130"} : {color: btnColor}} onClick={() => handleButtonClick(onClick)}>{content}</div>
            <div className={hovered ? "form-button-after form-button-hover-after form-btn-transition" : "form-button-after form-btn-transition"} style={hovered ? {background: `linear-gradient(${btnColor}, ${darkBtnColor})`, boxShadow: `0 0 10px ${btnColor}`} : null}></div>
        </div>
    )
}