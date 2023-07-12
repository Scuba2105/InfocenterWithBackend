import { useState, useRef, useEffect, useCallback } from "react";
import { Input } from "./Input";
import { SelectInput } from "./SelectInput"
import { TooltipButton } from "./TooltipButton";

export function AddNewForm({page, pageData, showMessage}) {
    
    const [addNewManufacturer, setAddNewManufacturer] = useState(false);
    const [addNewType, setaddNewType] = useState(false);
    const [uploadData, setUploadData] = useState(false);

    // Define add new form DOM element and formdata refs
    const formData = new FormData();
    const newData = useRef(formData);
    const formContainer = useRef(null);

    const placeholderValue = page === "staff" ? "staff member full name" : "equipment model" 
    const nameInputLabel = page === "staff" ? "Full Name" : "Equipment Model/Name"

    // Upload the data when the upload button is pressed
    useEffect(() => {
        if (uploadData) {
            saveFormData();            
        }

        return () => {
            setUploadData(false);
        }
    },[uploadData]);

    function startUpload() {
        setUploadData(true);
    }

    function toggleAddNewType() {
        setaddNewType(t => !t);
    }
    
    function toggleAddNewManufacturer() {
        setAddNewManufacturer(m => !m);
    }

    function getInputElements(newForm) {
        const modelInput = newForm.querySelector('.text-input');
        let manufacturerInput, deviceTypeInput 
        if (addNewManufacturer && !addNewType) {
            deviceTypeInput = newForm.querySelector('.select-input');
            manufacturerInput = newForm.querySelectorAll('.text-input')[1];
        }
        else if (!addNewManufacturer && addNewType) {
            deviceTypeInput = newForm.querySelectorAll('.text-input')[1];
            manufacturerInput = newForm.querySelector('.select-input')[0]
        }
        else if (addNewManufacturer && addNewType) {
            deviceTypeInput = newForm.querySelectorAll('.text-input')[1];
            manufacturerInput = newForm.querySelectorAll('.text-input')[2]
        }
        else {
            deviceTypeInput = newForm.querySelectorAll('.select-input')[0];
            manufacturerInput = newForm.querySelectorAll('.select-input')[1]
        }
        const fileInput = newForm.querySelector(".file-input")
        
        return [modelInput, deviceTypeInput, manufacturerInput, fileInput];
    }

    function saveFormData(formContainer) {
        const deviceDataOptions = ["Device Model", "Device Type", "Manufacturer", "Image File"]
        const formDataNames = deviceDataOptions.map((option) => {
            return option.toLocaleLowerCase().replace(' ', '-');
        })
        const newForm = formContainer.current;
        const inputElements = getInputElements(newForm);
        inputElements.forEach((input,index) => {
            if (input.value === "") {
                showMessage("error", `The input for the ${deviceDataOptions[index]} is empty. Please enter the necessary data and try again.`)
                return;
            }
        })
        
        // Append the input data to the form data object
        inputElements.forEach((input, index) => {
            newData.current.set(formDataNames[index], input.value);
        })
    }

    function generateExistingSelectValues() {
        const values = pageData.reduce((acc, currEntry) => {
            if (!acc.models.includes(currEntry.model)) {
                acc.models.push(currEntry.model);
            }
            if (!acc.types.includes(currEntry.type)) {
                acc.types.push(currEntry.type);
            }
            if (!acc.manufacturers.includes(currEntry.manufacturer)) {
                acc.manufacturers.push(currEntry.manufacturer);
            }
            return acc;
        }, {models: [], types: [], manufacturers: []});
        return values;
    }

    // Generate existing values for data validation and consistency. 
    const existingSelectValues = generateExistingSelectValues();
    const unavailableModels = existingSelectValues.models;
    const currentTypes = existingSelectValues.types.sort();
    const currentManufacturers = existingSelectValues.manufacturers.sort(); 

    return (
        <div className="modal-display">
            <h3 className="add-new-heading">New Equipment Details</h3>
            <div className="add-new-input-container" ref={formContainer}>
                <Input inputType="text" identifier="add-new" labelText={nameInputLabel} placeholdertext={`Enter new ${placeholderValue}`} />
                <div className="edit-add-new-container">
                    <TooltipButton content={addNewType ? "Undo" :"Add New"} boolean={addNewType} toggleFunction={toggleAddNewType}/>
                    {addNewType ? <Input inputType="text" identifier="add-new" labelText="Device Type" placeholdertext={`Enter new device type`} /> : 
                    <SelectInput label="Device Type" optionData={currentTypes} />}
                    <div className="add-new-aligner"></div>
                </div>
                <div className="edit-add-new-container">
                    <TooltipButton content={addNewManufacturer ? "Undo" :"Add New"} boolean={addNewManufacturer} toggleFunction={toggleAddNewManufacturer}/>
                    {addNewManufacturer ? <Input inputType="text" identifier="add-new" labelText="Device Manufacturer" placeholdertext={`Enter new device type`} /> : 
                    <SelectInput label="Manufacturer" optionData={currentManufacturers} />}
                    <div className="add-new-aligner"></div>
                </div>
                <Input inputType="file" identifier="new-image" labelText="New Device Image" />
            </div>            
            <div className="update-button add-new-upload-button" onClick={startUpload}>Upload New Data</div>
        </div>
    );
}