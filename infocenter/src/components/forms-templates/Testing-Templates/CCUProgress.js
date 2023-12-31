import { useState } from "react";
import { BedStatusTable } from "./BedStatusTable";

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

export function CCUProgress({testingTemplatesData}) {
    
    const [testingProgress, setTestingProgress] = useState(testingTemplatesData);

    // Get the bed numberes from the testing template data
    const bedNumbers = testingTemplatesData.map((entry) => {
        return entry.bed
    }) 

    return (
        <div className="testing-template-form flex-c-col">
            <div className="testing-template-display">
                {bedNumbers.map((entry, index) => {
                    const currentBedData = testingProgress.find((bedData) => {
                        return bedData.bed === entry;
                    })
                    return (
                        <BedStatusTable key={`BedStatusTable-${entry}`} bedNumber={entry} bedIndex={index} testingTemplatesData={testingTemplatesData} currentBedData={currentBedData} updateTestingProgress={updateTestingProgress} testingProgress={testingProgress} setTestingProgress={setTestingProgress} bedDevices={["MX700", "Rack", "X2"]} />
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