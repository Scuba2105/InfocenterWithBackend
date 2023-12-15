import { useState } from "react";
import { ServiceIcon, UserManualIcon, ConfigIcon, SoftwareIcon, DocumentsIcon, PasswordsIcon} from "../../svg";
import { DeviceUpdateForm } from "./DeviceUpdateForm";
import { serverConfig } from "../../server";

function generateLinks(deviceData, type) {
    const formattedModel = deviceData.model.toLowerCase().replace(/\s/ig, '_');
    let link;
    if (type === 'service') {
        link = `https://${serverConfig.host}:${serverConfig.port}/manuals/service_manuals/${formattedModel}_service_manual.pdf`
    } 
    else if (type === 'image') {
        const fileExtension = deviceData.img ? deviceData.img : 'jpg';
         link = `https://${serverConfig.host}:${serverConfig.port}/images/equipment/${formattedModel}.${fileExtension}`
    } 
    else if (type === 'user') {
        link = `https://${serverConfig.host}:${serverConfig.port}/manuals/user_manuals/${formattedModel}_user_manual.pdf`
    } 
    
    return link
}

function getClassList(link, selectedData) {
    const btnType = ["userManual", "software", "passwords"].includes(link) ? "alternate-link-button" : "main-link-button";
    if (selectedData[link] === false || selectedData[link] === "") {
        return `technical-link ${link} ${btnType} flex-c-col main-btn-transition inactive `
    }
    else {
        return `technical-link ${link} ${btnType} flex-c-col main-btn-transition `
    } 

}

function handleLinkHover(setHovered, link) {
    setHovered(link);
}

function handleLinkMouseOut(setHovered) {
    setHovered(null);
}

export function TechnicalLinks({selectedData, page, equipmentEditPermissions, updateFormVisible, setUpdateFormVisible, closeUpdate, onLinkClick, queryClient, showMessage, closeDialog}) {

    const [hovered, setHovered] = useState(false);

    return (
        <>
            <div className="summary-area flex-c">
                <div className="image-container flex-c">
                    <img key={selectedData.model} className="equipment-image" src={selectedData.img === false ? generateLinks('question_mark', 'image') : generateLinks(selectedData, 'image')} alt="Medical Equipment"></img>
                </div>
                <div className="equipment-summary">
                    <div id="title-container" className="flex-c">
                        <label>{selectedData.model}</label>
                    </div>
                    <h4>{`${selectedData.type}, ${selectedData.manufacturer}`}</h4>
                </div>
            </div>
            <div className="technical-area">
                <div className="technical-link-container flex-c">
                    <a className={getClassList("serviceManual", selectedData)} 
                       style={selectedData.serviceManual === false ? {opacity: 0.1} : {opacity: 1}} 
                       href={selectedData.serviceManual === false ? null : generateLinks(selectedData, 'service')} 
                       download={selectedData.serviceManual === false ? null : `${selectedData.model.toLowerCase().replace(/\s/g, "-")}-service-manual.pdf`} 
                       onMouseOver={() => handleLinkHover(setHovered, "service")}
                       onMouseOut={() => handleLinkMouseOut(setHovered)}>
                            <ServiceIcon color="#5ef8ed" size="5vh"/>
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                <span>Service</span>
                                <span>Manual</span> 
                            </div>
                    </a>
                </div>
                <div className="technical-link-container flex-c">
                    <a className={getClassList("userManual", selectedData)} 
                       style={selectedData.userManual === false ? {opacity: 0.1} : {opacity: 1}} 
                       href={selectedData.userManual === false ? null : generateLinks(selectedData, 'user')} 
                       download={selectedData.userManual === false ? null : `${selectedData.model.toLowerCase().replace(/\s/g, "-")}-user-manual.pdf`} 
                       onMouseOver={() => handleLinkHover(setHovered, "user")}
                       onMouseOut={() => handleLinkMouseOut(setHovered)}>
                            <UserManualIcon color="#BCE7FD" size="5vh"/>
                            <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                                <span>User</span>
                                <span>Manual</span> 
                            </div>                    
                    </a>   
                </div>
                <div className="technical-link-container flex-c" onMouseOver={() => handleLinkHover(setHovered, "config")} onMouseOut={() => handleLinkMouseOut(setHovered)}>
                    <div className={getClassList("config", selectedData)} style={selectedData.config === false || selectedData.config === "" ? {opacity: 0.1} : {opacity: 1, cursor: "pointer"}} onClick={onLinkClick} >
                        <ConfigIcon color="#5ef8ed" size="5vh"/>
                        Configuration
                    </div>  
                </div>
                <div className="technical-link-container flex-c" onMouseOver={() => handleLinkHover(setHovered, "software")} onMouseOut={() => handleLinkMouseOut(setHovered)}>
                    <div className={getClassList("software", selectedData)} style={selectedData.software === "" ? {opacity: 0.1} : {opacity: 1, cursor: "pointer"}} onClick={onLinkClick}>
                        <SoftwareIcon color="#BCE7FD" size="5vh"/>
                        Software
                    </div> 
                </div>
                <div className="technical-link-container flex-c" onMouseOver={() => handleLinkHover(setHovered, "documents")} onMouseOut={() => handleLinkMouseOut(setHovered)}>
                    <div className={getClassList("documents", selectedData)} style={selectedData.documents === "" ? {opacity: 0.1} : {opacity: 1, cursor: "pointer"}} onClick={onLinkClick}>
                        <DocumentsIcon color="#5ef8ed" size="5vh"/>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <span>Other</span>
                            <span>Documents</span> 
                        </div>
                    </div> 
                </div>
                <div className="technical-link-container flex-c" onMouseOver={() => handleLinkHover(setHovered, "passwords")} onMouseOut={() => handleLinkMouseOut(setHovered)}>
                    <div className={getClassList("passwords", selectedData)} style={selectedData.passwords === "" ? {opacity: 0.1} : {opacity: 1, cursor: "pointer"}} onClick={onLinkClick}>
                        <PasswordsIcon color="#BCE7FD" size="5vh"/>
                        Passwords
                    </div>   
                </div>
            </div>
            {updateFormVisible && <DeviceUpdateForm equipmentEditPermissions={equipmentEditPermissions} selectedData={selectedData} page={page} setUpdateFormVisible={setUpdateFormVisible} closeUpdate={closeUpdate} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog}/>}
        </> 
    );
}
    