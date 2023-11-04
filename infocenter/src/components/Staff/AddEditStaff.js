import { useEffect, useRef } from "react"
import { useConfirmation, useProfilePhotoUpdate, useUser } from "../StateStore"
import { Input } from "../Input"
import { SelectInput } from "../SelectInput"
import { capitaliseFirstLetters, sortMandatoryFields } from "../../utils/utils"
import { serverConfig } from "../../server"

// Define the arrays used for mapping over to simplify logic
const locations = ["John Hunter Hospital", "Royal Newcastle Centre", "Mechanical/Anaesthetics", "Green Team", "Tamworth Hospital", "New England", "Mater Hospital", "Manning Base Hospital"]
const positions = ["Director", "Deputy Director", "Biomedical Engineer", "Senior Technical Officer", "Technical Officer", "Service Co-ordinator"]
const mandatoryFields = ["workshop", "position", "officePhone", "email"];
const keyIdentifier = ["name", "id", "workshop", "position", "officePhone", "dectPhone", "workMobile", "personalMobile", "hostname", "email"];
const inputFields = ["Name", "Staff ID", "Workshop", "Position", "Office Phone", "Dect Phone", "Work Mobile", "Personal Mobile", "Laptop Hostname", "Email Address"];

// Define array of regex's to use for validation.
const inputsRegexArray = [/^[a-z ,.'-]+$/i, //Name
                          /^[0-9]{8}$/i, //Staff ID
                          /^[a-z ,.'-]+$/i, //Workshop
                          /^[a-z ,.'-]+$/i, //Position
                          /^[0-9]{8}$|^[0-9]{3}\s[0-9]{5}$|^[0-9]{5}$/, //Office Phone
                          /^[0-9]{5}$|^\s*$/, // Dect Phone (allows empty string)
                          /^0[0-9]{9}$|^[0-9]{4}\s[0-9]{3}\s[0-9]{3}$|^\s*$/, // Mobile Phone (allows empty string)
                          /^0[0-9]{9}$|^[0-9]{4}\s[0-9]{3}\s[0-9]{3}$|^\s*$/, // Mobile Phone (allows empty string)
                          /^[A-Z]{3}BME[0-9]{3}|^\s*$/, // Hostname (allows empty string)
                          /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/ // Email
                        ];


function createFormData(updateData, formData) {
    for (const [key, value] of Object.entries(updateData)) {
        if (key === "employee-photo") {
            formData.set(key, value.file, value.fileName);
        }
        else {
            formData.set(key, value);
        }
    }
}

async function uploadStaffFormData(formContainer, updateData, type, page, selectedData, currentUser, setProfilePictureUpdates, setImageType, queryClient, message, showMessage, closeDialog, closeAddModal) {
        
    // Get all the input elements
    const textInputs = formContainer.current.querySelectorAll('.text-input');
    const selectInputs = formContainer.current.querySelectorAll('.select-input');
    const fileInput = formContainer.current.querySelectorAll('.file-input')
            
    // Convert text value node lists to arrays and store 
    const [name, id, officePhone, dectPhone, workMobile, personalMobile, hostname, email] = Array.from(textInputs);
    const [workshop, position] = Array.from(selectInputs);
    const textValueInputsArray = [name, id, workshop, position, officePhone, dectPhone, workMobile, personalMobile, hostname, email];
    
    // Initialise the staffId variable. Binding is used to name the image file if present.
    let staffId;
    
    // Validate the relevant new staff data inputs over the text inputs only.
    if (type === "add-new") {
        for (let [index, input] of textValueInputsArray.entries()) {
            if (index <= 4 || index === 9) {
                if (input.value === "") {
                    showMessage("warning", `The input for the new employee ${inputFields[index]} is empty. Please enter the necessary data and try again.`)
                    return;
                }
                else if (!inputsRegexArray[index].test(input.value)) {
                    showMessage("warning", `The input for the new employee ${inputFields[index]} is not valid. Please enter a valid value and try again.`)
                    return;
                }
                updateData.current[keyIdentifier[index]] = input.value;
            }
            else if (index >= 4 && input.value !== "") {
                if (!inputsRegexArray[index].test(input.value)) {
                    showMessage("warning", `The input ${inputFields[index]} is not a valid input. Please update to a valid entry and try again.`);
                    return;
                }
                updateData.current[keyIdentifier[index]] = input.value;
            }
        };
        
        // Add the uploaded file and file extension if it has been selected 
        if (fileInput[0].value !== "") {
            const extension = fileInput[0].files[0].name.split('.').slice(-1)[0];
            updateData.current['extension'] = extension;
            updateData.current['employee-photo'] = {file: fileInput[0].files[0], fileName: `${staffId}.${extension}`};
        }

        // Show the uploading dialog when sending to server
        showMessage("uploading", `Uploading Employee Data`);
        
        // Need to convert update data object into a FormData object.
        const formData = new FormData(); 
        createFormData(updateData.current, formData);
        
        try {

            //Post the data to the server  
            const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/AddNewEntry/${page}`, {
                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                    mode: "cors", // no-cors, *cors, same-origin
                    redirect: "follow", // manual, *follow, error
                    referrerPolicy: "no-referrer",
                    body: formData,
            })
    
            // Parse the received response
            const data = await res.json();
    
            if (data.type === "Error") {
                closeDialog();
                showMessage("error", `${data.message}. If the issue persists contact an administrator.`);
            }
            else {
            
                // Need to update app data.
                queryClient.invalidateQueries('dataSource');
        
                closeDialog();
                showMessage("info", 'Resources have been successfully updated!');
                
                // If image uploaded then re-render avatar component and re-fetch images. They are not cached. Response headers set in the server.
                if (updateData.current['employee-photo'] && selectedData.name === currentUser.user) {
                    setProfilePictureUpdates();
                    setImageType(updateData.current['extension']);
                }

                setTimeout(() => {
                    closeDialog();
                    closeAddModal();
                }, 1600);
            }
        }
        catch (error) {
            showMessage("error", `${error.message}.`)
        }
    }
    else if (type === "update") {
        // Check if any input values have been changed.
        for (let [index, input] of textValueInputsArray.entries()) {
            // These are non-mandatory inputs that must be validated
            if (index === 2 && input.value !== selectedData.hospital) {
                if (!inputsRegexArray[index].test(input.value)) {
                    showMessage("warning", `The input ${inputFields[index]} is not a valid input. Please update to a valid entry and try again.`);
                    return;
                }
                updateData.current[keyIdentifier[index]] = input.value;
            }
            else if (index !== 2 && input.value !== selectedData[keyIdentifier[index]]) {
                if (!inputsRegexArray[index].test(input.value)) {
                    showMessage("warning", `The input ${inputFields[index]} is not a valid input. Please update to a valid entry and try again.`);
                    return;
                }
                updateData.current[keyIdentifier[index]] = input.value;
            }
            
            // Add the staff ID to the upload data to identify the entry
            if (index === 1) {
                // Store the staff ID for naming the uploaded image file.
                staffId = input.value;
                updateData.current["existing-id"] = staffId;
            }
        };
        
        // Add the uploaded file and file extension if it has been selected 
        if (fileInput[0].value !== "") {
            const extension = fileInput[0].files[0].name.split('.').slice(-1)[0];
            updateData.current['extension'] = extension;
            updateData.current['employee-photo'] = {file: fileInput[0].files[0], fileName: `${staffId}.${extension}`};
        }
        
        // Calculate the number of updates applied and if any mandatory fields changed.
        let numberOfUpdates = 0;
        let numberOfMandatoryUpdates = 0;
        const changedMandatoryFields = [];
        for (const [key, value] of Object.entries(updateData.current)) {
            if (!["id", "name", "existing-id"].includes(key)) {
                numberOfUpdates++
            }
            if (mandatoryFields.includes(key)) {
                numberOfMandatoryUpdates++
                if (key === "workshop") {
                    changedMandatoryFields.push('Location');
                }
                else {
                    const keyIndex = keyIdentifier.indexOf(key);
                    changedMandatoryFields.push(inputFields[keyIndex]);
                }
            }
        };
        
        // Sort the fields into the correct order if more than one changed
        if (changedMandatoryFields.length > 1) {
            sortMandatoryFields(changedMandatoryFields);
        }
        
        // If no updates applied show warning message and prevent updates.
        if (numberOfUpdates === 0) {
            showMessage("warning", `The employee details have not been changed for ${selectedData.name}. No data has been uploaded.`)
            return;
        }
    
        // Add the email address if it has not been changed
        if (!updateData.current.email) {
            updateData.current.email = selectedData.email
        }

        // Ask for confirmation if mandatory update is made and complete in effect hook after re-render
        if (numberOfMandatoryUpdates !== 0) {
            // Set the confirmation to proceed dialog box.
            const changedFieldNumber = changedMandatoryFields.length;
            message.current = `The mandatory ${changedFieldNumber === 1 ? "field" : "fields"} ${changedMandatoryFields.slice(0, -1).join(', ')}${changedFieldNumber === 1 ? "" : " and"} ${changedMandatoryFields.slice(-1)[0]} ${changedFieldNumber === 1 ? "has" : "have"} been changed. Please confirm you wish to proceed or cancel to prevent updates and make changes.`;
            
            // Have user confirm to proceed if changing mandatory data
            showMessage("confirmation", message.current);
        }

        else {
            
            // Show loading dialog while updating data on the server
            showMessage("uploading", `Uploading Employee Data`);

            // Need to convert update data object into a FormData object.
            const formData = new FormData(); 
            createFormData(updateData.current, formData);
            
            try {
                // Post the data to the server  
                const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/UpdateEntry/${page}`, {
                        method: "PUT", // *GET, POST, PUT, DELETE, etc.
                        mode: "cors", // no-cors, *cors, same-origin
                        redirect: "follow", // manual, *follow, error
                        referrerPolicy: "no-referrer",
                        body: formData,
                })

                const data = await res.json();

                if (data.type === "Error") {
                    closeDialog();
                    showMessage("error", `${data.message}. If the issue persists please contact an administrator.`);
                }
                else {                            
                    // Need to update app data.
                    queryClient.invalidateQueries('dataSource');
        
                    closeDialog();
                    showMessage("info", 'Resources have been successfully updated!');

                    // If image uploaded then re-render avatar component and re-fetch images. They are not cached. Response headers set in the server.
                    if (updateData.current['employee-photo'] && selectedData.name === currentUser.user) {
                        setProfilePictureUpdates();
                        setImageType(updateData.current['extension']);
                    }
                    setTimeout(() => {
                        closeDialog();
                        closeAddModal();
                    }, 1600);
                }
            } catch (error) {
                showMessage("error", `${error.message}.`)
            }
        }
    }
}

export function AddEditStaff({type, page, selectedData, queryClient, showMessage, closeDialog, closeAddModal}) {
    
    // Define add new form DOM element and formdata refs
    const updateData = useRef({});
    if (type === "update") {
        updateData.current.name = selectedData.name;
        updateData.current.id = selectedData.id;
    }
    const formContainer = useRef(null);

    // Store the confirmation message in ref. Changes based on changed mandatory fields. 
    const message = useRef({type: "confirmation", message: "Message has not been set during confirmation." });
    
    // Get the confirmation result from Zustand state store.
    const confirmationResult = useConfirmation((state) => state.updateConfirmation);
    const resetConfirmationStatus = useConfirmation((state) => state.resetConfirmation);
    
    // Get the profile picture update state from Zustand state store and the current user details state setter to update file type
    const currentUser = useUser((state) => state.userCredentials);
    const setImageType = useUser((state) => state.updateImageType);
    const setProfilePictureUpdates = useProfilePhotoUpdate((state) => state.setProfilePhotoUpdates);

    const placeholderValue = page === "staff" ? "Full Name" : "equipment model" 
    const nameInputLabel = page === "staff" ? "Full Name" : "Equipment Model/Name"

    // Run effect hook if confirmation result provided to complete update after re-render
    useEffect(() => {
        if (confirmationResult === "proceed") {

            async function proceedwithUpload() {
                showMessage("uploading", `Uploading Employee Data`);

                // Need to convert update data object into a FormData object.
                const formData = new FormData(); 
                createFormData(updateData.current, formData);

                try {

                    // Post the data to the server  
                    const res = await fetch(`https://${serverConfig.host}:${serverConfig.port}/UpdateEntry/${page}`, {
                            method: "PUT", // *GET, POST, PUT, DELETE, etc.
                            mode: "cors", // no-cors, *cors, same-origin
                            redirect: "follow", // manual, *follow, error
                            referrerPolicy: "no-referrer",
                            body: formData,
                    })
        
                    const data = await res.json();

                    if (data.type === "Error") {
                        closeDialog();
                        showMessage("error", `${data.message}. If the issue persists please contact an administrator.`);
                    }
                    else {                            
                        // Need to update app data.
                        queryClient.invalidateQueries('dataSource');
            
                        closeDialog();
                        showMessage("info", 'Resources have been successfully updated!');
                        
                        // If image uploaded then re-render avatar component and re-fetch images. They are not cached. Response headers set in the server.
                        if (updateData.current['employee-photo'] && selectedData.name === currentUser.user) {
                            setProfilePictureUpdates();
                            setImageType(updateData.current['extension']);
                        }
                        
                        setTimeout(() => {
                            closeDialog();
                            closeAddModal();
                        }, 1600);
                    }
                } 
                catch (error) {
                    showMessage("error", `${error.message}.`)
                }
            }
            proceedwithUpload();
        }
        else if (confirmationResult === "cancel") {
            // Delete update data if reset
            for (const [key, value] of Object.entries(updateData.current)) {
                if (mandatoryFields.includes(key)) {
                    delete updateData.current[key]
                }
            }
            
        }
        return () => {
            resetConfirmationStatus();
        }    
    }, [confirmationResult, resetConfirmationStatus, closeDialog, page, showMessage, closeAddModal, queryClient, setImageType, setProfilePictureUpdates, currentUser, selectedData]);
          
    return (
        <div className="modal-display">
            <h3 className="add-new-heading">{type === "update" ? `${selectedData.name} Details` : null}</h3>
            <div className="add-new-staff-container" ref={formContainer}>
                {type === "update" ? <Input type="disabled" inputType="text" identifier="add-new" labelText={nameInputLabel} defaultValue={selectedData.name} /> :
                <Input inputType="text" identifier="add-new" labelText={nameInputLabel} placeholdertext={`Enter ${placeholderValue}`} />}
                {type === "update" ? <Input type="disabled" inputType="text" identifier="add-new" labelText="Staff ID" defaultValue={selectedData.id} /> :
                <Input inputType="text" identifier="add-new" labelText="Staff ID" placeholdertext={`Enter Employee Staff ID`} />}
                {type === "update" ? <SelectInput type="form-select-input" defaultValue={selectedData.hospital} label="Location" optionData={locations} /> : 
                <SelectInput type="form-select-input" label="Location" optionData={locations} />}
                {type === "update" ? <SelectInput type="form-select-input" defaultValue={selectedData.position} label="Position" optionData={positions} /> : 
                <SelectInput type="form-select-input" label="Position" optionData={positions} />}
                { type === "update" ? <Input type="update" inputType="text" identifier="add-new" labelText="Office Phone" defaultValue={selectedData.officePhone} /> :
                <Input inputType="text" identifier="add-new" labelText="Office Phone" placeholdertext={`Enter Office Phone Number`} />}
                {type === "update" && selectedData.dectPhone !== "" ? <Input type="update" inputType="text" defaultValue={selectedData.dectPhone} identifier="add-new" labelText="Dect Phone" /> : 
                <Input inputType="text" identifier="add-new" labelText="Dect Phone" placeholdertext={`Enter Dect Phone Number`} />}
                {type === "update" && selectedData.workMobile !== "" ? <Input type="update" inputType="text" defaultValue={selectedData.workMobile} identifier="add-new" labelText="Work Mobile" /> :
                <Input inputType="text" identifier="add-new" labelText="Work Mobile" placeholdertext={`Enter Work Mobile Number`} />}
                {type === "update" && selectedData.personalMobile !== "" ? <Input type="update" inputType="text" defaultValue={selectedData.personalMobile} identifier="add-new" labelText="Personal Mobile" /> :                  
                <Input inputType="text" identifier="add-new" labelText="Personal Mobile" placeholdertext={`Enter Personal Mobile Number`} />}
                {type === "update" && selectedData.hostname !== "" ? <Input type="update" inputType="text" defaultValue={selectedData.hostname} identifier="add-new" labelText="Laptop Hostname" /> :                  
                <Input inputType="text" identifier="add-new" labelText="Laptop Hostname" placeholdertext={`Enter Laptop Hostname`} />}
                {type === "update" && selectedData.email !== "" ? <Input type="update" inputType="text" defaultValue={selectedData.email} identifier="add-new" labelText="Email Address" /> :                  
                <Input inputType="text" identifier="add-new" labelText="Email Address" placeholdertext={`Enter Email Address`} />}
                <Input inputType="file" identifier="new-image" labelText={type === "update" ? "Update Employee Image" : "New Employee Image"} />
            </div>  
            <div className="update-button add-new-staff-upload-button" onClick={() => uploadStaffFormData(formContainer, updateData, type, page, selectedData, currentUser, setProfilePictureUpdates, setImageType, queryClient, message, showMessage, closeDialog, closeAddModal)}>Upload Data</div>
        </div>
    )
}
