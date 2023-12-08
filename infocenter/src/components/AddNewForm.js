import { useState, useRef } from "react";
import { Input } from "./Input";
import { SelectInput } from "./SelectInput"
import { TooltipButton } from "./TooltipButton";
import { AddEditStaff } from "./Staff/AddEditStaff";
import { FormButton } from "./FormButton";
import { serverConfig } from "../server";

// Generate the values for the models, types and manufacturers select menus
function generateExistingSelectValues(pageData, vendorData) {
    const selectInputsLists = pageData.reduce((acc, currEntry) => {
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
    }, {models: [], types: [], manufacturers: [], vendors: []});
    
    // Get the available vendors from the vendor data
    const availableVendors = vendorData.reduce((acc, currVendor) => {
        if (!acc.includes(currVendor.vendor)) {
            acc.push(currVendor.vendor);
        }
        return acc;
    }, []).sort();

    // Push the available vendors to the select input vendors list.
    selectInputsLists.vendors.push(...availableVendors);    

    return selectInputsLists;
}

// Toggle the type input between select and text input
function toggleAddNewType(setAddNewType) {
    setAddNewType(t => !t);
}

// Toggle the manufacturer input between select and text input
function toggleAddNewManufacturer(setAddNewManufacturer) {
    setAddNewManufacturer(m => !m);
}

// Get the input elements from the add new form for validation
function getInputElements(addNewManufacturer, addNewType, newForm) {
    const modelInput = newForm.querySelector('.text-input');
    let manufacturerInput, deviceTypeInput, vendorInput
    if (addNewManufacturer && !addNewType) {
        deviceTypeInput = newForm.querySelectorAll('.select-input')[0];
        manufacturerInput = newForm.querySelectorAll('.text-input')[1];
        vendorInput = newForm.querySelectorAll('.select-input')[1];
    }
    else if (!addNewManufacturer && addNewType) {
        deviceTypeInput = newForm.querySelectorAll('.text-input')[1];
        manufacturerInput = newForm.querySelectorAll('.select-input')[0];
        vendorInput = newForm.querySelectorAll('.select-input')[1];
    }
    else if (addNewManufacturer && addNewType) {
        deviceTypeInput = newForm.querySelectorAll('.text-input')[1];
        manufacturerInput = newForm.querySelectorAll('.text-input')[2]
        vendorInput = newForm.querySelectorAll('.select-input')[0];
    }
    else {
        deviceTypeInput = newForm.querySelectorAll('.select-input')[0];
        manufacturerInput = newForm.querySelectorAll('.select-input')[1]
        vendorInput = newForm.querySelectorAll('.select-input')[2];
    }
    
    const fileInput = newForm.querySelector(".file-input")
    
    return [modelInput, deviceTypeInput, manufacturerInput, vendorInput, fileInput];
}

async function uploadEquipmentFormData(addNewManufacturer, addNewType, formContainer, newData, unavailableModels, page, queryClient, showMessage, closeDialog, closeAddModal) {
    const deviceDataOptions = ["Model", "Type", "Manufacturer", "Vendor", "Image File"]
    const formDataNames = deviceDataOptions.map((option) => {
        return option.toLocaleLowerCase().replace(' ', '-');
    });
    const newForm = formContainer.current;
    
    // Get all the input elements in the add-new form
    const inputElements = getInputElements(addNewManufacturer, addNewType, newForm);
    
    // Validate the input data for the new device. All fields mandatory
    for (let [index, input] of inputElements.entries()) {

        if (input.value === "") {
            showMessage("warning", `The input for the new device ${deviceDataOptions[index]} is empty. Please enter the necessary data and try again.`)
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
        if (index <= 3) {
            if (index === 0) {
                model = input.value.toLocaleLowerCase().trim().replace(/\s/ig, '_');
            } 
            newData.current.set(formDataNames[index], input.value.trim());
        }
        else {
            const fileExt = input.files[0].name.split('.').slice(-1)[0];
            newData.current.set('extension', fileExt);
            newData.current.set(formDataNames[index], input.files[0], `${model}.${fileExt}`);
        }
    });

    // Show the uploading spinner dialog while uploading.
    showMessage("uploading", `Uploading ${model} Data`)
    
    try {
        // Post the data to the server  
        const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/AddNewEntry/${page}`, {
                method: "POST", // *GET, POST, PUT, DELETE, etc.
                mode: "cors", // no-cors, *cors, same-origin
                redirect: "follow", // manual, *follow, error
                referrerPolicy: "no-referrer",
                body: newData.current,
        });
        
        const data = await res.json();
        
        if (data.type === "Error") {
            closeDialog();
            showMessage("error", `${data.message} If the issue persists contact the administrator.`);
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
    catch (error) {
        showMessage("error", error.message);
    }
}

export function AddNewForm({page, selectedData, pageData, vendorData, queryClient, showMessage, closeDialog, closeAddModal}) {
    
    const [addNewManufacturer, setAddNewManufacturer] = useState(false);
    const [addNewType, setAddNewType] = useState(false);
    
    // Define add new form DOM element and formdata refs
    const formData = new FormData();
    const newData = useRef(formData);
    const formContainer = useRef(null);

    const placeholderValue = page === "staff" ? "Full Name" : "equipment model" 
    const nameInputLabel = page === "staff" ? "Full Name" : "Equipment Model/Name"
      
    let existingSelectValues, unavailableModels, currentTypes, currentManufacturers, currentVendors;
    // Generate existing values for data validation and consistency. 

    if (page === "technical-info") {
        existingSelectValues = generateExistingSelectValues(pageData, vendorData);
        // Need to validate inserted model to make sure it is no a conflict with existing entries.
        unavailableModels = existingSelectValues.models;
        currentTypes = existingSelectValues.types.sort();
        currentManufacturers = existingSelectValues.manufacturers.sort(); 
        currentVendors = existingSelectValues.vendors;
    } 

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
                <div className="add-new-input-container" ref={formContainer}>
                    <Input inputType="text" identifier="add-new" labelText={nameInputLabel} placeholdertext={`Enter new ${placeholderValue}`} />
                    <div className="edit-add-new-container">
                        <TooltipButton content={addNewType ? "Undo" :"Add New"} boolean={addNewType} toggleFunction={() => toggleAddNewType(setAddNewType)}/>
                        {addNewType ? <Input inputType="text" identifier="add-new" labelText="Device Type" placeholdertext={`Enter new device type`} /> : 
                        <SelectInput type="form-select-input" label="Device Type" optionData={currentTypes} />}
                        <div className="add-new-aligner"></div>
                    </div>
                    <div className="edit-add-new-container">
                        <TooltipButton content={addNewManufacturer ? "Undo" :"Add New"} boolean={addNewManufacturer} toggleFunction={() => toggleAddNewManufacturer(setAddNewManufacturer)}/>
                        {addNewManufacturer ? <Input inputType="text" identifier="add-new" labelText="Device Manufacturer" placeholdertext={`Enter new device type`} /> : 
                        <SelectInput type="form-select-input" label="Manufacturer" optionData={currentManufacturers} />}
                        <div className="add-new-aligner"></div>
                    </div>
                    <SelectInput type="form-select-input" label="Vendor / Service Agent" optionData={currentVendors} />
                    <Input inputType="file" identifier="new-image" labelText="New Device Image" />
                </div> 
                <FormButton content="Upload" btnColor="#D4FB7C" marginTop="30px" marginBottom="30px" onClick={() => uploadEquipmentFormData(addNewManufacturer, addNewType, formContainer, newData, unavailableModels, page, queryClient, showMessage, closeDialog, closeAddModal)} /> 
            </div>
        );
    }
}