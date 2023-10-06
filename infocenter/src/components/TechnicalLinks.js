import { ServiceIcon, UserManualIcon, ConfigIcon, SoftwareIcon, DocumentsIcon, PasswordsIcon} from "../svg";
import { DeviceUpdateForm } from "./DeviceUpdateForm";
import { serverConfig } from "../server";

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

export function TechnicalLinks({selectedData, page,  updateFormVisible, setUpdateFormVisible, closeUpdate, onLinkClick, queryClient, showMessage, closeDialog}) {

    return (
        <>
            <div className="summary-area">
                <div className="image-container">
                    <img key={selectedData.model} className="equipment-image" src={selectedData.img === false ? generateLinks('question_mark', 'image') : generateLinks(selectedData, 'image')} alt="Medical Equipment"></img>
                </div>
                <div className="equipment-summary">
                    <div id="title-container">
                        <h2>{selectedData.model}</h2>
                    </div>
                    <h4>{`${selectedData.type}, ${selectedData.manufacturer}`}</h4>
                </div>
            </div>
            <div className="technical-area">
                <div className="technical-link-container">
                    <a className="technical-link service" style={selectedData.serviceManual === false ? {opacity: 0.1} : {opacity: 1}} href={selectedData.serviceManual === false ? null : generateLinks(selectedData, 'service')} download={selectedData.serviceManual === false ? null : `${selectedData.model.toLowerCase().replace(/\s/g, "-")}-service-manual.pdf`} >
                        <ServiceIcon color="#98053b" size="5vh"/>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <span>Service</span>
                            <span>Manual</span> 
                        </div>
                    </a>
                </div>
                <div className="technical-link-container">
                    <a className="technical-link user-manual" style={selectedData.userManual === false ? {opacity: 0.1} : {opacity: 1}} href={selectedData.userManual === false ? null : generateLinks(selectedData, 'user')} download={selectedData.userManual === false ? null : `${selectedData.model.toLowerCase().replace(/\s/g, "-")}-user-manual.pdf`} >
                        <UserManualIcon color="#037470" size="5vh"/>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <span>User</span>
                            <span>Manual</span> 
                        </div>                    
                    </a>   
                </div>
                <div className="technical-link-container">
                    <div className="technical-link config" style={selectedData.config === false || selectedData.config === "" ? {opacity: 0.1} : {opacity: 1, cursor: "pointer"}} onClick={onLinkClick} >
                        <ConfigIcon color="#f4af1a" size="5vh"/>
                        Configuration
                    </div>  
                </div>
                <div className="technical-link-container">
                    <div className="technical-link software" style={selectedData.software === "" ? {opacity: 0.1} : {opacity: 1, cursor: "pointer"}} onClick={onLinkClick}>
                        <SoftwareIcon color="#8504a5" size="5vh"/>
                        Software
                    </div> 
                </div>
                <div className="technical-link-container">
                    <div className="technical-link documents" style={selectedData.documents === "" ? {opacity: 0.1} : {opacity: 1, cursor: "pointer"}} onClick={onLinkClick}>
                        <DocumentsIcon color="#bf5a2b" size="5vh"/>
                        <div style={{display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center"}}>
                            <span>Other</span>
                            <span>Documents</span> 
                        </div>
                    </div> 
                </div>
                <div className="technical-link-container">
                    <div className="technical-link passwords" style={selectedData.passwords === "" ? {opacity: 0.1} : {opacity: 1, cursor: "pointer"}} onClick={onLinkClick}>
                        <PasswordsIcon color="#33658A" size="5vh"/>
                        Passwords
                    </div>   
                </div>
            </div>
            {updateFormVisible && <DeviceUpdateForm selectedData={selectedData} page={page} setUpdateFormVisible={setUpdateFormVisible} closeUpdate={closeUpdate} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog}/>}
        </> 
    );
}
    