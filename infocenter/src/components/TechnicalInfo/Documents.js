import { serverConfig } from "../../server";

export function Documents({description, link, extension}) {
    console.log(description)
    const iconName = extension === "xls" ? "xlsx" : extension === "doc" ? "docx" : extension === "ppt" ? "pptx" : extension;
    
    return (
        <div className="documents-edit-container flex-c">
            <a className="document-container flex-c" href={`https://${serverConfig.host}:${serverConfig.port}${link}`} target="_blank" rel="noopener noreferrer">
                <img src={`https://${serverConfig.host}:${serverConfig.port}/images/${iconName}.png`} alt="copy" className="document-icon"></img>
                <label className="document-label">{description}</label>
            </a>
            <button className="documents-edit-button main-">Update</button>
        </div>
        
    )
}