import { useState } from "react"

function getStyles(buttonClicked, buttonSize, imageColor) {
    if (buttonClicked) {
        return { border: `2px solid ${imageColor}` }
    }
    return buttonSize === "small" ? { boxShadow: `0px 0px 9px 2px ${imageColor}` } : { boxShadow: `0px 0px 12px 3px ${imageColor}` }
}

function toggleButtonClick(setButtonClicked) {
    setButtonClicked(b => !b);
}

export function MainButton({buttonSize, Image, imageColor, imageSize, onClick, onMouseOver, onMouseOut}) {
    
    const [buttonClicked, setButtonClicked] = useState(false);

    return (
        <button className={buttonSize === "small" ? "main-button-small flex-c" : "main-button flex-c"} style={getStyles(buttonClicked, buttonSize, imageColor)} onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut} onMouseDown={() => toggleButtonClick(setButtonClicked)} onMouseUp={() => toggleButtonClick(setButtonClicked)}>
            <Image color={imageColor} size={imageSize}></Image>
        </button>
    )
}