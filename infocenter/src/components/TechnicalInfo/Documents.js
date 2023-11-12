import { useState } from "react";
import { ModalSkeleton } from "../ModalSkeleton"; 
import { serverConfig } from "../../server";
import { EditIcon } from "../../svg";

function setButtonHovered(setButtonIsHovered) {
    setButtonIsHovered(true);
}

function removeButtonHovered(setButtonIsHovered) {
    setButtonIsHovered(false);
}

export function Documents({description, link, extension, showForm, setCurrentDocument, setFormVisible}) {
    
    const [buttonIsHovered, setButtonIsHovered] = useState(false);
    const iconName = extension === "xls" ? "xlsx" : extension === "doc" ? "docx" : extension === "ppt" ? "pptx" : extension;
    
    return (
        <div className="documents-edit-container flex-c">
            <a className="document-container flex-c" href={`https://${serverConfig.host}:${serverConfig.port}${link}`} target="_blank" rel="noopener noreferrer">
                <img src={`https://${serverConfig.host}:${serverConfig.port}/images/${iconName}.png`} alt="copy" className="document-icon"></img>
                <label className="document-label">{description}</label>
            </a>
            <button className="documents-edit-button flex-c-col" onClick={() => showForm(setFormVisible, setCurrentDocument, link, description, extension)} onMouseOver={() => setButtonHovered(setButtonIsHovered)} onMouseOut={() => removeButtonHovered(setButtonIsHovered)}>
                <EditIcon size="20px" color={buttonIsHovered ? "#FBB934" : "#69737a"}/>
                <span>Edit Resource</span>
            </button>
        </div>
    )
}