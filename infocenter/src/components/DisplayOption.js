import { SelectInput } from "./SelectInput";
import { capitaliseFirstLetters } from "../utils/utils";
import { Cross, Tick } from "../svg";

const hospitals = ['JOHN HUNTER HOSPITAL', 'ROYAL NEWCASTLE CENTRE', 'MAITLAND HOSPITAL', 'NEW MAITLAND HOSPITAL', 'BELMONT HOSPITAL', 'BULAHDELAH HOSPITAL', 'KURRI KURRI HOSPITAL', 
'CESSNOCK HOSPITAL', 'TAREE HOSPITAL', 'DUNGOG HOSPITAL', 'SINGLETON HOSPITAL', 'DENMAN MPS','GLOUCESTOR HOSPITAL', 'SCONE HOSPITAL', 'MUSWELBROOK HOSPITAL', 
'MURRURUNDI HOSPITAL', 'MERRIWA MPS', 'TAMWORTH HOSPITAL', 'WALCHA MPS', 'QUIRINDI HOSPITAL', 'GUNNEDAH HOSPITAL', 'MANILLA MPS', 
'ARMIDALE HOSPITAL', 'BARRABA MPS', 'GUYRA MPS', 'NARRABRI HOSPITAL',
'WEEWAA HOSPITAL', 'GLEN INNES HOSPITAL', 'MOREE HOSPITAL', 'WARIALDA MPS', 'INVERELL HOSPITAL', 
'TENTERFIELD HOSPITAL'];

const hospitalLocations = hospitals.map((hospital) => {
    return capitaliseFirstLetters(hospital)
}).sort();

export function DisplayOption({selectedOption, selectedData, fileNumber, updateFileCount}) {

    if (selectedOption === 'Service Manual') {
        return (
            <div key={selectedOption} className="device-input-container"> 
                <label className="available-label">Currently Available: {selectedData.serviceManual ? <Tick color="rgb(7, 171, 138)" /> : <Cross color="#de0d37" />} </label>
                <label>Update Service Manual: </label><input type="file" className="device-file-upload" id="file1" name="service-upload"></input>
            </div>
        );
    }
    else if (selectedOption === 'User Manual') {
        return (
            <div key={selectedOption} className="device-input-container">
                <label className="available-label">Currently Available: {selectedData.userManual ? <Tick color="rgb(7, 171, 138)" /> : <Cross color="#de0d37" />} </label>
                <label>Update User Manual: </label><input type="file" className="device-file-upload" id="file2" name="user-upload"></input>
            </div>
        );
    }
    else if (selectedOption === 'Software') {
        return (
            <div key={selectedOption} className="device-input-container">
                <label id="software-available" className="available-label">Current Location Provided: {selectedData.software !== "" ? <Tick color="rgb(7, 171, 138)" size="18px" margin="25px" /> : <Cross color="#de0d37" size="18px" margin="25px" />} </label>
                <label>Update Software File Location: </label><input type="text" className="device-text-input" placeholder={selectedData.software}></input>
            </div>
        );
    }
    else if (selectedOption === 'Configurations') {
        return (
            <div key={selectedOption} id="device-config-container" className="device-input-container">
                <h4>Add New Configuration</h4>
                <div className="location-info">
                    <SelectInput label='Hospital' optionData={hospitalLocations} />
                    <label className="sub-unit-label">Department </label><input type="text" className="sub-unit-entry" placeholder="eg. ICU, ED, Ward H1 etc."></input>
                    <label className="sub-unit-label">{`Sub-Location (optional)`}</label><input type="text" className="sub-unit-entry" placeholder="eg. Transport, Paediatric etc."></input>
                </div>
                <div className="config-info">
                    <label className="sub-unit-label">{`Options (optional)`}</label><input type="text" className="sub-unit-entry" placeholder="eg. A06, H10, C06 etc"></input>
                    <label className="sub-unit-label">{`Software Rev. (optional)`}</label><input type="text" className="sub-unit-entry" placeholder="eg. M.03.01, L.01.02"></input>
                    <label className="sub-unit-label">{`Date Created`}</label><input type="date" className="date-entry"></input>
                </div>
                <div className="config-file-container">
                    <label>Select Config File</label>
                    <input type="file" className="device-file-upload" id="config-file" name="config-upload"></input>
                </div>
            </div> 
        );
    }
    else {
        return (
            <div key={selectedOption} className="other-input-container">
                {fileNumber.map((number) => {
                    return (
                    <div key={`container-${number}`} className="description-file-container">
                        <div className="label-input-container1">
                            <label key={`label-desc-${number}`}>{`File Description:`} </label>
                            <input key={`text${number}`} type="text" className="other-doc-text-input" name={`description-${number}`}></input>
                        </div>
                        <div className="label-input-container2">
                            <label key={`label-input-${number}`}>{`File ${number}:`} </label>
                            <input key={`file${number}`} type="file" className="other-doc-file-upload" name="user-upload"></input>
                        </div>
                    </div>
                    );
                })
                
                }
                <div className="other-file-button-container">
                    {fileNumber[fileNumber.length - 1] < 4 && <button id="add-another-file" onClick={updateFileCount} style={fileNumber.length === 1 ? {marginRight: '0px'} : {marginRight: '15px'}}>Add another file</button>}
                    {fileNumber.length !== 1 && <button id="remove-file" onClick={updateFileCount} style={fileNumber.length === 4 ? {marginLeft: '0px'} : {marginLeft: '15px'}}>Remove file</button>}
                </div>
            </div>
        );
    }
}

    