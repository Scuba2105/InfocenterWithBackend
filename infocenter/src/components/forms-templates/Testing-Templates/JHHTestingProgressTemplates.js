import { useState } from "react";
import { BedStatusTable } from "./BedStatusTable";
import { NavigationArrow } from "../../../svg";

// Departments with no sub-locations
const noSubLocationDepts = ["Coronary Care Unit"]

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
function updateSubLocation(index, setLocationIndex, setTestingProgress, testingTemplatesData, availableSubLocations, e) {
    const rightArrowPressed = e.currentTarget.classList[1] === "config-right-arrow";
    
    if (rightArrowPressed && index < (availableSubLocations.length - 1)) {
        setLocationIndex(i => i + 1);
        setTestingProgress(testingTemplatesData[availableSubLocations[index + 1]]);
    }
    else if (!rightArrowPressed && index > 0) {
        setLocationIndex(i => i - 1);
        setTestingProgress(testingTemplatesData[availableSubLocations[index -1]]);
    }
}

// Set the accessible room/bedside devices the current sublocation.
function getAvailableBedSideDevices(currentDept, subLocation, entry) {
    if (currentDept === "Coronary Care Unit") {
        return ["MX700", "Rack", "X2"];
    }
    else if (currentDept === "Delivery Suite") {
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
}

export function JHHTestingProgressTemplates({testingTemplatesData, currentDept}) {
    
    const currentDeptTestData = testingTemplatesData["John Hunter Hospital"][currentDept];

    const availableSubLocations = Object.keys(currentDeptTestData);
    
    // Store the index of the selected sub location
    const [locationIndex, setLocationIndex] = useState(0)

    let subLocation = null;
    if (!noSubLocationDepts.includes(currentDept)) {
        // Store the currently selected sub-location in state.
        subLocation = availableSubLocations[locationIndex];
    }
    
    // Store the current testing progress array.
    const [testingProgress, setTestingProgress] = useState(noSubLocationDepts.includes(currentDept) ? currentDeptTestData : currentDeptTestData[subLocation]);
    
    // Get the bed numbers from the testing template data.
    const bedNumbers = testingProgress.map((entry) => {
        return entry.bed;
    }) 
    
    // Get the data for the current selected sub department.
    const currentTemplateData = testingProgress;

    if (["Coronary Care Unit", "Delivery Suite"].includes(currentDept)) {
        return (
            <div className="testing-template-form flex-c-col">
                {subLocation && <div className="testing-template-navigation-container flex-c">
                    <NavigationArrow size="25px" color="white" identifier="config-left-arrow" onClick={(e) => updateSubLocation(locationIndex, setLocationIndex, setTestingProgress, currentDeptTestData, availableSubLocations, e)} />
                    <label>{subLocation}</label>
                    <NavigationArrow size="25px" color="white" identifier="config-right-arrow" onClick={(e) => updateSubLocation(locationIndex, setLocationIndex, setTestingProgress, currentDeptTestData, availableSubLocations, e)} />
                </div>}
                <div className="testing-template-display">
                    {bedNumbers.map((entry, index) => {
                        const currentBedData = testingProgress.find((bedData) => {
                            return bedData.bed === entry;
                        })
                        return (
                            <BedStatusTable key={`BedStatusTable-${entry}`} bedNumber={entry} bedIndex={index} testingTemplatesData={currentTemplateData} currentBedData={currentBedData} updateTestingProgress={updateTestingProgress} testingProgress={testingProgress} setTestingProgress={setTestingProgress} bedDevices={getAvailableBedSideDevices(currentDept, subLocation, entry)} />
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
    else {
        return (
            <div className="flex-c" style={{height: 300 + 'px'}}>
                <h4 style={{color: "white", gridRow: 1 / -1, gridColumn: 1 / -1}}>{`The template is not yet available for ${currentDept}`}</h4>
            </div>
        )
    }
}