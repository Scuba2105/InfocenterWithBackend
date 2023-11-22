import { useState } from "react";
import { BedStatusTable } from "./BedStatusTable";

const bedNumbers = [1, 2 , 3, 4, 5, 6, 7, 8];

const testData = [{bed: 1, MX700: true, Rack: true, X2: false},
                {bed: 2, MX700: true, Rack: true, X2: false},
                {bed: 3, MX700: true, Rack: true, X2: true},
                {bed: 4, MX700: true, Rack: true, X2: false},
                {bed: 5, MX700: true, Rack: false, X2: false},
                {bed: 6, MX700: true, Rack: true, X2: true},
                {bed: 7, MX700: true, Rack: true, X2: false},
                {bed: 8, MX700: false, Rack: true, X2: true}
]

function updateTestingProgress(testingProgress, setTestingProgress, selectedBedData, device) {
    // Get the selected device status 
    const affectedDeviceStatus = selectedBedData[device];
    
    // Copy the selected bed data and invert the selected device status.
    const updatedSelectedBedData = {...selectedBedData};
    updatedSelectedBedData[device] = !affectedDeviceStatus;

    // Check if the original data for the device is permanent or can be changed.
    const originalEntry = testData.find((entry) => {
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

export function CCUProgress() {

    const [testingProgress, setTestingProgress] = useState(testData);

    return (
        <div className="testing-template-display">
            {bedNumbers.map((entry, index) => {
                const currentBedData = testingProgress.find((bedData) => {
                    return bedData.bed === entry;
                })
                return (
                    <>
                        <BedStatusTable bedNumber={entry} bedIndex={index} currentBedData={currentBedData} updateTestingProgress={updateTestingProgress} testingProgress={testingProgress} setTestingProgress={setTestingProgress} bedDevices={["MX700", "Rack", "X2"]} />
                    </>
                )
            })}
        </div>
    )
}