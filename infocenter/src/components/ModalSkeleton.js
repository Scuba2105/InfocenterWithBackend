import { capitaliseFirstLetters } from "../utils/utils"; 
import useMediaQueries from "media-queries-in-react" 

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

export function ModalSkeleton({children, selectedData, closeModal, type}) {

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });

    return (
        <div className={mediaQueries.laptop ? "modal-container-laptop" : "modal-container-desktop"} style={type === "software" ? { minHeight: 300 + 'px'} : { minHeight: 500 + 'px'}}>
            <div className="modal-title-bar">
                <div id="title-aligner"></div>     
                <h2 className="model-title">{type !== "update" ? `${selectedData.model} ${formatTypeHeading(type)}` : `Update ${selectedData.model} Resources`}</h2> 
                <img className="cross" src={`http://localhost:5000/images/cross.svg`} alt="cross" onClick={closeModal}></img> 
            </div>
            {children}
        </div> 
    )
}