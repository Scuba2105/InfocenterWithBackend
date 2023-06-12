import { useState, useRef } from 'react';
import { DisplayOption } from './DisplayOption';

const acronyms = ['ICU', 'ED', 'AGSU'];

function capitaliseFirstLetters(input) {
    const words = input.split(' ');
    const formattedWords = words.map((word) => {
        return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase(); 
    })
    return formattedWords.join(' ')
}

function formatText(text) {
    return text.toLocaleLowerCase().replace(/\s/ig, '_');
}

export function DeviceUpdateForm({selectedData, closeUpdate}) {
    
    const [selectedOption, setSelectedOption] = useState('Service Manual')
    const [fileNumber, setFileNumber] = useState([1]);
    // Create a new form data object for storing saved files and data.
    const formData = new FormData();
    formData.append("model", selectedData.model);
    formData.append("manufacturer", selectedData.manufacturer);
    const updateData = useRef(formData);

    function saveUpdateData(e) {
        if (selectedOption === 'Service Manual' || selectedOption === 'User Manual') {
            const selectedFile = e.target.parentNode.parentNode.querySelector('.device-file-upload');
            if (selectedFile.files.length === 0) {
                alert('No files selected')
            }
            else {
                updateData.current.set(`${formatText(selectedOption)}`, selectedFile.files[0], `${formatText(selectedData.model)}_${formatText(selectedOption)}`);
            }
        }
        else if (selectedOption === 'Software') {
            const selectedFile = e.target.parentNode.parentNode.querySelector('.device-text-input');
            updateData.current.set('software', selectedFile.value)
        }
        else if (selectedOption === 'Configurations') {
            const selectedHospital = e.target.parentNode.parentNode.querySelector('.hospital-select');
            const configDataInputs = e.target.parentNode.parentNode.querySelectorAll('.sub-unit-entry');
           console.log(selectedHospital.value)
            const configDataArray = [];
            configDataInputs.forEach((input, index) => {
                // filter out Intellivue monitors so options string can be parsed
                if (index === 2 && (/^MX/.test(selectedData.model) || selectedData.model === 'X2' || selectedData.model === 'X3')) {
                    const regex = input.value.match(/[A-Za-z]\d{2}/ig)
                    configDataArray.push((regex.join('-').toUpperCase()))
                }
                else if (index === 3 || acronyms.includes(input.value.toUpperCase())) {
                    configDataArray.push(input.value.toUpperCase()); 
                }
                else {
                    console.log(input.value);
                    configDataArray.push(capitaliseFirstLetters(input.value)) 
                }
            })
            console.log(`${configDataArray.slice(0, 2).join('--')}_${configDataArray.slice(2).join('_')}`)
        }
    }

    function updateSelectedOption(e) {
        setSelectedOption(e.target.textContent)
        setFileNumber([1]);
    }

    function updateFileCount() {
        const lastNumber = fileNumber[fileNumber.length - 1];
        
        if (lastNumber < 4) {
            setFileNumber([...fileNumber, lastNumber + 1]);
        }
        else {
            alert('Maximum number of files reached!')
        }
        
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
                    <DisplayOption selectedOption={selectedOption} selectedData={selectedData} fileNumber={fileNumber} updateFileCount={updateFileCount} />
                    <div className="form-buttons">
                        <div className="update-button save-button" onClick={saveUpdateData}>Save Changes</div>
                        <div className="update-button" >Upload Updates</div>
                    </div>                    
                </div>                
            </div>
        </div>
    )
} 
