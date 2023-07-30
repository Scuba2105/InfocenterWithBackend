import { useState, useRef } from "react";
import { SkipIcon, NextIcon } from "../svg";

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

function updateReturnList(returnList, bmeNumber, e) {
    if (e.currentTarget.checked) {
        // Push the checked BME to the return list
        returnList.current.push(bmeNumber);
    }
    else {
        // Remove the BME from the return list if check removed
        const newReturnList = returnList.current.filter((bme) => {
            return bme !== bmeNumber;
        })
        returnList.current = newReturnList;
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

function returnSelected() {
    console.log("returning selected");
}

function disposeSelected() {
    console.log("dispose selected");
}

export function ThermometerModal({batchData, type}) {
    
    const date = new Date(batchData[0].date);
    const dateString = date.toLocaleDateString();
    const [tableIndex, setTableIndex] = useState(0);
    const returnList = useRef([]);
    
    const entriesPerPage = 6;
    const maxIndex = Math.ceil(batchData.length/entriesPerPage);
    
    const currentData = batchData.filter((entry, index) => {
        return index >= tableIndex*entriesPerPage && index <= (tableIndex*entriesPerPage + 5) 
    })

    if (type === "check") {
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
                                        {returnList.current.includes(bmeNumber) ? 
                                        <input type="checkbox" checked onClick={(e) => updateReturnList(returnList, bmeNumber, e)}></input> :
                                        <input type="checkbox" onClick={(e) => updateReturnList(returnList, bmeNumber, e)}></input>}
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
                {type === "check" ? <button className="thermometer-form-button thermometer-modal-button" onClick={returnSelected}>Return Selected</button> : 
                                    <button className="thermometer-disposal-button thermometer-modal-button" onClick={disposeSelected}>Dispose Selected</button>}
            </div>
        )
    }
    else if (type === "disposal") {

    }
}