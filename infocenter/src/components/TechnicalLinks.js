import { useState } from "react";
import { ServiceIcon, UserManualIcon, ConfigIcon, SoftwareIcon, PlaceholderIcon} from "../svg";
import { DeviceUpdateForm } from "./DeviceUpdateForm";

function generateLinks(model, type) {
    const formattedModel = model.toLowerCase().replace(/\s/ig, '_');
    let link;
    if (type === 'service') {
        link = `${process.env.PUBLIC_URL}/manuals/service_manuals/${formattedModel}_service_manual.pdf`
    } 
    else if (type === 'image') {
        link = `${process.env.PUBLIC_URL}/images/equipment/${formattedModel}.jpg`
    } 
    else if (type === 'user') {
        link = `${process.env.PUBLIC_URL}/manuals/user_manuals/${formattedModel}_user_manual.pdf`
    } 
    
    return link
}

export function TechnicalLinks({selectedData, onConfigClick}) {
    
    const [updateFormVisible, setUpdateFormVisible] = useState(false);

    function showDeviceUpdate() {
        setUpdateFormVisible(true);
    }

    function closeUpdate() {
        setUpdateFormVisible(false)
    }
    
    return (
        <>
                <div className="summary-area">
                    <div className="image-container">
                    <img key={selectedData.model} className="equipment-image" src={selectedData.img === false ? generateLinks('question_mark', 'image') : generateLinks(selectedData.model, 'image')} alt="Medical Equipment"></img>
                    </div>
                    <div className="equipment-summary">
                        <h2>{selectedData.model}</h2>
                        <h4>{`${selectedData.type}, ${selectedData.manufacturer}`}</h4>
                        <div className="device-edit-button" onClick={showDeviceUpdate}><img id="device-edit-image" src={`${process.env.PUBLIC_URL}/images/edit.svg`} alt="edit"></img>Update</div>
                    </div>
                </div>
                <div className="technical-area">
                    <a className="technical-link service" style={selectedData.serviceManual === false ? {opacity: 0.2} : {opacity: 1}} href={selectedData.serviceManual === false ? null : generateLinks(selectedData.model, 'service')} target="_blank" rel="noopener noreferrer" >
                        <ServiceIcon color="#EA3E7A" />
                        Service Manual
                    </a>
                    <a className="technical-link user-manual" style={selectedData.userManual === false ? {opacity: 0.2} : {opacity: 1}} href={selectedData.userManual === false ? null : generateLinks(selectedData.model, 'user')} target="_blank" rel="noopener noreferrer">
                        <UserManualIcon color="#04b3ad" />
                        User Manual                    
                    </a>
                    <div className="technical-link config" style={selectedData.config === false || selectedData.config === "" ? {opacity: 0.2} : {opacity: 1}} onClick={onConfigClick} >
                        <ConfigIcon color="#f4af1a"/>
                        Configuration
                    </div>
                    <div className="technical-link software" style={selectedData.software === "" ? {opacity: 0.2} : {opacity: 1}} href={selectedData.software === "" ? null : `${process.env.PUBLIC_URL}/${selectedData.software}`} target="_blank" rel="noopener noreferrer">
                        <SoftwareIcon color="#8504a5" />
                        Software
                    </div>
                    <div className="technical-link placeholder1" style={selectedData.placeholder1 === "" ? {opacity: 0.2} : {opacity: 1}} href={selectedData.placeholder1 === "" ? null : `${process.env.PUBLIC_URL}/${selectedData.placeholder1}`} target="_blank" rel="noopener noreferrer">
                        <PlaceholderIcon color="#dc652f" />
                        Placeholder 1
                    </div>
                    <div className="technical-link placeholder2" style={selectedData.placeholder2 === "" ? {opacity: 0.2} : {opacity: 1}} href={selectedData.placeholder2 === "" ? null : `${process.env.PUBLIC_URL}/${selectedData.placeholder2}`} target="_blank" rel="noopener noreferrer">
                        <PlaceholderIcon color="#33658A" />
                        Placeholder 2
                    </div>
                </div>
                {updateFormVisible && <DeviceUpdateForm selectedData={selectedData} closeUpdate={closeUpdate} />}
        </> 
    );
}
    