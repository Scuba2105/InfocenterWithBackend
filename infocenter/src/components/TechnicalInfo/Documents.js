import { useState } from "react";
import { ModalSkeleton } from "../ModalSkeleton"; 
import { serverConfig } from "../../server";
import { EditIcon } from "../../svg";
import { delayFunctionInitiation } from "../../utils/utils";

function setButtonHovered(setButtonIsHovered) {
    setButtonIsHovered(true);
}

function removeButtonHovered(setButtonIsHovered) {
    setButtonIsHovered(false);
}

export function Documents({description, link, extension, showForm, setCurrentDocument, setFormVisible}) {
    
    const [buttonIsHovered, setButtonIsHovered] = useState(false);
    const iconName = ["xls", "xlsx", "csv"].includes(extension) ? "xlsx" : ["docx", "doc"].includes(extension) ? "docx" : ["ppt", "pptx"].includes(extension) ? "pptx" : ["txt", "jpg", "png", "pdf"].includes(extension) ? extension : "document";
       
    return (
        <div className="documents-edit-container flex-c">
            <a className="document-container form-btn-transition flex-c" href={`https://${serverConfig.host}:${serverConfig.port}${link}`} target="_blank" rel="noopener noreferrer">
                <img src={`https://${serverConfig.host}:${serverConfig.port}/images/${iconName}.png`} alt="copy" className="document-icon"></img>
                <label className="document-label">{description}</label>
            </a>
            <button className="documents-edit-button form-btn-transition flex-c-col" onClick={() => delayFunctionInitiation(() => showForm(setFormVisible, setCurrentDocument, link, description, extension))} onMouseOver={() => setButtonHovered(setButtonIsHovered)} onMouseOut={() => removeButtonHovered(setButtonIsHovered)}>
                <EditIcon size="20px" color={buttonIsHovered ? "#D4FB7C" : "#BCE7FD"}/>
                <span>Edit Resource</span>
            </button>
        </div>
    )
}