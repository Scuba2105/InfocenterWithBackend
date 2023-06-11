import { SelectInput } from "./SelectInput";
import { capitaliseFirstLetters } from "../utils/utils";
import { Cross, Tick } from "../svg";

const hospitals = ['JOHN HUNTER HOSPITAL', 'MAITLAND HOSPITAL', 'NEW MAITLAND HOSPITAL', 'BELMONT HOSPITAL', 'BULAHDELAH HOSPITAL', 'KURRI KURRI HOSPITAL', 
'CESSNOCK HOSPITAL', 'TAREE HOSPITAL', 'DUNGOG HOSPITAL', 'SINGLETON HOSPITAL', 'DENMAN MPS','GLOUCESTOR HOSPITAL', 'SCONE HOSPITAL', 'MUSWELBROOK HOSPITAL', 
'MURRURUNDI HOSPITAL', 'MERRIWA MPS', 'TAMWORTH HOSPITAL', 'WALCHA MPS', 'QUIRINDI HOSPITAL', 'GUNNEDAH HOSPITAL', 'MANILLA MPS', 
'ARMIDALE HOSPITAL', 'BARRABA MPS', 'GUYRA MPS', 'NARRABRI HOSPITAL',
'WEEWAA HOSPITAL', 'GLEN INNES HOSPITAL', 'MOREE HOSPITAL', 'WARIALDA MPS', 'INVERELL HOSPITAL', 
'TENTERFIELD HOSPITAL'];

const hospitalLocations = hospitals.map((hospital) => {
    return capitaliseFirstLetters(hospital)
}).sort();

export function DisplayOption({selectedOption, selectedData}) {
    if (selectedOption === 'Service Manual') {
        return (
            <div key={selectedOption} className="device-input-container"> 
                <label className="available-label">Currently Available: {selectedData.serviceManual ? <Tick color="rgb(7, 171, 138)" margin="25px" /> : <Cross color="#de0d37" margin="25px" />} </label>
                <label>Update Service Manual: </label><input type="file" className="device-file-upload" id="file1" name="service-upload"></input>
            </div>
        );
    }
    else if (selectedOption === 'User Manual') {
        return (
            <div key={selectedOption} className="device-input-container">
                <label className="available-label">Currently Available: {selectedData.userManual ? <Tick color="rgb(7, 171, 138)" margin="25px" /> : <Cross color="#de0d37" margin="25px" />} </label>
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
            <div key={selectedOption} className="device-input-container">
                <SelectInput label='Hospital' optionData={hospitalLocations} />
                <label className="sub-unit-label">Department </label><input type="text" className="sub-unit-entry" placeholder="eg. ICU, ED, Ward H1 etc."></input>
                <label className="sub-unit-label">{`Sub-Location (optional)`}</label><input type="text" className="sub-unit-entry" placeholder="eg. Transport, Paediatric etc."></input>
                <input type="file" className="device-file-upload" id="file1" name="config-upload"></input>
            </div> 
        );
    }
    else {
        return (
            <div key={selectedOption} className="device-input-container">
                <label>User Manual: </label><input type="file" className="device-file-upload" id="file2" name="user-upload"></input>
            </div>
        );
    }
}

    