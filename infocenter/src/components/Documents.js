export function Documents({description, link, extension}) {

    const iconName = extension === "xls" ? "xlsx" : extension === "doc" ? "docx" : extension;
    
    return (
        <div className="document-container">
            <img src={`http://localhost:5000/images/${iconName}.jpg`} alt="copy" className="document-icon"></img>
            <a className="document-link" href={`http://localhost:5000${link}`} target="_blank" rel="noopener noreferrer">{description}</a>
        </div>
    )
}