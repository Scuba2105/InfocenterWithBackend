import { serverConfig } from "../server";

export function Documents({description, link, extension}) {

    const iconName = extension === "xls" ? "xlsx" : extension === "doc" ? "docx" : extension === "ppt" ? "pptx" : extension;
    
    return (
        <a className="document-container" href={`https://${serverConfig.host}:${serverConfig.port}${link}`} target="_blank" rel="noopener noreferrer">
            <img src={`https://${serverConfig.host}:${serverConfig.port}/images/${iconName}.jpg`} alt="copy" className="document-icon"></img>
            <label className="document-label">{description}</label>
        </a>
    )
}