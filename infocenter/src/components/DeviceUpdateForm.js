import { useState } from 'react';
import { DisplayOption } from './DeviceUpdateData';

export function DeviceUpdateForm({selectedData, closeUpdate}) {
    
    const [selectedOption, setSelectedOption] = useState('Service Manual')

    function updateSelectedOption(e) {
        setSelectedOption(e.target.textContent)
    }
    
    return (
        <div className="config-modal">
            <div className="modal-title-bar">
                <h2 className="model-title">{`Update ${selectedData.model} Data`}</h2> 
                <img className="cross" src={`${process.env.PUBLIC_URL}/images/cross.svg`} alt="cross" onClick={closeUpdate}></img>   
            </div>
            <div className="update-form-display">
                <div className="update-options">
                    <label className={selectedOption === 'Service Manual' ? "device-data-option device-data-option-selected" : "device-data-option"} onClick={updateSelectedOption}>Service Manual</label>
                    <label className={selectedOption === 'User Manual' ? "device-data-option device-data-option-selected" : "device-data-option"} onClick={updateSelectedOption}>User Manual</label>
                    <label className={selectedOption === 'Configurations' ? "device-data-option device-data-option-selected" : "device-data-option"} onClick={updateSelectedOption}>Configurations</label>
                    <label className={selectedOption === 'Software' ? "device-data-option device-data-option-selected" : "device-data-option"} onClick={updateSelectedOption}>Software</label>
                    <label className={selectedOption === 'Other Documents' ? "device-data-option device-data-option-selected" : "device-data-option"} onClick={updateSelectedOption}>Other Documents</label>
                </div>
                <div className='display-section'>
                    <DisplayOption selectedOption={selectedOption} selectedData={selectedData} />
                    <div className="form-buttons">
                        <div className="update-button save-button" >Save Changes</div>
                        <div className="update-button" >Upload Updates</div>
                    </div>                    
                </div>                
            </div>
        </div>
    )
} 
