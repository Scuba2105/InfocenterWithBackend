import { useState, useRef } from 'react';
import { DisplayOption } from './DisplayOption';
import { ServiceIcon, UserManualIcon, ConfigIcon, SoftwareIcon, DocumentsIcon} from "../../svg";
import { ModalSkeleton } from '../ModalSkeleton';
import { serverConfig } from '../../server';

const hospitalAcronyms = {'John Hunter Hospital': 'JHH', 'Royal Newcastle Centre': 'RNC'};
const configFileTypes = ['XML', 'DAT', 'TGZ', 'CFG'];

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

function buttonOffset(selectedOption) {
    if (selectedOption === "User Manual" || selectedOption === "Service Manual") {
        return "90px"
    }
    else if (selectedOption === "Configs") {
        return "-30px"
    }
    else if (selectedOption === "Software") {
        return "90px"
    }
    else if (selectedOption === "Other Documents") {
        return "90px"
    }
}

function formatText(text, fieldName) {
    if (fieldName === "field-name") {
        return text.toLocaleLowerCase().replace(/\s/ig, '-');
    }
    else {
        return text.toLocaleLowerCase().replace(/\s/ig, '_');
    }
    
}

function generateHospitalLabel(name) {
    const hospitalAcronymList = Object.keys(hospitalAcronyms);
    if (hospitalAcronymList.includes(name)) {
        return hospitalAcronyms[name].toLocaleLowerCase();
    }
    else {
        const nameLength = name.split(' ').length;
        return nameLength === 2 ? name.split(' ')[0].toLocaleLowerCase() : name.split(' ').slice(0, -1).join('-').toLocaleLowerCase();
    }
}

async function sendFormData(updateData, selectedData, page, setUpdateFormVisible, closeUpdate, queryClient, showMessage, closeDialog) {
            
    let dataKeys = [];
    for (const key of updateData.current.keys()) {
        dataKeys.push(key);
    }
    
    if (dataKeys.length === 2 && dataKeys[0] === 'model' && dataKeys[1] === 'manufacturer') {
        showMessage("error", 'No form data has been saved for upload');
        return;
    }        

    // Show the uploading spinner dialog while uploading.
    showMessage("uploading", `Uploading ${selectedData.model} Data`)
      
    try {
    
        // Post the form data to the server. 
        const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/UpdateEntry/${page}`, {
                method: "PUT", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer",
                body: updateData.current
        })

        const data = await res.json();
        if (data.type === "Error") {
            closeDialog();
            showMessage("error", `${data.message}.`);
        }
        else {
            // Need to clear formData at this point
            for (const pair of updateData.current.entries()) {
                if (!['model', 'manufacturer'].includes(pair[0])) {
                    updateData.current.delete(pair[0]);
                }
            }

            // Need to update app data.
            queryClient.invalidateQueries('dataSource');

            closeDialog();
            showMessage("info", 'Resources have been successfully updated!');
            setTimeout(() => {
                closeDialog();
                closeUpdate(setUpdateFormVisible);
            }, 1600);
        }
    }
    catch (error) {
        showMessage("error", error.message);
    }
} 

// Save the form data ready for upload
function saveUpdateData(e, selectedOption, updateData, selectedData, page, setUpdateFormVisible, closeUpdate, queryClient, showMessage, closeDialog) {
    // Add the files from the service manual and user manual forms to the formData ref
    if (selectedOption === 'Service Manual' || selectedOption === 'User Manual') {
        const selectedFile = e.target.parentNode.parentNode.querySelector('.file-input');
        if (selectedFile.files.length === 0) {
            showMessage("error", `No ${selectedOption} has been provided. Please choose a file and try again.`)
            return
        }
        else {
            // Get the extension from the uploaded file and append to the new filename in form data.
            const extension = selectedFile.files[0].name.split('.').slice(-1)[0];
            updateData.current.set(`${formatText(selectedOption, "field-name")}`, selectedFile.files[0], `${formatText(selectedData.model)}_${formatText(selectedOption)}.${extension}`);
            showMessage("info", `The ${selectedOption} for ${selectedData.model} has been saved ready for upload.`)
            setTimeout(() => {
                closeDialog();
            }, 1600);
        }
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
            showMessage("error", "The software type has not been selected. Please select an option and try again.");
            return;
        }
        if (textInput.value === "") {
            showMessage("error", 'No location has been provided for the software. Please specify a location and try again.');
            return
        }
        const data = `${softwareType}=${textInput.value}`;
        updateData.current.set('software', data);
        showMessage("info", `The ${selectedOption} location for ${selectedData.model} has been saved ready for upload.`)
        setTimeout(() => {
            closeDialog();
        }, 1600);
    }
    // Add the data from the configurations form to the formData ref
    else if (selectedOption === 'Configs') {
        const selectedHospital = e.target.parentNode.parentNode.querySelector('.form-select-input');
        const configDataInputs = e.target.parentNode.parentNode.querySelectorAll('.config-data-input');
        const dateInput = e.target.parentNode.parentNode.querySelector('.date-entry-input');
        const configFileInput = e.target.parentNode.parentNode.querySelector('.device-file-upload');
        
        updateData.current.set('hospital', selectedHospital.value);

        // Check mandatory fields have been entered
        if (configDataInputs[1].value === "") {
            showMessage("error", "Department is a mandatory field and has not been entered. Please enter a value.");
            return
        }
        else if (dateInput.value === "") {
            showMessage("error", 'Date Created is a mandatory field and has not been entered. Please enter a value.');
            return
        }

        // Initialise config data array with hospital label            
        let configDataArray = [generateHospitalLabel(selectedHospital.value)];
        
        // Loop over the Department, Sub-Location, Options and Software config data inputs
        const interimArray = [];
        configDataInputs.forEach((input, index) => {
            // Push the department and sub-location input values
            if (index === 1 || index === 3) {
                interimArray.push(input.value);                
            }
            
            // Parse options string. Filter out Intellivue monitors so options string can be parsed otherwise format the data appropriately.
            else if (index === 0 ) {
                if (input.value !== "" && (/^MX/.test(selectedData.model) || selectedData.model === 'X2' || selectedData.model === 'X3')) {
                    const regex = input.value.match(/[A-Za-z]\d{2}/ig);
                    interimArray.push((regex.join('-').toUpperCase()));
                }
                else {
                    input.value === "" ? interimArray.push('none') : configFileTypes.includes(input.value) ? interimArray.push(input.value.toUpperCase()) :
                    interimArray.push(capitaliseFirstLetters(input.value)); 
                }                                        
            }
            // Parse config software string and format
            else if (index === 2) {
                input.value === "" ? interimArray.push('none') : 
                interimArray.push(input.value.toUpperCase()); 
            }
        })

        // Transform the input values into the correct order in the string which differs from the DOM order.
        const transformedArray = [interimArray[1], interimArray[3], interimArray[0], interimArray[2]];
        configDataArray = [configDataArray[0], ...transformedArray];
        
        // Get the value of the date input
        const dateString = dateInput.value.split('-').reverse().join('.');
        
        // Create the config filename from the input data
        let configFilename;

        // Generates the file name based on config input and config file extension
        const fileExtension = configFileInput.files[0].name.split('.').slice(-1)[0];
        configDataArray[2] === "" ? configFilename = `${formatText(selectedData.model, "field-name")}_${configDataArray.slice(0, 2).join('_')}_${configDataArray.slice(3).join('_')}_${dateString}.${fileExtension}` :
        configFilename = `${formatText(selectedData.model, "field-name")}_${configDataArray[0]}_${configDataArray.slice(1, 3).join('--')}_${configDataArray.slice(3).join('_')}_${dateString}.${fileExtension}`
        
        if (configFileInput.files.length === 0) {
            showMessage("error", 'No config files selected. Please choose a config file and try again.')
            return 
        }
        else {
            updateData.current.set(`${formatText(selectedOption)}`, configFileInput.files[0], `${configFilename}`);
        }
        showMessage("info", `The new configuration for ${selectedData.model} has been saved ready for upload.`)
        setTimeout(() => {
            closeDialog();
        }, 1600);
    }
    else if (selectedOption === "Other Documents") {

        const descriptions = e.target.parentNode.parentNode.querySelectorAll(".other-doc-text-input");
        const fileInputs = e.target.parentNode.parentNode.querySelectorAll(".other-doc-file-upload");
        
        descriptions.forEach((description, index) => {
            if (description.value === "") {
                showMessage("error", `The description for File ${index + 1} is missing. Please provide a description and try again.`);
                return
            }
            updateData.current.set(`description${index + 1}`, description.value);
        })

        const fileInputArray = Array.from(fileInputs);
        
        for (const fileInput of fileInputArray) {
            const index = fileInputArray.indexOf(fileInput);
            if (fileInput.files.length === 0) {
                showMessage("error", `File ${index + 1} is missing. Please choose a file and try again.`);
                return 
            }
            updateData.current.set(`file${index + 1}`, fileInput.files[0]);
        }
        showMessage("info", `The documents for ${selectedData.model} have been saved ready for upload.`)
        setTimeout(() => {
            closeDialog();
        }, 1600);
    }
    
}

function updateSelectedOption(e, setSelectedOption, setFileNumber) {
    const selectedDiv = e.currentTarget;
    setSelectedOption(selectedDiv.textContent)
    setFileNumber([1]);
}

// Update the file count for the other documents page
function updateFileCount(e, fileNumber, setFileNumber, showMessage) {
    if (e.target.textContent === 'Add File') {
        const lastNumber = fileNumber[fileNumber.length - 1];
        
        if (lastNumber < 4) {
            setFileNumber([...fileNumber, lastNumber + 1]);
        }
        else {
            showMessage("warning", 'Maximum number of files reached. No more than 4 files can be added during one upload.')
        }
    }
    else {
        if (fileNumber.length !== 1) {
            const newArray = fileNumber.slice(0, -1);
            setFileNumber(newArray);
        }
    }
}

export function DeviceUpdateForm({selectedData, page, setUpdateFormVisible, closeUpdate, queryClient, showMessage, closeDialog}) {
    
    const [selectedOption, setSelectedOption] = useState('Service Manual')
    const [fileNumber, setFileNumber] = useState([1]);
                    
    // Create a new form data object for storing saved files and data.
    const formData = new FormData();
    formData.append("model", selectedData.model);
    formData.append("manufacturer", selectedData.manufacturer);
    const updateData = useRef(formData);
        
    return (
        <ModalSkeleton selectedData={selectedData} closeModal={() => closeUpdate(setUpdateFormVisible)} type="update" page={page}>
            <div className="update-form-display">
                <div className="update-options flex-c">
                    <div className={selectedOption === 'Service Manual' ? "device-data-option device-data-option-selected flex-c-col" : "device-data-option flex-c-col" } onClick={(e) => updateSelectedOption(e, setSelectedOption, setFileNumber)}>
                        <ServiceIcon color={selectedOption === "Service Manual" ? "#FBB934" : "#69737a"} size="25px"/>
                        Service Manual
                    </div>
                    <div className={selectedOption === 'User Manual' ? "device-data-option device-data-option-selected flex-c-col" : "device-data-option flex-c-col" } onClick={(e) => updateSelectedOption(e, setSelectedOption, setFileNumber)}>
                        <UserManualIcon color={selectedOption === "User Manual" ? "#FBB934" : "#69737a"} size="25px"/>
                        User Manual
                    </div>
                    <div className={selectedOption === 'Configs' ? "device-data-option device-data-option-selected flex-c-col" : "device-data-option flex-c-col" } onClick={(e) => updateSelectedOption(e, setSelectedOption, setFileNumber)}>
                        <ConfigIcon color={selectedOption === "Configs" ? "#FBB934" : "#69737a"} size="25px"/>
                        Configs
                    </div>
                    <div className={selectedOption === 'Software' ? "device-data-option device-data-option-selected flex-c-col" : "device-data-option flex-c-col" } onClick={(e) => updateSelectedOption(e, setSelectedOption, setFileNumber)}>
                        <SoftwareIcon color={selectedOption === "Software" ? "#FBB934" : "#69737a"} size="25px"/>
                        Software
                    </div>
                    <div className={selectedOption === 'Other Documents' ? "device-data-option device-data-option-selected flex-c-col" : "device-data-option flex-c-col" } onClick={(e) => updateSelectedOption(e, setSelectedOption, setFileNumber)}>
                        <DocumentsIcon color={selectedOption === "Other Documents" ? "#FBB934" : "#69737a"} size="25px"/>
                        Other Documents
                    </div>                    
                </div>
                <div className="display-section">
                    <DisplayOption selectedOption={selectedOption} selectedData={selectedData} fileNumber={fileNumber} setFileNumber={setFileNumber} showMessage={showMessage} updateFileCount={updateFileCount} />
                    <div className="form-buttons" style={{marginTop: buttonOffset(selectedOption)}}>
                        <div className="update-button save-button" onClick={(e) => saveUpdateData(e, selectedOption, updateData, selectedData, page, setUpdateFormVisible, closeUpdate, queryClient, showMessage, closeDialog)}>Save Changes</div>
                        <div className="update-button" onClick={() => sendFormData(updateData, selectedData, page, setUpdateFormVisible, closeUpdate, queryClient, showMessage, closeDialog)}>Upload Updates</div>
                    </div>                    
                </div>
            </div>                
        </ModalSkeleton>
    )
} 
