import { useState } from "react";
import { ServiceIcon, UserManualIcon, ConfigIcon, SoftwareIcon, DocumentsIcon, PasswordsIcon} from "../svg";
import { DeviceUpdateForm } from "./DeviceUpdateForm";
import { useUser } from "./StateStore";
import useMediaQueries from "media-queries-in-react";
import { serverConfig } from "../server";

function generateLinks(deviceData, type) {
    const formattedModel = deviceData.model.toLowerCase().replace(/\s/ig, '_');
    let link;
    if (type === 'service') {
        link = `http://${serverConfig.host}:${serverConfig.port}/manuals/service_manuals/${formattedModel}_service_manual.pdf`
    } 
    else if (type === 'image') {
        const fileExtension = deviceData.img ? deviceData.img : 'jpg';
         link = `http://${serverConfig.host}:${serverConfig.port}/images/equipment/${formattedModel}.${fileExtension}`
    } 
    else if (type === 'user') {
        link = `http://${serverConfig.host}:${serverConfig.port}/manuals/user_manuals/${formattedModel}_user_manual.pdf`
    } 
    
    return link
}

export function TechnicalLinks({selectedData, page, onLinkClick, queryClient, showMessage, closeDialog}) {

    const currentUser = useUser((state) => state.userCredentials);

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });
       
    const [updateFormVisible, setUpdateFormVisible] = useState(false);
    
    function showDeviceUpdate() {
        setUpdateFormVisible(true);
    }

    function closeUpdate() {
        setUpdateFormVisible(false)
    }

    return (
        <>
                <div className={mediaQueries.laptop ? "summary-area-laptop" : "summary-area-desktop"}>
                    <div className={mediaQueries.laptop ? "image-container-laptop" : "image-container-desktop"}>
                        <img key={selectedData.model} className="equipment-image" src={selectedData.img === false ? generateLinks('question_mark', 'image') : generateLinks(selectedData, 'image')} alt="Medical Equipment"></img>
                    </div>
                    <div className={mediaQueries.laptop ? "equipment-summary-laptop" : "equipment-summary-desktop"}>
                        <div id={mediaQueries.laptop ? "title-container-laptop" : "title-container-desktop"}>
                            <h2>{selectedData.model}</h2>
                            {currentUser.permissions === "admin" && <div className="device-edit-button" onClick={showDeviceUpdate}><img id="edit-image" src={`http://${serverConfig.host}:${serverConfig.port}/images/edit.svg`} alt="edit"></img>Update</div>}
                        </div>
                        <h4>{`${selectedData.type}, ${selectedData.manufacturer}`}</h4>
                    </div>
                </div>
                <div className={mediaQueries.laptop ? "technical-area-laptop" : "technical-area-desktop"}>
                    <a className="technical-link service" style={selectedData.serviceManual === false ? {opacity: 0.1} : {opacity: 1}} href={selectedData.serviceManual === false ? null : generateLinks(selectedData, 'service')} target="_blank" rel="noopener noreferrer" >
                        <ServiceIcon color="#98053b" size={mediaQueries.desktop ? "50px" : "30px"}/>
                        Service Manual
                    </a>
                    <a className="technical-link user-manual" style={selectedData.userManual === false ? {opacity: 0.1} : {opacity: 1}} href={selectedData.userManual === false ? null : generateLinks(selectedData, 'user')} target="_blank" rel="noopener noreferrer">
                        <UserManualIcon color="#037470" size={mediaQueries.desktop ? "50px" : "30px"}/>
                        User Manual                    
                    </a>
                    <div className="technical-link config" style={selectedData.config === false || selectedData.config === "" ? {opacity: 0.1} : {opacity: 1, cursor: "pointer"}} onClick={onLinkClick} >
                        <ConfigIcon color="#f4af1a" size={mediaQueries.desktop ? "50px" : "30px"}/>
                        Configuration
                    </div>
                    <div className="technical-link software" style={selectedData.software === "" ? {opacity: 0.1} : {opacity: 1, cursor: "pointer"}} onClick={onLinkClick}>
                        <SoftwareIcon color="#8504a5" size={mediaQueries.desktop ? "50px" : "30px"}/>
                        Software
                    </div>
                    <div className="technical-link documents" style={selectedData.documents === "" ? {opacity: 0.1} : {opacity: 1, cursor: "pointer"}} onClick={onLinkClick}>
                        <DocumentsIcon color="#bf5a2b" size={mediaQueries.desktop ? "50px" : "30px"}/>
                        Other Documents
                    </div>
                    <div className="technical-link passwords" style={selectedData.passwords === "" ? {opacity: 0.1} : {opacity: 1, cursor: "pointer"}} onClick={onLinkClick}>
                        <PasswordsIcon color="#33658A" size={mediaQueries.desktop ? "50px" : "30px"}/>
                        Passwords
                    </div>
                </div>
                {updateFormVisible && <DeviceUpdateForm selectedData={selectedData} page={page} closeUpdate={closeUpdate} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog}/>}
        </> 
    );
}
    