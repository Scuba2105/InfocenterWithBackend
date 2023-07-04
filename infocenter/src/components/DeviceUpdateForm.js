import { useState, useRef, useEffect } from 'react';
import { DisplayOption } from './DisplayOption';
import { ServiceIcon, UserManualIcon, ConfigIcon, SoftwareIcon, DocumentsIcon} from "../svg";
import { ModalSkeleton } from './ModalSkeleton';

const acronyms = ['ICU', 'ED', 'AGSU'];
const hospitalAcronyms = {'John Hunter Hospital': 'JHH', 'Royal Newcastle Centre': 'RNC'};

function capitaliseFirstLetters(input) {
    let words = input.split(' ');
    if (words.length === 1) {
        words = input.split('-');
    }
    const formattedWords = words.map((word) => {
        return word.slice(0, 1).toUpperCase() + word.slice(1).toLowerCase(); 
    })
    return formattedWords.join('-')
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

export function DeviceUpdateForm({selectedData, closeUpdate, queryClient}) {
    
    const [selectedOption, setSelectedOption] = useState('Service Manual')
    const [fileNumber, setFileNumber] = useState([1]);
    const [startUpload, setStartUpload] = useState(false);
    
    // Create a new form data object for storing saved files and data.
    const formData = new FormData();
    formData.append("model", selectedData.model);
    formData.append("manufacturer", selectedData.manufacturer);
    const updateData = useRef(formData);
                   
    useEffect(() => {
        async function sendFormData(upload) {
            if (upload) {
                
                const res = await fetch("http://localhost:5000/putDeviceData", {
                    method: "PUT", // *GET, POST, PUT, DELETE, etc.
                    mode: "cors", // no-cors, *cors, same-origin
                    redirect: "follow", // manual, *follow, error
                    referrerPolicy: "no-referrer",
                    body: updateData.current
                });
                                
                // Need to clear formData at this point
                for (const pair of updateData.current.entries()) {
                    if (!['model', 'manufacturer'].includes(pair[0])) {
                        updateData.current.delete(pair[0]);
                    }
                }

                // Need to update app data.
                queryClient.invalidateQueries('dataSource');
            }
            
            return () => {
                setStartUpload(false);
            } 
            
        }
        
        sendFormData(startUpload);
        
    }, [startUpload])

    function beginUpload() {
        let dataKeys = [];
        for (const key of updateData.current.keys()) {
            dataKeys.push(key);
        }
        
        if (dataKeys.length === 2 && dataKeys[0] === 'model' && dataKeys[1] === 'manufacturer') {
            alert('No form data has been saved for upload');
            return;
        }
        setStartUpload(true);
    }

    function saveUpdateData(e) {
        // Add the files from the service manual and user manual forms to the formData ref
        if (selectedOption === 'Service Manual' || selectedOption === 'User Manual') {
            const selectedFile = e.target.parentNode.parentNode.querySelector('.device-file-upload');
            if (selectedFile.files.length === 0) {
                alert('No files selected')
            }
            else {
                updateData.current.set(`${formatText(selectedOption)}`, selectedFile.files[0], `${formatText(selectedData.model)}_${formatText(selectedOption)}`);
            }
            alert(`The ${selectedOption} for ${selectedData.model} has been saved ready for upload`)
        }
        // Add the data from the software form to the formData ref
        else if (selectedOption === 'Software') {
            const textInput = e.target.parentNode.parentNode.querySelector('.device-text-input');
            const radioButtons = e.target.parentNode.parentNode.querySelectorAll('input[type=radio]');
            let softwareType = null;
            radioButtons.forEach((radioButton) => {
                if (radioButton.checked) {
                    softwareType = radioButton.id;
                }
            })
            if (softwareType === null) {
                alert("The software type has not been selected");
                return;
            }
            if (textInput.value === "") {
                alert('No location has been provided for the software!');
                return
            }
            const data = `${softwareType}=${textInput.value}`;
            updateData.current.set('software', data);
            alert(`The ${selectedOption} location for ${selectedData.model} has been saved`)
        }
        // Add the data from the configurations form to the formData ref
        else if (selectedOption === 'Configs') {
            const selectedHospital = e.target.parentNode.parentNode.querySelector('.hospital-select');
            const configDataInputs = e.target.parentNode.parentNode.querySelectorAll('.config-data-input');
            const dateInput = e.target.parentNode.parentNode.querySelector('.date-entry-input');
            const configFileInput = e.target.parentNode.parentNode.querySelector('.device-file-upload');
            
            updateData.current.set('hospital', selectedHospital.value);

            // Check mandatory fields have been entered
            if (configDataInputs[1].value === "") {
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
                console.log(input);
                if (index === 1 || index === 3) {
                    if (acronyms.includes(input.value.toUpperCase())) {
                        configDataArray.push((input.value.toUpperCase()))
                    }
                    else {
                        configDataArray.push(capitaliseFirstLetters(input.value));
                    }
                    console.log(configDataArray)
                }
                
                // Parse options string. Filter out Intellivue monitors so options string can be parsed
                else if (index === 0 ) {
                    if (input.value !== "" && (/^MX/.test(selectedData.model) || selectedData.model === 'X2' || selectedData.model === 'X3')) {
                        const regex = input.value.match(/[A-Za-z]\d{2}/ig);
                        configDataArray.push((regex.join('-').toUpperCase()));
                    }
                    else {
                        input.value === "" ? configDataArray.push('none') : 
                        configDataArray.push(input.value.toUpperCase()); 
                    }                                        
                }
                // Parse config software string and format
                else if (index === 3) {
                    input.value === "" ? configDataArray.push('none') : 
                    configDataArray.push(input.value.toUpperCase()); 
                }
            })
            const dateString = dateInput.value.split('-').reverse().join('.');
            
            // Create the config filename from the input data
            let configFilename;
            // Need to make adaptable for different config file extensions
            configDataArray[2] === "" ? configFilename = `${formatText(selectedData.model)}_${configDataArray.slice(0, 2).join('_')}_${configDataArray.slice(3).join('_')}_${dateString}.cfg` :
            configFilename = `${formatText(selectedData.model)}_${configDataArray[0]}_${configDataArray.slice(1, 3).join('--')}_${configDataArray.slice(3).join('_')}_${dateString}.cfg`
            
            if (configFileInput.files.length === 0) {
                alert('No config files selected')
                return 
            }
            else {
                updateData.current.set(`${formatText(selectedOption)}`, configFileInput.files[0], `${configFilename}`);
            }
            alert(`The new configuration for ${selectedData.model} has been saved ready for upload`)
        }
        else if (selectedOption === "Other Documents") {
            const descriptions = e.target.parentNode.parentNode.querySelectorAll('.other-doc-text-input');
            const fileInputs = e.target.parentNode.parentNode.querySelectorAll('.other-doc-file-upload');
            
            descriptions.forEach((description, index) => {
                if (description.value === "") {
                    alert(`The description for File ${index + 1} is missing`);
                    return
                }
                updateData.current.set(`description${index + 1}`, description.value);
            })
            const fileInputArray = Array.from(fileInputs);
            for (const fileInput of fileInputArray) {
                const index = fileInputArray.indexOf(fileInput);
                if (fileInput.files.length === 0) {
                    alert(`File ${index + 1} is missing`);
                    return 
                }
                updateData.current.set(`file${index + 1}`, fileInput.files[0]);
            }
            alert(`The documents for ${selectedData.model} have been saved`)
        }
        
    }

    function updateSelectedOption(e) {
        let startElement = e.target;
        let parentDiv;
        if (startElement.classList.contains('device-data-option')) {
            parentDiv = startElement;
        }
        else {
            while (!startElement.classList.contains('device-data-option')) {
                startElement = startElement.parentNode 
            }
            parentDiv = startElement;
        }
        
        setSelectedOption(parentDiv.textContent)
        setFileNumber([1]);
    }

    function updateFileCount(e) {
        if (e.target.textContent === 'Add File') {
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
        <ModalSkeleton selectedData={selectedData} closeModal={closeUpdate} type="update" >
            <div className="update-form-display">
                <div className="update-options">
                    <div className={selectedOption === 'Service Manual' ? "device-data-option device-data-option-selected" : "device-data-option" } onClick={updateSelectedOption}>
                        <ServiceIcon color={selectedOption === 'Service Manual' ? 'white' : 'rgb(132, 132, 139)'} size="25px"/>
                        Service Manual
                    </div>
                    <div className={selectedOption === 'User Manual' ? "device-data-option device-data-option-selected" : "device-data-option" } onClick={updateSelectedOption}>
                        <UserManualIcon color={selectedOption === 'User Manual' ? 'white' : 'rgb(132, 132, 139)'} size="25px"/>
                        User Manual
                    </div>
                    <div className={selectedOption === 'Configs' ? "device-data-option device-data-option-selected" : "device-data-option" } onClick={updateSelectedOption}>
                        <ConfigIcon color={selectedOption === 'Configs' ? 'white' : 'rgb(132, 132, 139)'} size="25px"/>
                        Configs
                    </div>
                    <div className={selectedOption === 'Software' ? "device-data-option device-data-option-selected" : "device-data-option" } onClick={updateSelectedOption}>
                        <SoftwareIcon color={selectedOption === 'Software' ? 'white' : 'rgb(132, 132, 139)'} size="25px"/>
                        Software
                    </div>
                    <div className={selectedOption === 'Other Documents' ? "device-data-option device-data-option-selected" : "device-data-option" } onClick={updateSelectedOption}>
                        <DocumentsIcon color={selectedOption === 'Other Documents' ? 'white' : 'rgb(132, 132, 139)'} size="25px"/>
                        Other Documents
                    </div>                    
                </div>
                <div className='display-section'>
                    <DisplayOption selectedOption={selectedOption} selectedData={selectedData} fileNumber={fileNumber} updateFileCount={updateFileCount} />
                    <div className="form-buttons">
                        <div className="update-button save-button" onClick={saveUpdateData}>Save Changes</div>
                        <div className="update-button" onClick={beginUpload}>Upload Updates</div>
                    </div>                    
                </div>
            </div>                
        </ModalSkeleton>
    )
} 
