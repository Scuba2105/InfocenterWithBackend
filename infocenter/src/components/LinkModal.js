import { useState } from "react";
import { SelectInput } from "./SelectInput";
import { IntellivueConfigDisplay } from "./IntellivueConfigDisplay";
import { ClipboardCopy } from "./CopyToClipboard";
import useMediaQueries from "media-queries-in-react"

function generateConfigData(hospitals, selectedData) {
    let dataArray = [];
    hospitals.forEach((hospital) => {
        const hospitalConfigString = selectedData.config[hospital].map((config) => {
            const linkArray = (config.split('/'));
            const configDataArray = linkArray[linkArray.length - 1].split('_');
            return configDataArray;
        })
        dataArray.push(hospitalConfigString);
    });

    return dataArray;
}

function parseConfigData(configData) {
    const department = capitaliseFirstLetter(configData[2]);
    const options = configData[3] === 'none' ? '-' : configData[3].replace(/-/g, ', ');
    const software = configData[4] === 'none' ? '-' : configData[4];
    const dateCreated = configData[configData.length -1].split('.').slice(0, -1).join('/');

    return [department, options, software, dateCreated];
}

function capitaliseFirstLetter(word) {
    const wordArray = word.split('--');
    const formattedDepartment = wordArray.map((word) => {
        const array = word.split('-');
        const capitalisedWords = array.map((item) => {
            if (item === 'ct' || item === 'agsu') {
                return item.toUpperCase();
            }
            return item[0].toUpperCase() + item.slice(1);
        }).join(' ');
        return capitalisedWords;
    }).join(' - ');
    
    return formattedDepartment;
}

export function LinkModal({selectedData, modalType}) {

    const mediaQueries = useMediaQueries({
        laptop: "(max-width: 1250px)",
        desktop: "(min-width: 1800px)"
    });
    
    const [hospitalsIndex, setHospitalsIndex] = useState(0);
    const [departmentsIndex, setDepartmentsIndex] = useState(0);
    
    if (modalType === "documents") {
        <div className="modal-display">
            
        </div>
    }

    if (modalType === "software") {
        
        const softwareData = selectedData.software;
        
        return (
            <div className="modal-display">
                <div className="software-summary">
                    <label className="software-device-label">Device Software Location:</label>
                    <label className="software-device-location">{softwareData["device-software"] || "N/A"}</label>
                    <ClipboardCopy copyText={softwareData["device-software"] || "N/A"} identifier={mediaQueries.laptop ? "1-laptop" : "1-desktop"} />
                </div>
                <div className="software-summary">
                    <label className="software-device-label">Service Software Location:</label>
                    <label className="software-device-location">{softwareData["service-software"] || "N/A"}</label>
                    <ClipboardCopy copyText={softwareData["service-software"] || "N/A"} identifier={mediaQueries.laptop ? "2-laptop" : "2-desktop"} />
                </div>               
            </div>
        );
    }

    if (modalType === "config") {
            
        const hospitals = Object.keys(selectedData.config) 
        const configData = generateConfigData(hospitals, selectedData);
        
        // Generate the config information from the json link
        const selectedHospitalConfigs = configData[hospitalsIndex];
        
        const parsedConfigData = selectedHospitalConfigs.map((configString) => {
            return parseConfigData(configString);
        });

        function getDepartments() {
            const newDepartmentIndex = parsedConfigData.map((entry) => {
                return entry[0];
            });
            
            return newDepartmentIndex;
        }
        
        function onHospitalChange(e) {
            const newHospitalIndex = hospitals.indexOf(e.target.value);
            setHospitalsIndex(newHospitalIndex);
            setDepartmentsIndex(0);
        }

        function onDepartmentChange(e) {
            const newDepartmentIndex = getDepartments().indexOf(e.target.value);        
            setDepartmentsIndex(newDepartmentIndex);
        }
                
        return (
            <div className="modal-display">
                <SelectInput label="Hospitals" optionData={hospitals} onChange={onHospitalChange} />
                <SelectInput label="Department" optionData={getDepartments()} onChange={onDepartmentChange} />
                <IntellivueConfigDisplay selectedData={selectedData} parsedConfigData={parsedConfigData} hospitals={hospitals} departmentsIndex={departmentsIndex} hospitalsIndex={hospitalsIndex} />    
            </div>
        );
    }
}