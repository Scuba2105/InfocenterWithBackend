import { capitaliseFirstLetters } from "../utils/utils"; 
import useMediaQueries from "media-queries-in-react"; 
import { serverConfig } from "../server";

const formTypes = ['add-new', 'update', 'check', 'new-department-contact', 'new-vendor', 
'disposal', 'change-password', "update-staff-contact", "update-vendor-contact"];

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
        return "Change Password";
    }
    else if (type === "new-department-contact") {
        return "Add New Department Contact";
    }
    else if (type === "new-vendor") {
        return "Add New Vendor Contact";
    }
    else if (type === "update-staff-contact" || type === "update-vendor-contact") {
        return type === "update-staff-contact" ? "Update Staff Contact" : "Update Vendor Contact";
    }
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

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1750px)",
        desktop: "(min-width: 1800px)"
    });

    if (formTypes.includes(type)) {
        return (
            <div className={mediaQueries.laptop ? `modal-container-laptop` : `modal-container-desktop`}>
                <div className="modal-title-bar">
                    <div id="title-aligner"></div>     
                    <h2 className="model-title">{getFormHeading(page, type, selectedData)}</h2> 
                    <img className="cross" src={`https://${serverConfig.host}:${serverConfig.port}/images/cross.svg`} alt="cross" onClick={closeModal}></img> 
                </div>
                {children}
            </div> 
        )
    }
    else {
        return (
            <div className={mediaQueries.laptop ? `modal-container-laptop` : `modal-container-desktop`}>
                <div className="modal-title-bar">
                    <div id="title-aligner"></div>     
                    <h2 className="model-title">{type !== "update" ? `${selectedData.model} ${formatTypeHeading(type)}` : `Update ${selectedData.model} Resources`}</h2> 
                    <img className="cross" src={`https://${serverConfig.host}:${serverConfig.port}/images/cross.svg`} alt="cross" onClick={closeModal}></img> 
                </div>
                {children}
            </div> 
        )
    }
}