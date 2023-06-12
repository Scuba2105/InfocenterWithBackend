import { useState, useRef } from 'react';
import { DisplayOption } from './DisplayOption';

const acronyms = ['ICU', 'ED', 'AGSU'];
const hospitalAcronyms = {'John Hunter Hospital': 'JHH', 'Royal Newcastle Centre': 'RNC'};

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

function generateHospitalLabel(name) {
    const hospitalAcronymList = Object.keys(hospitalAcronyms);
    if (hospitalAcronymList.includes(name)) {
        return hospitalAcronyms[name].toLocaleLowerCase();
    }
    else {
        return name.split(' ')[0].toLocaleLowerCase();
    }
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
        // Add the files from the service manual and user manual forms to the formData ref
        if (selectedOption === 'Service Manual' || selectedOption === 'User Manual') {
            const selectedFile = e.target.parentNode.parentNode.querySelector('.device-file-upload');
            if (selectedFile.files.length === 0) {
                alert('No files selected')
            }
            else {
                updateData.current.set(`${formatText(selectedOption)}`, selectedFile.files[0], `${formatText(selectedData.model)}_${formatText(selectedOption)}`);
                for (const pair of updateData.current.entries()) {
                    console.log(`${pair[0]}, ${pair[1]}`);
                }
            }
        }
        // Add the data from the software form to the formData ref
        else if (selectedOption === 'Software') {
            const selectedFile = e.target.parentNode.parentNode.querySelector('.device-text-input');
            updateData.current.set('software', selectedFile.value)
        }
        // Add the data from the configurations form to the formData ref
        else if (selectedOption === 'Configurations') {
            const selectedHospital = e.target.parentNode.parentNode.querySelector('.hospital-select');
            const configDataInputs = e.target.parentNode.parentNode.querySelectorAll('.sub-unit-entry');
            const dateInput = e.target.parentNode.parentNode.querySelector('.date-entry');
            const configFileInput = e.target.parentNode.parentNode.querySelector('.device-file-upload');
            
            updateData.current.set('hospital', selectedHospital.value);

            // Check mandatory fields have been entered
            if (configDataInputs[0].value === "") {
                alert("Department is a mandatory field and has not been entered");
                return
            }
            else if (dateInput.value === "") {
                alert('Date Created is a mandatory field and has not been entered');
                return
            }

            // Initialise config data array with hospital label            
            const configDataArray = [generateHospitalLabel(selectedHospital.value)];
            // Loop over the Department, Sub-Location, Options and Software config data inputs
            configDataInputs.forEach((input, index) => {
                if (index === 0 || index === 1) {
                    if (acronyms.includes(input.value.toUpperCase())) {
                        configDataArray.push((input.value.toUpperCase()))
                    }
                    else {
                        configDataArray.push((capitaliseFirstLetters(input.value)))
                    }
                }
                // Parse options string. Filter out Intellivue monitors so options string can be parsed
                else if (index === 2 ) {
                    if (input.value !== "" && (/^MX/.test(selectedData.model) || selectedData.model === 'X2' || selectedData.model === 'X3')) {
                        const regex = input.value.match(/[A-Za-z]\d{2}/ig);
                        configDataArray.push((regex.join('-').toUpperCase()));
                    }
                    else {
                        input.value === "" ? configDataArray.push('none') : 
                        configDataArray.push(input.value.toUpperCase()); 
                    }                                        
                }
                // Parse software string and format
                else if (index === 3) {
                    input.value === "" ? configDataArray.push('none') : 
                    configDataArray.push(input.value.toUpperCase()); 
                }
            })
            const dateString = dateInput.value.split('-').reverse().join('.');
            
            // Create the config filename from the input data
            let configFilename;
            configDataArray[2] === "" ? configFilename = `${formatText(selectedData.model)}_${configDataArray.slice(0, 2).join('_')}_${configDataArray.slice(3).join('_')}_${dateString}.cfg` :
            configFilename = `${formatText(selectedData.model)}_${configDataArray[0]}_${configDataArray.slice(1, 3).join('--')}_${configDataArray.slice(3).join('_')}_${dateString}.cfg`
        
            if (configFileInput.files.length === 0) {
                alert('No config files selected')
                return 
            }
            else {
                updateData.current.set(`${formatText(selectedOption)}`, configFileInput.files[0], `${configFilename}`);
            }
            
        }
        else if (selectedOption === "Other Documents") {
            const descriptions = e.target.parentNode.parentNode.querySelectorAll('.other-doc-text-input');
            const fileInputs = e.target.parentNode.parentNode.querySelectorAll('.other-doc-file-upload');
            
            descriptions.forEach((description, index) => {
                if (description.value === "") {
                    alert(`The description for File ${index + 1} is missing`);
                    return
                }
            })
            
            fileInputs.forEach((fileInput, index) => {
                if (fileInput.files.length === 0) {
                    alert(`File ${index + 1} is missing`);
                    return 
                }
            })
            
            descriptions.forEach((description, index) => {
                updateData.current.set(`description${index + 1}`, description.value);
            })

            fileInputs.forEach((fileInput, index) => {
                console.log(fileInput.files[0]);
            })
        }
        console.log(updateData.current.getAll('description1'))
    }

    function updateSelectedOption(e) {
        setSelectedOption(e.target.textContent)
        setFileNumber([1]);
    }

    function updateFileCount(e) {
        if (e.target.textContent === 'Add another file') {
            const lastNumber = fileNumber[fileNumber.length - 1];
            
            if (lastNumber < 4) {
                setFileNumber([...fileNumber, lastNumber + 1]);
            }
            else {
                alert('Maximum number of files reached!')
            }
        }
        else {
            if (fileNumber.length !== 1) {
                const newArray = fileNumber.slice(0, -1);
                setFileNumber(newArray);
            }
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
