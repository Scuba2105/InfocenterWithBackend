export function Documents({description, link, extension}) {

    const iconName = extension === "xls" ? "xlsx" : extension === "doc" ? "docx" : extension;
    
    return (
        <a className="document-container" href={`http://localhost:5000${link}`} target="_blank" rel="noopener noreferrer">
            <img src={`http://localhost:5000/images/${iconName}.jpg`} alt="copy" className="document-icon"></img>
            <label className="document-label">{description}</label>
        </a>
    )
}