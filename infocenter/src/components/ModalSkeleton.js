import { capitaliseFirstLetters } from "../utils/utils"; 
import useMediaQueries from "media-queries-in-react"; 
import { useRef, useState } from 'react';
import { serverConfig } from "../server";

function getFormHeading(page, type, selectedData) {
    
    if (page === "staff") {
        const heading = type === "add-new" ? "Add New Employee" : `Update Employee Details`;
        return heading;
    }
    else if (page === "technical-info") {
        const heading = type === "add-new" ? "Add New Equipment" : `Update ${selectedData.model} Details`
        return heading;
    }
    else if (page === "utilities") {
        const heading = type === "check" ? "Check Genius 3 Returns" : `Manage Genius 3 Disposals`
        return heading;
    }
    else if (type === "change-password") {
        return "Change Password"
    }
}

function updatedPosition(isLaptopScreen, incrementData) {
    const laptopX = 375;
    const laptopY = 30;
    const desktopX = 625; 
    const desktopY = 100;
    
    let newX, newY

    if (isLaptopScreen) {
        newX = laptopX + incrementData.dx;
        newY = laptopY + incrementData.dy;
    }
    else {
        newX = desktopX + incrementData.dx; 
        newY = desktopY + incrementData.dy;
    }
    return ({newX: newX, newY: newY});
}

function formatTypeHeading(type) {
    let name;
    if (type === "config") {
        name = "configurations" 
    }
    else if (type === "software") {
        name = "Software Locations"
    }
    else {
        name = type;
    }

    return capitaliseFirstLetters(name);
}

function mouseDown(e, buttonClicked, startPosition) {
    buttonClicked.current = true;
    startPosition.current = {x: e.clientX, y: e.clientY}
} 

function mouseUp(buttonClicked, startPosition) {
    buttonClicked.current = false;
    startPosition.current = ({dx: 0, dy: 0});
}

function getCursorPosition(e, buttonClicked, startPosition, setIncrementChange) {
    if (buttonClicked.current) {
        const dx = e.clientX - startPosition.current.x; 
        const dy = e.clientY - startPosition.current.y; 
        setIncrementChange({dx: dx, dy: dy});
    }
}

export function ModalSkeleton({children, selectedData, closeModal, type, page}) {

    const buttonClicked = useRef(false);
    const startPosition = useRef(null);
    const [incrementChange, setIncrementChange] = useState({dx: 0, dy: 0});
    
    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    if (type === 'add-new' || type === 'update' || type === 'check' || type === 'disposal' || type === 'change-password') {
        return (
            <div className={mediaQueries.laptop ? `modal-container-laptop` : `modal-container-desktop`} style={(type === "software") && mediaQueries.laptop ? 
            { minHeight: 300 + 'px', left: updatedPosition(mediaQueries.laptop, incrementChange).newX +'px', top: updatedPosition(mediaQueries.laptop, incrementChange).newY + 'px'} : type !== "software" && mediaQueries.laptop ? { minHeight: 500 + 'px', left: updatedPosition(mediaQueries.laptop, incrementChange).newX +'px', top: updatedPosition(mediaQueries.laptop, incrementChange).newY + 'px'} :
            type === "software" && mediaQueries.desktop ? { minHeight: 500 + 'px', left: updatedPosition(mediaQueries.laptop, incrementChange).newX +'px', top: updatedPosition(mediaQueries.laptop, incrementChange).newY + 'px'} : 
            { minHeight: 500 + 'px', left: updatedPosition(mediaQueries.laptop, incrementChange).newX +'px', top: updatedPosition(mediaQueries.laptop, incrementChange).newY + 'px'}} onMouseMove={(e) => getCursorPosition(e, buttonClicked, startPosition, setIncrementChange)}>
                <div className="modal-title-bar" onMouseDown={(e) => mouseDown(e, buttonClicked, startPosition)} onMouseUp={() => mouseUp(buttonClicked, startPosition)}>
                    <div id="title-aligner"></div>     
                    <h2 className="model-title">{getFormHeading(page, type, selectedData)}</h2> 
                    <img className="cross" src={`http://${serverConfig.host}:${serverConfig.port}/images/cross.svg`} alt="cross" onClick={closeModal}></img> 
                </div>
                {children}
            </div> 
        )
    }
    else {
        return (
            <div className={mediaQueries.laptop ? `modal-container-laptop` : `modal-container-desktop`} style={type === "software" && mediaQueries.laptop ? 
            { minHeight: 300 + 'px', left: updatedPosition(mediaQueries.laptop, incrementChange).newX +'px', top: updatedPosition(mediaQueries.laptop, incrementChange).newY + 'px'} : type !== "software" && mediaQueries.laptop ? { minHeight: 500 + 'px', left: updatedPosition(mediaQueries.laptop, incrementChange).newX +'px', top: updatedPosition(mediaQueries.laptop, incrementChange).newY + 'px'} :
            type === "software" && mediaQueries.desktop ? { minHeight: 500 + 'px', left: updatedPosition(mediaQueries.laptop, incrementChange).newX +'px', top: updatedPosition(mediaQueries.laptop, incrementChange).newY + 'px'} : 
            { minHeight: 500 + 'px', left: updatedPosition(mediaQueries.laptop, incrementChange).newX +'px', top: updatedPosition(mediaQueries.laptop, incrementChange).newY + 'px'}} onMouseMove={(e) => getCursorPosition(e, buttonClicked, startPosition, setIncrementChange)}>
                <div className="modal-title-bar" onMouseDown={(e) => mouseDown(e, buttonClicked, startPosition)} onMouseUp={() => mouseUp(buttonClicked, startPosition)}>
                    <div id="title-aligner"></div>     
                    <h2 className="model-title">{type !== "update" ? `${selectedData.model} ${formatTypeHeading(type)}` : `Update ${selectedData.model} Resources`}</h2> 
                    <img className="cross" src={`http://${serverConfig.host}:${serverConfig.port}/images/cross.svg`} alt="cross" onClick={closeModal}></img> 
                </div>
                {children}
            </div> 
        )
    }
}