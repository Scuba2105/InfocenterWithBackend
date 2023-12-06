import { useState } from "react"

function getStyles(buttonClicked, buttonSize, imageColor) {
    if (buttonClicked) {
        return buttonSize < "30px" ? { height: buttonSize, width: buttonSize, boxShadow: `0px 0px 2px 1px ${imageColor}` } :
               buttonSize < "40px" ? { height: buttonSize, width: buttonSize, boxShadow: `0px 0px 3px 1px ${imageColor}` } :
                                     { height: buttonSize, width: buttonSize, boxShadow: `0px 0px 5px 1px ${imageColor}` }
    }
    return buttonSize < "40px" ? { height: buttonSize, width: buttonSize, boxShadow: `0px 0px 9px 2px ${imageColor}` } : 
                                 { height: buttonSize, width: buttonSize, boxShadow: `0px 0px 12px 3px ${imageColor}` }
}

function toggleButtonClick(setButtonClicked) {
    setButtonClicked(b => !b);
}

export function MainButton({buttonType="button", buttonSize, href, Image, imageColor="#BCE7FD", imageSize, onClick, onMouseOver, onMouseOut}) {
    
    const [buttonClicked, setButtonClicked] = useState(false);

    if (buttonType === "link") {
        return (
            <a className="main-button flex-c main-btn-transition" href={href} style={getStyles(buttonClicked, buttonSize, imageColor)} onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut} onMouseDown={() => toggleButtonClick(setButtonClicked)} onMouseUp={() => toggleButtonClick(setButtonClicked)}>
                <Image color={imageColor} size={imageSize}></Image>
            </a>
        ) 
    }
    return (
        <button className="main-button flex-c main-btn-transition" style={getStyles(buttonClicked, buttonSize, imageColor)} onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut} onMouseDown={() => toggleButtonClick(setButtonClicked)} onMouseUp={() => toggleButtonClick(setButtonClicked)}>
            <Image color={imageColor} size={imageSize}></Image>
        </button>
    )
}