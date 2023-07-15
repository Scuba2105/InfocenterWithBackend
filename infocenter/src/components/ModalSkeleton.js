import { capitaliseFirstLetters } from "../utils/utils"; 
import useMediaQueries from "media-queries-in-react" 
import { useRef, useState } from 'react'

const scrollDocumentsDevices = ['PIIC iX']

function updatedPosition(isLaptopScreen, incrementData) {
    const laptopX = 375
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

export function ModalSkeleton({children, selectedData, closeModal, type, page}) {

    const buttonClicked = useRef(false);
    const startPosition = useRef(null);
    const [incrementChange, setIncrementChange] = useState({dx: 0, dy: 0});
    
    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    let scrollDocuments = "no-scroll"; 
    if (type === 'documents' && scrollDocumentsDevices.includes(selectedData.model)) {
        scrollDocuments  = 'scroll';
    } 
    

    function mouseDown(e) {
        buttonClicked.current = true;
        startPosition.current = {x: e.clientX, y: e.clientY}
    } 

    function mouseUp() {
        buttonClicked.current = false;
        startPosition.current = ({dx: 0, dy: 0});
    }

    function getCursorPosition(e) {
        if (buttonClicked.current) {
            const dx = e.clientX - startPosition.current.x; 
            const dy = e.clientY - startPosition.current.y; 
            setIncrementChange({dx: dx, dy: dy});
        }
    }
    if (type === 'add-new') {
        return (
            <div className={mediaQueries.laptop ? `modal-container-laptop ${scrollDocuments}` : `modal-container-desktop ${scrollDocuments}`} style={type === "software" && mediaQueries.laptop ? 
            { minHeight: 300 + 'px', left: updatedPosition(mediaQueries.laptop, incrementChange).newX +'px', top: updatedPosition(mediaQueries.laptop, incrementChange).newY + 'px'} : type !== "software" && mediaQueries.laptop ? { minHeight: 500 + 'px', left: updatedPosition(mediaQueries.laptop, incrementChange).newX +'px', top: updatedPosition(mediaQueries.laptop, incrementChange).newY + 'px'} :
            type === "software" && mediaQueries.desktop ? { minHeight: 500 + 'px', left: updatedPosition(mediaQueries.laptop, incrementChange).newX +'px', top: updatedPosition(mediaQueries.laptop, incrementChange).newY + 'px'} : 
            { minHeight: 500 + 'px', left: updatedPosition(mediaQueries.laptop, incrementChange).newX +'px', top: updatedPosition(mediaQueries.laptop, incrementChange).newY + 'px'}} onMouseMove={getCursorPosition}>
                <div className="modal-title-bar" onMouseDown={mouseDown} onMouseUp={mouseUp}>
                    <div id="title-aligner"></div>     
                    <h2 className="model-title">{page === "staff" ? "Add New Employee" : "Add New Equipment"}</h2> 
                    <img className="cross" src={`http://localhost:5000/images/cross.svg`} alt="cross" onClick={closeModal}></img> 
                </div>
                {children}
            </div> 
        )
    }
    else {
        return (
            <div className={mediaQueries.laptop ? `modal-container-laptop ${scrollDocuments}` : `modal-container-desktop ${scrollDocuments}`} style={type === "software" && mediaQueries.laptop ? 
            { minHeight: 300 + 'px', left: updatedPosition(mediaQueries.laptop, incrementChange).newX +'px', top: updatedPosition(mediaQueries.laptop, incrementChange).newY + 'px'} : type !== "software" && mediaQueries.laptop ? { minHeight: 500 + 'px', left: updatedPosition(mediaQueries.laptop, incrementChange).newX +'px', top: updatedPosition(mediaQueries.laptop, incrementChange).newY + 'px'} :
            type === "software" && mediaQueries.desktop ? { minHeight: 500 + 'px', left: updatedPosition(mediaQueries.laptop, incrementChange).newX +'px', top: updatedPosition(mediaQueries.laptop, incrementChange).newY + 'px'} : 
            { minHeight: 500 + 'px', left: updatedPosition(mediaQueries.laptop, incrementChange).newX +'px', top: updatedPosition(mediaQueries.laptop, incrementChange).newY + 'px'}} onMouseMove={getCursorPosition}>
                <div className="modal-title-bar" onMouseDown={mouseDown} onMouseUp={mouseUp}>
                    <div id="title-aligner"></div>     
                    <h2 className="model-title">{type !== "update" ? `${selectedData.model} ${formatTypeHeading(type)}` : `Update ${selectedData.model} Resources`}</h2> 
                    <img className="cross" src={`http://localhost:5000/images/cross.svg`} alt="cross" onClick={closeModal}></img> 
                </div>
                {children}
            </div> 
        )
    }
}