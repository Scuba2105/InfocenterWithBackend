import { useState, useRef } from 'react';
import { DisplayOption } from './DisplayOption';
import { ServiceIcon, UserManualIcon, ConfigIcon, SoftwareIcon, DocumentsIcon, PasswordsIcon } from "../../svg";
import { ModalSkeleton } from '../ModalSkeleton';
import { FormButton } from '../FormButton';
import { serverConfig } from '../../server';
import { delayFunctionInitiation } from '../../utils/utils';

const hospitalAcronyms = {'John Hunter Hospital': 'JHH', 'Royal Newcastle Centre': 'RNC'};
const configFileTypes = ['XML', 'DAT', 'TGZ', 'CFG'];

// Store the regex for validating each of the password form inputs.
const passwordInputsRegex = [/^[a-z0-9 &/]+$/i, /^[a-z0-9 .&/]+$/i, /^[a-z0-9 \W]+$/i];

function getPasswordElements(formContainer, customAccessType, customPasswordType) {
    let accessTypeInput, credentialTypeInput, credentialValueInput;
        // Get the appropriate text input or select input based on access and password props.
        if (customAccessType && customPasswordType) {
            accessTypeInput = formContainer.querySelectorAll(".text-input")[0];
            credentialTypeInput = formContainer.querySelectorAll(".text-input")[1];
            credentialValueInput = formContainer.querySelectorAll(".text-input")[2];
        }
        else if (!customAccessType && customPasswordType) {
            accessTypeInput = formContainer.querySelector(".select-input");
            credentialTypeInput = formContainer.querySelectorAll(".text-input")[0];
            credentialValueInput = formContainer.querySelectorAll(".text-input")[1];
        }
        else if (customAccessType && !customPasswordType){
            accessTypeInput = formContainer.querySelectorAll(".text-input")[0];
            credentialTypeInput = formContainer.querySelector(".select-input");
            credentialValueInput = formContainer.querySelectorAll(".text-input")[1];
        }
        else {
            accessTypeInput = formContainer.querySelectorAll(".select-input")[0];
            credentialTypeInput = formContainer.querySelectorAll(".select-input")[1];
            credentialValueInput = formContainer.querySelector(".text-input");
        }

        return [accessTypeInput, credentialTypeInput, credentialValueInput];
}

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
    if (selectedOption === "UserManual" || selectedOption === "ServiceManual") {
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

async function sendFormData(equipmentEditPermissions, updateData, selectedData, page, setUpdateFormVisible, closeUpdate, queryClient, showMessage, closeDialog) {
            
    let dataKeys = [];
    for (const key of updateData.current.keys()) {
        dataKeys.push(key);
    }
    
    if (dataKeys.length === 2 && dataKeys[0] === 'model' && dataKeys[1] === 'manufacturer') {
        showMessage("warning", 'No form data has been saved for upload');
        return;
    }        

    // Show the uploading spinner dialog while uploading.
    showMessage("uploading", `Uploading ${selectedData.model} Data`)

    try {
    
        // Post the form data to the server. 
        const res = await fetch(equipmentEditPermissions ? `https://${serverConfig.host}:${serverConfig.port}/UpdateEntry/${page}` : `https://${serverConfig.host}:${serverConfig.port}/RequestDeviceUpdate`, {
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
function saveUpdateData(formContainer, selectedOption, updateData, selectedData, page, setUpdateFormVisible, customAccessType, customPasswordType, closeUpdate, queryClient, showMessage, closeDialog) {
    
    // Add the files from the service manual and user manual forms to the formData ref
    if (selectedOption === 'ServiceManual' || selectedOption === 'UserManual') {
        const selectedFile = formContainer.querySelector('.file-input');
        if (selectedFile.files.length === 0) {
            showMessage("warning", `No ${selectedOption === "ServiceManual" ? "Service Manual" : "User Manual"} has been provided. Please choose a file and try again.`)
            return
        }
        else {
            // Get the extension from the uploaded file and append to the new filename in form data.
            const extension = selectedFile.files[0].name.split('.').slice(-1)[0];
            const fieldName = selectedOption === "ServiceManual" ? "service-manual" : "user-manual";
            const filename = selectedOption === "ServiceManual" ? "service_manual" : "user_manual";
            updateData.current.set(fieldName, selectedFile.files[0], `${formatText(selectedData.model)}_${filename}.${extension}`);
            showMessage("info", `The ${selectedOption === "ServiceManual" ? "Service Manual" : "User Manual"} for ${selectedData.model} has been saved ready for upload.`)
            setTimeout(() => {
                closeDialog();
            }, 1600);
        }
    }
    
    // Add the data from the software form to the formData ref
    else if (selectedOption === 'Software') {
        const textInput = formContainer.querySelector('.device-text-input');
        const radioButtons = formContainer.querySelectorAll('input[type=radio]');
        let softwareType = null;
        radioButtons.forEach((radioButton) => {
            if (radioButton.checked) {
                softwareType = radioButton.id;
            }
        })
        if (softwareType === null) {
            showMessage("warning", "The software type has not been selected. Please select an option and try again.");
            return;
        }
        if (textInput.value.trim() === "") {
            showMessage("warning", 'No location has been provided for the software. Please specify a location and try again.');
            return
        }
        const data = `${softwareType}=${textInput.value.trim()}`;
        updateData.current.set('software', data);
        showMessage("info", `The ${selectedOption} location for ${selectedData.model} has been saved ready for upload.`)
        setTimeout(() => {
            closeDialog();
        }, 1600);
    }
    // Add the data from the configurations form to the formData ref
    else if (selectedOption === 'Configs') {
        const selectedHospital = formContainer.querySelector('.form-select-input');
        const configDataInputs = formContainer.querySelectorAll('.config-data-input');
        const dateInput = formContainer.querySelector('.date-entry-input');
        const configFileInput = formContainer.querySelector('.device-file-upload');
        
        updateData.current.set('hospital', selectedHospital.value);

        // Check mandatory fields have been entered
        if (configDataInputs[1].value.trim() === "") {
            showMessage("warning", "Department is a mandatory field and has not been entered. Please enter a value.");
            return
        }
        else if (dateInput.value.trim() === "") {
            showMessage("warning", 'Date Created is a mandatory field and has not been entered. Please enter a value.');
            return
        }

        // Initialise config data array with hospital label            
        let configDataArray = [generateHospitalLabel(selectedHospital.value)];
        
        // Loop over the Department, Sub-Location, Options and Software config data inputs
        const interimArray = [];
        configDataInputs.forEach((input, index) => {
            // Push the department and sub-location input values
            if (index === 1 || index === 3) {
                interimArray.push(input.value.trim());                
            }
            
            // Parse options string. Filter out Intellivue monitors so options string can be parsed otherwise format the data appropriately.
            else if (index === 0 ) {
                if (input.value.trim() !== "" && (/^MX/.test(selectedData.model) || selectedData.model === 'X2' || selectedData.model === 'X3')) {
                    const regex = input.value.match(/[A-Za-z]\d{2}/ig);
                    interimArray.push((regex.join('-').toUpperCase()));
                }
                else {
                    input.value.trim() === "" ? interimArray.push('none') : configFileTypes.includes(input.value.trim()) ? interimArray.push(input.value.toUpperCase().trim()) :
                    interimArray.push(capitaliseFirstLetters(input.value.trim())); 
                }                                        
            }
            // Parse config software string and format
            else if (index === 2) {
                input.value.trim() === "" ? interimArray.push('none') : 
                interimArray.push(input.value.toUpperCase().trim()); 
            }
        })

        // Transform the input values into the correct order in the string which differs from the DOM order.
        const transformedArray = [interimArray[1], interimArray[3], interimArray[0], interimArray[2]];
        configDataArray = [configDataArray[0], ...transformedArray];
        
        // Get the value of the date input
        const dateString = dateInput.value.split('-').reverse().join('.');
        
        // Create the config filename from the input data
        let configFilename;

        
        if (configFileInput.files.length === 0) {
            showMessage("warning", 'Config File has not been selected from the file input. Please choose a config file and try again.')
            return 
        }
        else {
            // Generates the file name based on config input and config file extension
            const fileExtension = configFileInput.files[0].name.split('.').slice(-1)[0];
            configDataArray[2] === "" ? configFilename = `${formatText(selectedData.model, "field-name")}_${configDataArray.slice(0, 2).join('_')}_${configDataArray.slice(3).join('_')}_${dateString}.${fileExtension}` :
            configFilename = `${formatText(selectedData.model, "field-name")}_${configDataArray[0]}_${configDataArray.slice(1, 3).join('--')}_${configDataArray.slice(3).join('_')}_${dateString}.${fileExtension}`
            
            // Add the config file to the form data. 
            updateData.current.set(`${formatText(selectedOption)}`, configFileInput.files[0], `${configFilename}`);
        }
        showMessage("info", `The new configuration for ${selectedData.model} has been saved ready for upload.`)
        setTimeout(() => {
            closeDialog();
        }, 1600);
    }
    else if (selectedOption === "OtherDocuments") {

        const descriptions = formContainer.querySelectorAll(".other-doc-text-input");
        const fileInputs = formContainer.querySelectorAll(".other-doc-file-upload");
        
        descriptions.forEach((description, index) => {
            if (description.value.trim() === "") {
                showMessage("warning", `The description for File ${index + 1} is missing. Please provide a description and try again.`);
                return
            }
            updateData.current.set(`description${index + 1}`, description.value.trim());
        })

        const fileInputArray = Array.from(fileInputs);
        
        for (const fileInput of fileInputArray) {
            const index = fileInputArray.indexOf(fileInput);
            if (fileInput.files.length === 0) {
                showMessage("warning", `File ${index + 1} is missing. Please choose a file and try again.`);
                return 
            }
            updateData.current.set(`file${index + 1}`, fileInput.files[0]);
        }
        showMessage("info", `The documents for ${selectedData.model} have been saved ready for upload.`)
        setTimeout(() => {
            closeDialog();
        }, 1600);
    }
    else if (selectedOption === "Passwords") {

        // get the password form elements based on provided props.
        const passwordFormElements = getPasswordElements(formContainer, customAccessType, customPasswordType);
        const passwordElementsArray = Array.from(passwordFormElements);

        const elementDescriptions = ["Restricted Access Type", "Credential Type", "Credential Value"];
        
        // Store the restricted access type for dialog message on save.
        let restrictedAccessType;

        // Validate the user inputs against empty strings and invalid string patterns.
        for (const [index, element] of passwordElementsArray.entries()) {
            if (element.value.trim() === "") {
                showMessage("warning", `The value has not been provided for ${elementDescriptions[index]}. Please enter the ${elementDescriptions[index]} and try again.`);
                return
            }
            if (!passwordInputsRegex[index].test(element.value.trim())) {
                showMessage("warning", `The value provided for ${elementDescriptions[index]} contains invalid characters. Please enter a valid ${elementDescriptions[index]} and try again. If the issue persists contact and administrator.`);
                return
            }
            updateData.current.set(`${elementDescriptions[index].toLowerCase().replace(/\s/g, "-")}`, element.value.trim());
            if (index === 0) {
                restrictedAccessType = element.value.trim();
            } 
        }
        
        showMessage("info", `The ${restrictedAccessType} data for ${selectedData.model} has been saved ready for upload.`)
        setTimeout(() => {
            closeDialog();
        }, 1600);
    }    
}

function updateSelectedOption(e, setSelectedOption, setFileNumber) {
    const selectedOptionButton = e.currentTarget;
    delayFunctionInitiation(() => {
        setSelectedOption(selectedOptionButton.textContent)
        setFileNumber([1]);
    })
}

// Update the file count for the other documents page
function updateFileCount(e, fileNumber, setFileNumber, showMessage) {
    const clickedButton = e.currentTarget;

    delayFunctionInitiation(() => {
        if (clickedButton.textContent === 'Add File') {
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
    })
}

function toggleAccessType(setCustomAccessType) {
    setCustomAccessType(a => !a);
}

function togglePasswordType(setCustomPasswordType) {
    setCustomPasswordType(p => !p);
}

function handleMouseOver(link, setHovered) {
    setHovered(link);
}

function handlemouseOut(setHovered) {
    setHovered(null);
}

export function DeviceUpdateForm({equipmentEditPermissions, selectedData, page, setUpdateFormVisible, closeUpdate, queryClient, showMessage, closeDialog}) {
    
    // Set the selected option when a device data option is clicked.
    const [selectedOption, setSelectedOption] = useState('ServiceManual')
    
    // Set the file number for the Other Documents page when the add or delete document button is pushed.
    const [fileNumber, setFileNumber] = useState([1]);

    // Specify whether a default access type and/or password type is used or whether a custom type is required.
    const [customAccessType, setCustomAccessType] = useState(false);
    const [customPasswordType, setCustomPasswordType] = useState(false);

    // Track the hover state of the device data options to control the css.
    const [hovered, setHovered] = useState(null);
                    
    // Create a new form data object for storing saved files and data.
    const formData = new FormData();
    formData.append("model", selectedData.model);
    formData.append("manufacturer", selectedData.manufacturer);

    // Attach request type to form data if it is a request by standard user and not an update from an administrator.
    if (!equipmentEditPermissions) {
        formData.append("request-type", "update-request");
        formData.append("timestamp", Date.now());
    }

    const updateData = useRef(formData);

    // Store the form container in a ref
    const formContainer = useRef(null)
        
    return (
        <ModalSkeleton selectedData={selectedData} closeModal={() => closeUpdate(setUpdateFormVisible)} type="update" page={page}>
            <div className="update-form-display">
                <div className="update-options flex-c">
                    <div className={selectedOption === 'ServiceManual' ? "device-data-option device-data-option-selected flex-c-col" : "device-data-option flex-c-col" } onClick={(e) => updateSelectedOption(e, setSelectedOption, setFileNumber)} onMouseOver={() => handleMouseOver("ServiceManual", setHovered)} onMouseOut={() => handlemouseOut(setHovered)}>
                        <ServiceIcon color={(selectedOption === "ServiceManual" || hovered === "ServiceManual") ? "#D4FB7C" : "#BCE7FD"} size="25px"/>
                        <div className='flex-c-col' style={{marginTop: 5 + 'px'}}>
                            <span>Service</span>
                            <span>Manual</span>
                        </div>
                    </div>
                    <div className={selectedOption === 'UserManual' ? "device-data-option device-data-option-selected flex-c-col" : "device-data-option flex-c-col" } onClick={(e) => updateSelectedOption(e, setSelectedOption, setFileNumber)} onMouseOver={() => handleMouseOver("UserManual", setHovered)} onMouseOut={() => handlemouseOut(setHovered)}>
                        <UserManualIcon color={(selectedOption === "UserManual" || hovered === "UserManual") ? "#D4FB7C" : "#BCE7FD"} size="25px"/>
                        <div className='flex-c-col' style={{marginTop: 5 + 'px'}}>
                            <span>User</span>
                            <span>Manual</span>
                        </div>
                    </div>
                    <div className={selectedOption === 'Configs' ? "device-data-option device-data-option-selected flex-c-col" : "device-data-option flex-c-col" } onClick={(e) => updateSelectedOption(e, setSelectedOption, setFileNumber)} onMouseOver={() => handleMouseOver("Configs", setHovered)} onMouseOut={() => handlemouseOut(setHovered)}>
                        <ConfigIcon color={(selectedOption === "Configs" || hovered === "Configs") ? "#D4FB7C" : "#BCE7FD"} size="25px"/>
                        <span style={{marginTop: 5 + 'px'}}>Configs</span>
                    </div>
                    <div className={selectedOption === 'Software' ? "device-data-option device-data-option-selected flex-c-col" : "device-data-option flex-c-col" } onClick={(e) => updateSelectedOption(e, setSelectedOption, setFileNumber)} onMouseOver={() => handleMouseOver("Software", setHovered)} onMouseOut={() => handlemouseOut(setHovered)}>
                        <SoftwareIcon color={(selectedOption === "Software" || hovered === "Software") ? "#D4FB7C" : "#BCE7FD"} size="25px"/>
                        <span style={{marginTop: 5 + 'px'}}>Software</span>
                    </div>
                    <div className={selectedOption === 'OtherDocuments' ? "device-data-option device-data-option-selected flex-c-col" : "device-data-option flex-c-col" } onClick={(e) => updateSelectedOption(e, setSelectedOption, setFileNumber)} onMouseOver={() => handleMouseOver("OtherDocuments", setHovered)} onMouseOut={() => handlemouseOut(setHovered)}>
                        <DocumentsIcon color={(selectedOption === "OtherDocuments" || hovered === "OtherDocuments") ? "#D4FB7C" : "#BCE7FD"} size="25px"/>
                        <div className='flex-c-col' style={{marginTop: 5 + 'px'}}>
                            <span>Other</span>
                            <span>Documents</span>
                        </div>
                    </div> 
                    <div className={selectedOption === 'Passwords' ? "device-data-option device-data-option-selected flex-c-col" : "device-data-option flex-c-col" } style={{marginRight: 20 + 'px'}} onClick={(e) => updateSelectedOption(e, setSelectedOption, setFileNumber)} onMouseOver={() => handleMouseOver("Passwords", setHovered)} onMouseOut={() => handlemouseOut(setHovered)}>
                        <PasswordsIcon color={(selectedOption === "Passwords" || hovered === "Passwords") ? "#D4FB7C" : "#BCE7FD"} size="25px"/>
                        <span style={{marginTop: 5 + 'px'}}>Passwords</span>
                    </div>                   
                </div>
                <div className="display-section" ref={formContainer}>
                    <DisplayOption selectedOption={selectedOption} selectedData={selectedData} fileNumber={fileNumber} setFileNumber={setFileNumber} showMessage={showMessage} updateFileCount={updateFileCount} customAccessType={customAccessType} toggleAccessType={() => toggleAccessType(setCustomAccessType)} customPasswordType={customPasswordType} togglePasswordType={() => togglePasswordType(setCustomPasswordType)} />
                    <div className="form-buttons" style={{marginTop: buttonOffset(selectedOption)}}>
                        <FormButton content="Save Progress" btnColor="#5ef8ed" marginTop="10px" marginBottom="30px" onClick={() => saveUpdateData(formContainer.current, selectedOption, updateData, selectedData, page, setUpdateFormVisible, customAccessType, customPasswordType, closeUpdate, queryClient, showMessage, closeDialog)} /> 
                        <FormButton content="Upload" btnColor="#D4FB7C" marginTop="10px" marginBottom="30px" onClick={() => sendFormData(equipmentEditPermissions, updateData, selectedData, page, setUpdateFormVisible, closeUpdate, queryClient, showMessage, closeDialog)} /> 
                    </div>                    
                </div>
            </div>                
        </ModalSkeleton>
    )
} 
