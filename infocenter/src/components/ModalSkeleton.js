import { capitaliseFirstLetters, delayFunctionInitiation } from "../utils/utils"; 
import { serverConfig } from "../server";

const formTypes = ['add-new', 'update', 'check', 'new-department-contact', 'new-vendor', 
'disposal', 'change-password', "view-requests", "update-staff-contact", "update-vendor-contact", "edit-existing-documents", "service-request-forms",
"Resource Update Request"];

const onCallPageHeadings = {"my-roster": "Upcoming On-Call Duties", "staff-roster": "On-Call Roster", "edit-roster": "Edit On-Call Roster", "confirm-roster": "Confirm On-Call Roster",
"key-contacts": "Key On-Call Contacts", "on-call-cheatsheet": "On-Call Cheatsheet"} 

function getFormHeading(page, type, selectedData, name) {
    
    if (page === "staff") {
        const heading = type === "add-new" ? "Add New Employee" : `Update Employee Details`;
        return heading;
    }
    else if (page === "technical-info") {
        const heading = type === "add-new" ? "Add New Equipment" : type === "Resource Update Request" ? `${selectedData.model} Update Request` : `Update ${selectedData.model} Details`
        return heading;
    }
    else if (page === "utilities") {
        const heading = type === "check" ? "Check Genius 3 Returns" : `Manage Genius 3 Disposals`
        return heading;
    }
    else if (type === "change-password" || type === "view-requests") {
        return type === "change-password" ? "Change Password" : "View Requests";
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
    else if (page === "on-call") {
        return onCallPageHeadings[type];
    }
    else if (type === "service-request-forms") {
        return "Update Available Service Forms"
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

export function ModalSkeleton({children, selectedData, closeModal, type, page, name}) {
    if (formTypes.includes(type) || page === "on-call") {
        return (
            <div className="modal-container">
                <div className="modal-title-bar">
                    <div id="title-aligner"></div>     
                    <h2 className="model-title">{getFormHeading(page, type, selectedData, name)}</h2> 
                    <img className="cross" src={`https://${serverConfig.host}:${serverConfig.port}/images/cross.svg`} alt="cross" onClick={closeModal}></img> 
                </div>
                {children}
            </div> 
        )
    }
    else {
        return (
            <div className="modal-container">
                <div className="modal-title-bar flex-c">
                    <div id="title-aligner"></div>     
                    <h2 className="model-title">{type !== "update" ? `${selectedData.model} ${formatTypeHeading(type)}` : `Update ${selectedData.model} Resources`}</h2> 
                    <img className="cross" src={`https://${serverConfig.host}:${serverConfig.port}/images/cross.svg`} alt="cross" onClick={() => delayFunctionInitiation(closeModal)}></img> 
                </div>
                {children}
            </div> 
        )
    }
}