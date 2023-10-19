function getStyles(type, data, generateLinks, hrefLink, downloadLink) {
    if (type === "Service Manual" || type === "User Manual") {
        return data === false ? {opacity: 0.1} : {opacity: 1};
    }
    else if (type === "Configuration") {
        return data === false || data === "" ? {opacity: 0.1} : {opacity: 1, cursor: "pointer"};
    }
    else {
        return data === "" ? {opacity: 0.1} : {opacity: 1, cursor: "pointer"};
    }
}

export function TechnicalLink({type, data, Icon, color, onLinkClick}) {
    return (
        <div className="technical-link-container">
            <div className={`technical-link ${color}-link-button`} style={getStyles(type, data)} onClick={onLinkClick}>
                <Icon color="#212936" size="5vh"/>
                {type.split(" ").length === 1 ? 
                <label>{type}</label> :
                <div className="flex-c" style={{flexDirection: "column"}}>
                    <label>{type.split(" ")[0]}</label>
                    <label>{type.split(" ")[1]}</label>
                </div>}        
            </div> 
        </div>
    )
}