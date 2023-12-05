import { useState } from "react"

function getStyles(buttonClicked, buttonSize, imageColor) {
    if (buttonClicked) {
        return buttonSize < "30px" ? { height: buttonSize, width: buttonSize, border: `1px solid ${imageColor}`, boxShadow: `0px 0px 1px 1px ${imageColor}` } :
               buttonSize < "40px" ? { height: buttonSize, width: buttonSize, border: `1.5px solid ${imageColor}`, boxShadow: `0px 0px 2px 1px ${imageColor}` } :
                                     { height: buttonSize, width: buttonSize, border: `2px solid ${imageColor}`, boxShadow: `0px 0px 4px 1px ${imageColor}` }
    }
    return buttonSize < "40px" ? { height: buttonSize, width: buttonSize, boxShadow: `0px 0px 9px 2px ${imageColor}` } : 
                                 { height: buttonSize, width: buttonSize, boxShadow: `0px 0px 12px 3px ${imageColor}` }
}

function toggleButtonClick(setButtonClicked) {
    setButtonClicked(b => !b);
}

export function MainButton({buttonSize, Image, imageColor, imageSize, onClick, onMouseOver, onMouseOut}) {
    
    const [buttonClicked, setButtonClicked] = useState(false);

    return (
        <button className="main-button flex-c" style={getStyles(buttonClicked, buttonSize, imageColor)} onClick={onClick} onMouseOver={onMouseOver} onMouseOut={onMouseOut} onMouseDown={() => toggleButtonClick(setButtonClicked)} onMouseUp={() => toggleButtonClick(setButtonClicked)}>
            <Image color={imageColor} size={imageSize}></Image>
        </button>
    )
}