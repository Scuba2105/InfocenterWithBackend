import { useState, useRef } from "react";
import { Input } from "./Input";
import { SelectInput } from "./SelectInput"
import { TooltipButton } from "./TooltipButton";
import { AddEditStaff } from "./AddEditStaff";
import { serverConfig } from "../server";

export function AddNewForm({page, selectedData, pageData, queryClient, showMessage, closeDialog, closeAddModal}) {
    
    const [addNewManufacturer, setAddNewManufacturer] = useState(false);
    const [addNewType, setaddNewType] = useState(false);
    
    // Define add new form DOM element and formdata refs
    const formData = new FormData();
    const newData = useRef(formData);
    const formContainer = useRef(null);

    const placeholderValue = page === "staff" ? "Full Name" : "equipment model" 
    const nameInputLabel = page === "staff" ? "Full Name" : "Equipment Model/Name"
  
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

    async function uploadEquipmentFormData(formContainer) {
        const deviceDataOptions = ["Model", "Type", "Manufacturer", "Image File"]
        const formDataNames = deviceDataOptions.map((option) => {
            return option.toLocaleLowerCase().replace(' ', '-');
        });
        const newForm = formContainer.current;
        
        // Get all the input elements in the add-new form
        const inputElements = getInputElements(newForm);

        // Validate the input data for the new device. All fields mandatory
        for (let [index, input] of inputElements.entries()) {
            if (input.value === "") {
                showMessage("error", `The input for the new device ${deviceDataOptions[index]} is empty. Please enter the necessary data and try again.`)
                return;
            }
            else if (unavailableModels.includes(input.value) && index === 0) {
                showMessage("warning", `The Model entered for the new device already exists. Please verify this device data is not already present before continuing.`)
                return;
            }
        };
        
        // Store the model name for saving the uploaded image file. 
        let model;

        // Append the input data to the form data object
        inputElements.forEach((input, index) => {
            if (index <= 2) {
                if (index === 0) {
                    model = input.value.toLocaleLowerCase().replace(/\s/ig, '_');
                } 
                newData.current.set(formDataNames[index], input.value);
            }
            else {
                const fileExt = input.files[0].name.split('.').slice(-1)[0];
                newData.current.set('extension', fileExt);
                newData.current.set(formDataNames[index], input.files[0], `${model}.${fileExt}`);
            }
        });

        // Show the uploading spinner dialog while uploading.
        showMessage("uploading", `Uploading ${model} Data`)

        // Post the data to the server  
        const res = await fetch(`http://${serverConfig.host}:${serverConfig.port}/AddNewEntry/${page}`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer",
                body: newData.current,
        }).catch((error) => {
            closeDialog();
            showMessage("error", error.message);
        })

        const data = await res.json();
        if (data.type === "Error") {
            closeDialog();
            showMessage("error", `${data.message}. Please check the image file which was uploaded and try again. If the issue persists contact the administrator.`);
        }
        else {
            // Need to clear formData at this point
            for (const pair of newData.current.entries()) {
                if (!['model', 'manufacturer'].includes(pair[0])) {
                    newData.current.delete(pair[0]);
                }
            }

            // Need to update app data.
            queryClient.invalidateQueries('dataSource');

            closeDialog();
            showMessage("info", 'Resources have been successfully updated!');
            setTimeout(() => {
                closeDialog();
                closeAddModal();
            }, 1600);
        }
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

    // Render the html based on the page prop
    if (page === "staff") {
        
        return (
            <>
                <AddEditStaff type="add-new" page={page} selectedData={selectedData} queryClient={queryClient} showMessage={showMessage} closeDialog={closeDialog} closeAddModal={closeAddModal} />
            </>
        )
    }
    else if (page === "technical-info") {
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
                <div className="update-button add-new-upload-button" onClick={() => uploadEquipmentFormData(formContainer)}>Upload New Data</div>
            </div>
        );
    }
}