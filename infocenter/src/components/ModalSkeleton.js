import { capitaliseFirstLetters } from "../utils/utils"; 

function formatTypeHeading(type) {
    let name;
    if (type === "config") {
        name = "configurations" 
    }
    else {
        name = type;
    }

    return capitaliseFirstLetters(name);
}

export function ModalSkeleton({children, selectedData, closeModal, type}) {

    return (
        <div className="modal-container">
            <div className="modal-title-bar">
                <div id="title-aligner"></div>     
                <h2 className="model-title">{type !== "update" ? `${selectedData.model} ${formatTypeHeading(type)}` : `Update ${selectedData.model} Resources`}</h2> 
                <img className="cross" src={`http://localhost:5000/images/cross.svg`} alt="cross" onClick={closeModal}></img> 
            </div>
            {children}
        </div> 
    )
}