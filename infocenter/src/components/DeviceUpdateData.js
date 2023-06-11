import { SelectInput } from "./SelectInput";
import { capitaliseFirstLetters } from "../utils/utils";

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
            <div className="device-input-container"> 
                <label>Service Manual: </label><input type="file" className="device-file-upload" id="file1" name="service-upload"></input>
            </div>
        );
    }
    else if (selectedOption === 'User Manual') {
        return (
            <div className="device-input-container">
                <label>User Manual: </label><input type="file" className="device-file-upload" id="file2" name="user-upload"></input>
            </div>
        );
    }
    else if (selectedOption === 'Software') {
        return (
            <div className="device-input-container">
                <label>Software File Location: </label><input type="text" disabled className="device-text-input" placeholder={selectedData.software}></input>
            </div>
        );
    }
    else if (selectedOption === 'Configurations') {
        return (
            <div className="device-input-container">
                <SelectInput label='Hospital' optionData={hospitalLocations} />
                <input type="file" className="device-file-upload" id="file1" name="config-upload"></input>
            </div> 
        );
    }
    else {
        return (
            <div className="device-input-container">
                <label>User Manual: </label><input type="file" className="device-file-upload" id="file2" name="user-upload"></input>
            </div>
        );
    }
}

    