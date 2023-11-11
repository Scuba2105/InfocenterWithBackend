import { useState } from "react";
import { ModalSkeleton } from "../ModalSkeleton"; 
import { serverConfig } from "../../server";
import { EditIcon } from "../../svg";

export function Documents({description, link, extension, showForm, setCurrentDocument, setFormVisible}) {
    
    const iconName = extension === "xls" ? "xlsx" : extension === "doc" ? "docx" : extension === "ppt" ? "pptx" : extension;
    
    return (
        <div className="documents-edit-container flex-c">
            <a className="document-container flex-c" href={`https://${serverConfig.host}:${serverConfig.port}${link}`} target="_blank" rel="noopener noreferrer">
                <img src={`https://${serverConfig.host}:${serverConfig.port}/images/${iconName}.png`} alt="copy" className="document-icon"></img>
                <label className="document-label">{description}</label>
            </a>
            <button className="documents-edit-button flex-c-col" onClick={() => showForm(setFormVisible, setCurrentDocument, link, description, extension)}>
                <EditIcon size="20px" color="#5ef8ed"/>
                <span>Edit Resource</span>
            </button>
        </div>
    )
}