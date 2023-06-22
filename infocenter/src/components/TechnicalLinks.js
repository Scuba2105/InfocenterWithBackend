import { useState } from "react";
import { ServiceIcon, UserManualIcon, ConfigIcon, SoftwareIcon, DocumentsIcon, PlaceholderIcon} from "../svg";
import { DeviceUpdateForm } from "./DeviceUpdateForm";
import useMediaQueries from "media-queries-in-react" 

function generateLinks(model, type) {
    const formattedModel = model.toLowerCase().replace(/\s/ig, '_');
    let link;
    if (type === 'service') {
        link = `http://localhost:5000/manuals/service_manuals/${formattedModel}_service_manual.pdf`
    } 
    else if (type === 'image') {
        link = `http://localhost:5000/images/equipment/${formattedModel}.jpg`
    } 
    else if (type === 'user') {
        link = `http://localhost:5000/manuals/user_manuals/${formattedModel}_user_manual.pdf`
    } 
    
    return link
}

export function TechnicalLinks({selectedData, onConfigClick}) {

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
                        <img key={selectedData.model} className="equipment-image" src={selectedData.img === false ? generateLinks('question_mark', 'image') : generateLinks(selectedData.model, 'image')} alt="Medical Equipment"></img>
                    </div>
                    <div className={mediaQueries.laptop ? "equipment-summary-laptop" : "equipment-summary-desktop"}>
                        <div id={mediaQueries.laptop ? "title-container-laptop" : "title-container-desktop"}>
                            <h2>{selectedData.model}</h2>
                            <div className="device-edit-button" onClick={showDeviceUpdate}><img id="device-edit-image" src={`http://localhost:5000/images/edit.svg`} alt="edit"></img>Update</div>
                        </div>
                        <h4>{`${selectedData.type}, ${selectedData.manufacturer}`}</h4>
                    </div>
                </div>
                <div className={mediaQueries.laptop ? "technical-area-laptop" : "technical-area-desktop"}>
                    <a className="technical-link service" style={selectedData.serviceManual === false ? {opacity: 0.2} : {opacity: 1}} href={selectedData.serviceManual === false ? null : generateLinks(selectedData.model, 'service')} target="_blank" rel="noopener noreferrer" >
                        <ServiceIcon color="#EA3E7A" size={mediaQueries.desktop ? "75px" : "30px"}/>
                        Service Manual
                    </a>
                    <a className="technical-link user-manual" style={selectedData.userManual === false ? {opacity: 0.2} : {opacity: 1}} href={selectedData.userManual === false ? null : generateLinks(selectedData.model, 'user')} target="_blank" rel="noopener noreferrer">
                        <UserManualIcon color="#04b3ad" size={mediaQueries.desktop ? "75px" : "30px"}/>
                        User Manual                    
                    </a>
                    <div className="technical-link config" style={selectedData.config === false || selectedData.config === "" ? {opacity: 0.2} : {opacity: 1}} onClick={onConfigClick} >
                        <ConfigIcon color="#f4af1a" size={mediaQueries.desktop ? "75px" : "30px"}/>
                        Configuration
                    </div>
                    <div className="technical-link software" style={selectedData.software === "" ? {opacity: 0.2} : {opacity: 1}}>
                        <SoftwareIcon color="#8504a5" size={mediaQueries.desktop ? "75px" : "30px"}/>
                        Software
                    </div>
                    <div className="technical-link documents" style={selectedData.documents === "" ? {opacity: 0.2} : {opacity: 1}}>
                        <DocumentsIcon color="#dc652f" size={mediaQueries.desktop ? "75px" : "30px"}/>
                        Other Documents
                    </div>
                    <div className="technical-link placeholder2" style={selectedData.placeholder2 === "" ? {opacity: 0.2} : {opacity: 1}} href={selectedData.placeholder2 === "" ? null : `http://localhost:5000/${selectedData.placeholder2}`} target="_blank" rel="noopener noreferrer">
                        <PlaceholderIcon color="#33658A" size={mediaQueries.desktop ? "75px" : "30px"}/>
                        Placeholder 2
                    </div>
                </div>
                {updateFormVisible && <DeviceUpdateForm selectedData={selectedData} closeUpdate={closeUpdate} />}
        </> 
    );
}
    