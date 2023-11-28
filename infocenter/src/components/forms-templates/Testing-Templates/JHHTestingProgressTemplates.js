import { useEffect, useState } from "react";
import { BedStatusTable } from "./BedStatusTable";
import { SelectInput } from "../../SelectInput";
import { serverConfig } from "../../../server";
import { useConfirmation } from "../../StateStore";
 
// Departments with no sub-locations
const noSubLocationDepts = ["CCU"];

function resetTestingDeptProgress(currentDeptTestData, currentDept) {
    if (!noSubLocationDepts.includes(currentDept)) {
        for (const [sublocation, testData] of Object.entries(currentDeptTestData)) {
            testData.map((bedData) => {
                for (const [key, value] of Object.entries(bedData)) {
                    if (key !== "bed") {
                        bedData[key] = false;
                    }
                }
                return bedData;
            })
        }
    }
    else {
        currentDeptTestData.map((bedData) => {
            for (const [key, value] of Object.entries(bedData)) {
                if (key !== "bed") {
                    bedData[key] = false;
                }
            }
            return bedData;
        })
    }

    return currentDeptTestData
}

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
function updateSubLocation(setSubLocation, setTestingProgress, testingTemplatesData, e) {
    const newSubLocation = e.currentTarget.value;
    setSubLocation(newSubLocation);
    setTestingProgress(testingTemplatesData[newSubLocation]);
}

// Set the accessible room/bedside devices the current sublocation.
function getAvailableBedSideDevices(currentDept, subLocation, entry) {
    if (currentDept === "CCU") {
        return ["MX700", "Rack", "X2"];
    }
    if (currentDept === "ICU/PICU" || currentDept === "NICU") {
        return ["MX800", "Rack", "X2"];
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
    else if (currentDept === "Emergency Department") {
        if (subLocation === "Adult") {
            return entry === "Single Room" ? ["CVSM"] : ["MX700", "Rack", "X2"];
        } 
        else if (subLocation === "Paediatric") {
            return ["MX550", "Rack", "X2"];
        }
        else if (subLocation === "Resus") {
            return [4, 5].includes(entry) ? ["MX750", "Rack", "X2"] : ["MX700", "Rack", "X2"] 
        }
        else {
            return ["MX700", "Rack", "X2"];
        }
    }  
    else if (currentDept === "Operating Suite") {
        if (subLocation === "Anaesthetic Bays") {
            return ["B450", "PSMP"];
        } 
        else {
            return entry.Theatre === 7 ? ["Bed", "ESU No.1", "ESU No.2"] : ["Bed", "ESU"];
        }
    }  
}

async function uploadTestingProgress(currentDept, subLocation, testingProgress, queryClient, showMessage, closeDialog) {
    const updatedTestingData = {hospital: "John Hunter Hospital", department: currentDept, subLocation: subLocation, testData: testingProgress};
    
    // Show the uploading dialog when sending to server
    showMessage("uploading", `Uploading testing progress updates`);

    // Start the post request
    try {
        // Post the data to the server  
        const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/UpdateTestingData`, {
                method: "PUT", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedTestingData),
        });

        const data = await res.json();

        if (data.type === "Error") {
            closeDialog();
            showMessage("error", `${data.message}. If the issue persists please contact an administrator.`);
        }
        else {                            
            // Need to update app data.
            queryClient.invalidateQueries('dataSource');

            closeDialog();
            showMessage("info", `${currentDept} testing progress has been successfully updated!`);
            setTimeout(() => {
                closeDialog();
            }, 1600);
        }
    }
    catch (error) {
        showMessage("error", `${error.message}.`)
    }
}

// Function to be called when reset button pushed.
async function confirmResetTestingProgress(currentDept, showMessage) {
    // Have user confirm to proceed if changing mandatory data
    showMessage("confirmation", `You are about to clear all testing data and reset the testing progress data for ${currentDept}. Please confirm you wish to proceed or cancel to prevent clearing the current data.`);
}

export function JHHTestingProgressTemplates({testingTemplatesData, currentDept, queryClient, showMessage, closeModal, closeDialog}) {
    console.log(testingTemplatesData["John Hunter Hospital"][currentDept])
    const [currentDeptTestData, setCurrentDeptTestData] = useState(testingTemplatesData["John Hunter Hospital"][currentDept]["testData"]);
    const [lastUpdated, setLastUpdated] = useState(testingTemplatesData["John Hunter Hospital"][currentDept]["lastUpdate"]);
    
    // Get the available sublocations data from the current dept test data.
    const availableSubLocations = Object.keys(currentDeptTestData);
    
    // Store the index of the selected sub location.
    const [subLocation, setSubLocation] = useState(!noSubLocationDepts.includes(currentDept) ? availableSubLocations[0] : null);

    // Store the current testing progress array.
    const [testingProgress, setTestingProgress] = useState(noSubLocationDepts.includes(currentDept) ? currentDeptTestData : currentDeptTestData[subLocation]);
    
    // Get the bed numbers from the testing template data.
    const bedNumbers = testingProgress.map((entry) => {
        return entry.bed;
    }) 
    
    // Get the confirmation result from Zustand state store.
    const confirmationResult = useConfirmation((state) => state.updateConfirmation);
    const resetConfirmationStatus = useConfirmation((state) => state.resetConfirmation);

    useEffect(() => {
        if (confirmationResult === "proceed") {

            const resetData = {hospital: "John Hunter Hospital", department: currentDept}

            async function proceedwithReset() {
                showMessage("uploading", `Resetting ${currentDept} Testing Progess Data`);

                try {
                    // Post the data to the server  
                    const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/ResetTestingProgress`, {
                            method: "PUT", // *GET, POST, PUT, DELETE, etc.
                            mode: "cors", // no-cors, *cors, same-origin
                            redirect: "follow", // manual, *follow, error
                            referrerPolicy: "no-referrer",
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(resetData),
                    })
        
                    const data = await res.json();

                    if (data.type === "Error") {
                        closeDialog();
                        showMessage("error", `${data.message} If the issue persists please contact an administrator.`);
                    }
                    else {                            
                        // Need to update app data.
                        queryClient.invalidateQueries('dataSource');
                                    
                        closeDialog();
                        showMessage("info", `${currentDept} testing progress has been successfully reset!`);
                        
                        setTimeout(() => {
                            closeDialog();
                        }, 1600);
                        
                        // Reset testing progress state to all false using setTestingProgress and algroithm on backend
                        const resetDeptTestData = resetTestingDeptProgress(currentDeptTestData, currentDept);
                        const date = new Date();
                        setCurrentDeptTestData(resetDeptTestData);
                        setLastUpdated(date.toLocaleDateString());
                        setTestingProgress(noSubLocationDepts.includes(currentDept) ? resetDeptTestData : resetDeptTestData[subLocation])
                        resetConfirmationStatus();
                    }
                } 
                catch (error) {
                    showMessage("error", `${error.message}.`)
                }
            }
            proceedwithReset();
        }
        
        return () => {
            resetConfirmationStatus();
        }    
    }, [confirmationResult, resetConfirmationStatus, closeDialog, closeModal, showMessage, queryClient, currentDept, currentDeptTestData, subLocation]);
         
    
    return (
        <div className="testing-template-form flex-c-col">
            {subLocation && <div className="testing-template-navigation-container flex-c">
                <SelectInput type="testing-template" label="Sub Location" value={subLocation} optionData={availableSubLocations} onChange={(e) => updateSubLocation(setSubLocation, setTestingProgress, currentDeptTestData, e)} />
            </div>}
            <label className="testing-template-update-date">{`Last Updated: ${lastUpdated}`}</label>
            <div className="testing-template-display">
                {bedNumbers.map((entry, index) => {
                    const currentBedData = testingProgress.find((bedData) => {
                        return bedData.bed === entry || bedData.bay === entry || bedData.Theatre === entry;
                    })
                    console.log(currentBedData)
                    return (
                        <BedStatusTable key={`BedStatusTable-${entry}`} currentDept={currentDept} bedNumber={entry} bedIndex={index} testingTemplatesData={noSubLocationDepts.includes(currentDept) ? currentDeptTestData : currentDeptTestData[subLocation]} currentBedData={currentBedData} updateTestingProgress={updateTestingProgress} testingProgress={testingProgress} setTestingProgress={setTestingProgress} bedDevices={getAvailableBedSideDevices(currentDept, subLocation, entry)} />
                    )
                })} 
            </div>
            <div className="testing-template-upload-btn-container size-100 flex-c">
                <div className="update-button reset-button testing-template-upload-btn" onClick={() => confirmResetTestingProgress(currentDept, showMessage)}>Reset Form</div>
                <div className="update-button testing-template-upload-btn" onClick={() => uploadTestingProgress(currentDept, subLocation, testingProgress, queryClient, showMessage, closeDialog)}>Upload Progress</div>
            </div> 
        </div>
    )
}