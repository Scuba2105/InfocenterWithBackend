import { useState } from "react";
import { BedStatusTable } from "./BedStatusTable";

// Function which is called to update bedside testing progress.
function updateTestingProgress(testingProgress, setTestingProgress, testingTemplatesData, selectedBedData, device) {
    // Get the selected device status 
    const affectedDeviceStatus = selectedBedData[device];
    
    // Copy the selected bed data and invert the selected device status.
    const updatedSelectedBedData = {...selectedBedData};
    updatedSelectedBedData[device] = !affectedDeviceStatus;

    // Check if the original data for the device is permanent or can be changed.
    const originalEntry = testingTemplatesData.find((entry) => {
        return entry.bed === selectedBedData.bed 
    });
    
    // If original device status was false then it can be freely changed until uploaded.
    if (originalEntry[device] === false) {
        // Map the testing progress to include the updated bed data.
        const newTestingProgress = testingProgress.map((entry) => {
            if (entry.bed === updatedSelectedBedData.bed) {
                return updatedSelectedBedData
            }
            return entry
        })
        setTestingProgress(newTestingProgress)
    }    
}

// Update the sublocation when arrow pushed
function updateSubLocation(index, setIndex, setTestingProgress, testingTemplatesData, availableSubLocations, e) {
    const rightArrowPressed = e.currentTarget.classList[1] === "config-right-arrow";
    
    if (rightArrowPressed && index < (availableSubLocations.length - 1)) {
        setIndex(i => i + 1);
        setTestingProgress(testingTemplatesData[availableSubLocations[index + 1]]);
    }
    else if (!rightArrowPressed && index > 0) {
        setIndex(i => i - 1);
        setTestingProgress(testingTemplatesData[availableSubLocations[index -1]]);
    }
}

// Set the accessible room/bedside devices the current sublocation.
function getAvailableBedSideDevices(subLocation, entry) {
    if (subLocation === "Birth Suite" && [3, 4].includes(entry)) {
        return  ["MX450", "Rack", "X2", "CO2"];
    } 
    else if (subLocation === "MADU") {
        return ["CTG"];
    }
    else {
        return ["CTG", "Warmer", "Humidifier", "Rad 8"];
    }
}

export function DeliverySuiteProgress({testingTemplatesData}) {
    
    const availableSubLocations = Object.keys(testingTemplatesData);

    // Store the index of the selected sub location
    const [index, setIndex] = useState(0)

    // Store the currently selected sub-location in state.
    const subLocation = availableSubLocations[index];

    // Store the current testing progress array.
    const [testingProgress, setTestingProgress] = useState(testingTemplatesData[subLocation]);

    // Get the bed numberes from the testing template data
    const bedNumbers = testingTemplatesData[subLocation].map((entry) => {
        return entry.bed
    }) 
    
    // Get the data for the current selected section of ED.
    const currentTemplateData = testingTemplatesData[subLocation];

    return (
        <div className="testing-template-form flex-c-col">
            <div className="testing-template-display">
                {bedNumbers.map((entry, index) => {
                    const currentBedData = testingProgress.find((bedData) => {
                        return bedData.bed === entry;
                    })
                    return (
                        <BedStatusTable key={`BedStatusTable-${entry}`} bedNumber={entry} bedIndex={index} testingTemplatesData={currentTemplateData} currentBedData={currentBedData} updateTestingProgress={updateTestingProgress} testingProgress={testingProgress} setTestingProgress={setTestingProgress} bedDevices={getAvailableBedSideDevices(subLocation, entry)} />
                    )
                })}
            </div>
            <div className="testing-template-upload-btn-container size-100 flex-c">
                <div className="update-button reset-button testing-template-upload-btn">Reset Form</div>
                <div className="update-button testing-template-upload-btn">Upload Progress</div>
            </div> 
        </div>
        
    )
}