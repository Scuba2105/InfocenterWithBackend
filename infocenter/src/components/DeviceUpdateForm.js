import { capitaliseFirstLetters } from "../utils/utils";
import { SelectInput } from "./SelectInput";

const hospitals = ['JOHN HUNTER HOSPITAL', 'MAITLAND HOSPITAL', 'NEW MAITLAND HOSPITAL', 'BELMONT HOSPITAL', 'BULAHDELAH HOSPITAL', 'KURRI KURRI HOSPITAL', 
'CESSNOCK HOSPITAL', 'TAREE HOSPITAL', 'DUNGOG HOSPITAL', 'SINGLETON HOSPITAL', 'DENMAN MPS','GLOUCESTOR HOSPITAL', 'SCONE HOSPITAL', 'MUSWELBROOK HOSPITAL', 
'MURRURUNDI HOSPITAL', 'MERRIWA MPS', 'TAMWORTH HOSPITAL', 'WALCHA MPS', 'QUIRINDI HOSPITAL', 'GUNNEDAH HOSPITAL', 'MANILLA MPS', 
'ARMIDALE HOSPITAL', 'BARRABA MPS', 'GUYRA MPS', 'NARRABRI HOSPITAL',
'WEEWAA HOSPITAL', 'GLEN INNES HOSPITAL', 'MOREE HOSPITAL', 'WARIALDA MPS', 'INVERELL HOSPITAL', 
'TENTERFIELD HOSPITAL'];

const hospitalLocations = hospitals.map((hospital) => {
    return capitaliseFirstLetters(hospital)
}).sort();

export function DeviceUpdateForm({selectedData, closeUpdate}) {
    return (
        <div className="config-modal">
            <div className="modal-title-bar">
                <h2 className="model-title">{`Update ${selectedData.model} Data`}</h2> 
                <img className="cross" src={`${process.env.PUBLIC_URL}/images/cross.svg`} alt="cross" onClick={closeUpdate}></img>   
            </div>
            <div className="update-form-display">
                <div className='display-section-left'>
                    <div className="device-input-container">
                        <label>Manufacturer: </label><input type="text" disabled className="device-text-input" placeholder={selectedData.manufacturer}></input>
                    </div>
                    <div className="device-input-container"> 
                        <label>Service Manual: </label><input type="file" className="device-file-upload" id="file1" name="service-upload"></input>
                    </div>    
                    <div className="device-input-container">
                        <label>User Manual: </label><input type="file" className="device-file-upload" id="file2" name="user-upload"></input>
                    </div> 
                    <div className="device-input-container">
                        <label>Software File Location: </label><input type="text" disabled className="device-text-input" placeholder={selectedData.software}></input>
                    </div>
                </div>
                <div className='display-section-right'>
                    <div className="device-input-container">
                        <SelectInput label='Hospital' optionData={hospitalLocations} />
                        <input type="file" className="device-file-upload" id="file1" name="config-upload"></input>
                    </div>
                </div>                
            </div>
        </div>
    )
} 
