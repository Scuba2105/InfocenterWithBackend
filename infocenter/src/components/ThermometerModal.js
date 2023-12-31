import { useState } from "react";
import { SkipIcon, NextIcon } from "../svg";
import { serverConfig } from "../server";

function onTableArrowClick(tableIndex, setTableIndex, maxIndex, e) {
    let id = e.target.id;
    while (!id) {
        id = e.target.parentNode.id;
    }
    
    const pressed = id.split('_')[0];
    
    if (pressed === "forward-next" && tableIndex < maxIndex - 1) {
        setTableIndex(i => i + 1);
    } 
    else if (pressed === "back-next" && tableIndex > 0) {
        setTableIndex(i => i - 1);
    }
    else if (pressed === "forward-skip") {
        setTableIndex(maxIndex - 1);
    }
    else if (pressed === "back-skip") {
        setTableIndex(0);
    }
}

function updateSelectedList(setSelectedList, selectedList, bmeNumber, e) {
    console.log(selectedList);
    if (e.currentTarget.checked) {
        // Push the checked BME to the return list
       setSelectedList([...selectedList, bmeNumber]);
    }
    else {
        // Remove the BME from the return list if check removed
        const newSelectedList = selectedList.filter((bme) => {
            return bme !== bmeNumber;
        })
        setSelectedList(newSelectedList);
    }
}

function getDescription(type) {
    if (type === "check") {
        return "*The following list of thermometer have not yet been received back from repair/calibration."
    }
    else if (type === "disposal") {
        return "*The following thermometers have been inactive for at least 2 months. Please select for disposal as required."
    }
}

async function returnSelected(selectedList, closeDialog, showMessage, closeModal) {
    
    // Stringify the input BME array for upload
    const requestData = JSON.stringify(selectedList);

    // Show the uploading dialog while communicating with server
    showMessage("uploading", `Updating Genius 3 repair list...`);

    try {
        // Send the data to the backend
        const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/Thermometers/UpdateReturns`, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer",
            responseType: "arraybuffer",
            headers: {
                'Content-Type': 'application/json'
                },
            body: requestData
        });

        // If error message is sent from server set response based on error status.
        if (res.status === 400) {
            const error = await res.json();
            throw new Error(error.message)
        }

        // Get the json data from the response.
        const data = await res.json();

        // Close the uploading dialog and show the auccess message for 1.6s.
        closeDialog();
        showMessage("info", data.message);
        setTimeout(() => {
            closeDialog();
            closeModal();
        }, 1600);
    } catch (error) {
        showMessage("error", error.message);
    }
}

async function disposeSelected(selectedList, closeDialog, showMessage, closeModal) {
    // Stringify the input BME array for upload
    const requestData = JSON.stringify(selectedList)

    // Show the uploading dialog while communicating with server
    showMessage("uploading", `Disposing selected Genius 3...`);

    try {
       // Send the data to the backend
       const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/Thermometers/Disposals`, {
            method: "PUT", // *GET, POST, PUT, DELETE, etc.
            mode: "cors", // no-cors, *cors, same-origin
            redirect: "follow", // manual, *follow, error
            referrerPolicy: "no-referrer",
            responseType: "arraybuffer",
            headers: {
                'Content-Type': 'application/json'
                },
            body: requestData
        });

        // If error message is sent form server set response based on error status.
        if (res.status === 400) {
            const error = await res.json();
            throw new Error(`${error.message} If the issue persists please contact an administrator.`)
        }

        // Get the json data from the response.
        const data = await res.json(); 
        
        // Close the uploading dialog and show the auccess message for 1.6s.
        closeDialog();
        showMessage("info", data.message);
        setTimeout(() => {
            closeDialog();
            closeModal();
        }, 1600);
    } catch (error) {
        showMessage("error", error.message);
    }
}

function checkAllBoxes(selectedList, setSelectedList, batchData) {
    const bmeList = batchData.map((entry) => {
        return entry.bme;
    });
    setSelectedList([...bmeList]);
}

export function ThermometerModal({batchData, type, closeDialog, showMessage, closeModal}) {
    
    const date = new Date(batchData[0].date);
    const dateString = date.toLocaleDateString();
    const [tableIndex, setTableIndex] = useState(0);
    const [selectedList,setSelectedList] = useState([]);
    
    
    const entriesPerPage = 6;
    const maxIndex = Math.ceil(batchData.length/entriesPerPage);
    
    const currentData = batchData.filter((entry, index) => {
        return index >= tableIndex*entriesPerPage && index <= (tableIndex*entriesPerPage + 5) 
    })

        return (
            <div className="thermometer-modal-container">
                <h4 id="thermometer-batch-heading">{type === "check" ?`Thermometer Batch ${dateString}` : "Inactive Thermometers"}</h4>
                <p id="thermometer-batch-info">{getDescription(type)}</p>
                <div className="thermometer-list">
                    <div className="thermometer-list-container">
                        {currentData.map((entry, index) => {
                            const bmeNumber = entry.bme; 
                            return (
                                <div key={`check-data-container-${bmeNumber}`} className="check-data-container">
                                    <label id="thermometer-bme">{`BME #: ${entry.bme}`}</label>
                                    <label id="thermometer-serial">{`Serial #: ${entry.serial}`}</label>
                                    <div id="thermometer-checkbox">
                                        {selectedList.includes(bmeNumber) ? 
                                        <input type="checkbox" checked onClick={(e) => updateSelectedList(setSelectedList, selectedList, bmeNumber, e)}></input> :
                                        <input type="checkbox" onClick={(e) => updateSelectedList(setSelectedList, selectedList, bmeNumber, e)}></input>}
                                    </div>
                                </div> 
                            );
                        })}
                    </div>
                    <div className="table-controls thermometer-table-controls" onClick={(e) => onTableArrowClick(tableIndex, setTableIndex, maxIndex, e)}>
                        <SkipIcon className="back-skip-icon" color="white" size="21px" offset="0" angle="0" id="back-skip" />
                        <NextIcon className="back-next-icon" color="white" size="11px" offset="1" angle="180" id="back-next" />
                        <label className="table-page-info">{`Showing ${tableIndex*entriesPerPage + 1} to ${batchData.length < (tableIndex + 1)*entriesPerPage ? batchData.length : tableIndex*entriesPerPage + entriesPerPage} of ${batchData.length}`}</label>
                        <NextIcon className="forward-next-icon" color="white" size="11px" offset="0" angle="0" id="forward-next" />
                        <SkipIcon className="forward-skip-icon" color="white" size="21px" offset="0" angle="180" id="forward-skip" />
                    </div>
                </div>
                {type === "check" ? 
                <button className="thermometer-form-button thermometer-modal-button" onClick={() => returnSelected(selectedList, closeDialog, showMessage, closeModal)}>Return Selected</button> 
                :
                <div className="therm-disposal-button-container">
                    <button className="select-all-button thermometer-modal-button" onClick={() => checkAllBoxes(selectedList, setSelectedList, batchData)}>Select All</button>
                    <button className="thermometer-disposal-button thermometer-modal-button" onClick={() => disposeSelected(selectedList, closeDialog, showMessage, closeModal)}>Dispose Selected</button>
                </div>}
            </div>
        )
}