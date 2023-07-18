import { useEffect, useRef } from "react"
import { useConfirmation } from "./StateStore"
import { Input } from "./Input"
import { SelectInput } from "./SelectInput"
import { capitaliseFirstLetters, sortMandatoryFields } from "../utils/utils"


const locations = ["John Hunter Hospital", "Royal Newcastle Centre", "Mechanical/Anaesthetics", "Green Team", "Tamworth Hospital", "New England", "Mater Hospital", "Manning Base Hospital"]
const positions = ["Director", "Deputy Director", "Biomedical Engineer", "Senior Technical Officer", "Technical Officer", "Service Co-ordinator"]
const mandatoryFields = ["workshop", "position", "office-phone"];
const keyIdentifier = ["name", "id", "workshop", "position", "office-phone", "dect-phone", "work-mobile", "personal-mobile"];

function createFormData(updateData) {
    const formData = new FormData();
    for (const [key, value] of Object.entries(updateData)) {
        if (key === "employee-photo") {
            formData.set(key, value.file, value.fileName);
        }
        else {

        }
        formData.set(key, value);
    }

    return formData
}

export function AddEditStaff({type, page, selectedData, queryClient, showMessage, closeDialog, closeAddModal}) {

    // Define add new form DOM element and formdata refs
    //const formData = new FormData();
    const updateData = useRef({});
    const formContainer = useRef(null);

    // Store the confirmation message in ref. Changes based on changed mandatory fields. 
    const message = useRef({type: "confirmation", message: "Message has not been set during confirmation." });
    
    // Get the confirmation result from Zustand state store.
    const confirmationResult = useConfirmation((state) => state.updateConfirmation)
    const resetConfirmationStatus = useConfirmation((state) => state.resetConfirmation)
    
    const placeholderValue = page === "staff" ? "Full Name" : "equipment model" 
    const nameInputLabel = page === "staff" ? "Full Name" : "Equipment Model/Name"

    // Run effect hook if confirmation result provided to complete update after re-render
    useEffect(() => {
        if (confirmationResult === "proceed") {

            async function proceedwithUpload() {
                showMessage("uploading", `Uploading Employee Data`);

                // Need to convert update data object into a FormData object.
                const formData = createFormData(updateData.current);

                // Post the data to the server  
                const res = await fetch(`http://localhost:5000/UpdateEntry/${page}`, {
                        method: "PUT", // *GET, POST, PUT, DELETE, etc.
                        mode: "cors", // no-cors, *cors, same-origin
                        redirect: "follow", // manual, *follow, error
                        referrerPolicy: "no-referrer",
                        body: formData,
                }).catch((error) => {
                    closeDialog();
                    showMessage("error", error.message);
                })
    
                const data = await res.json();
                
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
    }, [confirmationResult, resetConfirmationStatus, closeDialog, page, showMessage]);
    

        

    async function uploadStaffFormData(formContainer) {
        const staffDataOptions = ["Full Name", "Staff ID", "Office Phone"];
        
        // Get all the input elements
        const textInputs = formContainer.current.querySelectorAll('.text-input');
        const selectInputs = formContainer.current.querySelectorAll('.select-input');
        const fileInput = formContainer.current.querySelectorAll('.file-input')
                
        // Convert text value node lists to arrays and store 
        const textInputArray = Array.from(textInputs);
        const [name, id, officePhone, dectPhone, workMobile, personalMobile] = Array.from(textInputs);
        const [workshop, position] = Array.from(selectInputs);
        const textValueInputsArray = [name, id, workshop, position, officePhone, dectPhone, workMobile, personalMobile];
        
        // Validate the relevant new staff data inputs over the text inputs only.
        for (let [index, input] of textInputArray.entries()) {
            if (index <= 2 && input.value === "") {
                showMessage("error", `The input for the new employee ${staffDataOptions[index]} is empty. Please enter the necessary data and try again.`)
                return;
            }
        };
    
        // Filter the empty data inputs out of the data and save to the Form Data
        let staffId;
        const staffObjectProperties = ["name", "id", "hospital", "position", "officePhone", "dectPhone", "workMobile", "personalMobile"]
        textValueInputsArray.forEach((input, index) => {
            if (input.value !== "" && input.value !== selectedData[staffObjectProperties[index]]) {
                updateData.current[keyIdentifier[index]] = input.value;
            }
            if (index === 1) {
                // Store the staff ID for naming the uploaded image file.
                staffId = input.value;
            }
        });
        
        // Add the uploaded file and file extension if it has been selected 
        if (fileInput[0].value !== "") {
            const extension = fileInput[0].files[0].name.split('.').slice(-1)[0];
            updateData.current['extension'] = extension;
            updateData.current['employee-photo'] = {file: fileInput[0].files[0], fileName: `${staffId}.${extension}`};
        }
        
        // Add the current ID to identify the staff data being updated. Store in session storage for 
        // when component re-renders on confirmation or cancel
        updateData.current["existing-id"] = selectedData.id;

        // Calculate the number of updates applied and if any mandatory fields changed.
        let numberOfUpdates = 0;
        let numberOfMandatoryUpdates = 0;
        const changedMandatoryFields = [];
        for (const [key, value] of Object.entries(updateData.current)) {
            numberOfUpdates++
            console.log(key);
            if (mandatoryFields.includes(key)) {
                numberOfMandatoryUpdates++
                if (key === "workshop") {
                    changedMandatoryFields.push('Location');
                }
                else {
                    const fieldName = key.split('-').join(' ');
                    changedMandatoryFields.push(capitaliseFirstLetters(fieldName));
                }
            }
        };
        
        // Sort the fields into the correct order if more than one changed
        if (changedMandatoryFields.length > 1) {
            sortMandatoryFields(changedMandatoryFields);
        }
        
        // If no updates applied show warning message and prevent updates.
        if (numberOfUpdates === 1) {
            showMessage("warning", `The employee details have not been changed for ${selectedData.name}. No data has been uploaded.`)
            return;
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
            const formData = createFormData(updateData.current);                       

            for (const pair of formData.entries()) {
                console.log(pair[0], pair[1]);
            }

            // Post the data to the server  
            const res = await fetch(`http://localhost:5000/UpdateEntry/${page}`, {
                    method: "PUT", // *GET, POST, PUT, DELETE, etc.
                    mode: "cors", // no-cors, *cors, same-origin
                    redirect: "follow", // manual, *follow, error
                    referrerPolicy: "no-referrer",
                    body: formData,
            }).catch((error) => {
                closeDialog();
                showMessage("error", error.message);
            })

            const data = await res.json();
            
        }
        

        // Upload data is completed in useEffect on re-render after confirmation
        // // Start waiting for confirmation to proceed
                
        //Show the uploading sp2inner dialog while uploading.
        //showMessage("uploading", `Uploading Employee Data`)
    
        // Post the data to the server  
        // const res = await fetch(`http://localhost:5000/AddNewEntry/${page}`, {
        //         method: "POST", // *GET, POST, PUT, DELETE, etc.
        //         mode: "cors", // no-cors, *cors, same-origin
        //         redirect: "follow", // manual, *follow, error
        //         referrerPolicy: "no-referrer",
        //         body: updateData.current,
        // }).catch((error) => {
        //     closeDialog();
        //     showMessage("error", error.message);
        // })
    
        // const data = await res.json();
    
        // if (data.type === "Error") {
        //     closeDialog();
        //     showMessage("error", `${data.message}. Please check the image file which was uploaded and try again. If the issue persists contact the administrator.`);
        // }
        // else {
        //     // Need to clear formData at this point
        //     for (const pair of updateData.current.entries()) {
        //         if (!['model', 'manufacturer'].includes(pair[0])) {
        //             updateData.current.delete(pair[0]);
        //         }
        //     }
    
        //     // Need to update app data.
        //     queryClient.invalidateQueries('dataSource');
    
        //     closeDialog();
        //     showMessage("info", 'Resources have been successfully updated!');
        //     setTimeout(() => {
        //         closeDialog();
        //         closeAddModal();
        //     }, 1600);
    }
     return (
        <div className="modal-display">
            <h3 className="add-new-heading">{type === "update" ? `${selectedData.name} Details` : "New Employee Details"}</h3>
            <div className="add-new-staff-container" ref={formContainer}>
                {type === "update" ? <Input type="disabled" inputType="text" identifier="add-new" labelText={nameInputLabel} defaultValue={selectedData.name} /> :
                <Input inputType="text" identifier="add-new" labelText={nameInputLabel} placeholdertext={`Enter ${placeholderValue}`} />}
                {type === "update" ? <Input type="disabled" inputType="text" identifier="add-new" labelText="Staff ID" defaultValue={selectedData.id} /> :
                <Input inputType="text" identifier="add-new" labelText="Staff ID" placeholdertext={`Enter Employee Staff ID`} />}
                {type === "update" ? <SelectInput type="update" defaultValue={selectedData.hospital} label="Location" optionData={locations} /> : 
                <SelectInput label="Location" optionData={locations} />}
                {type === "update" ? <SelectInput type="update" defaultValue={selectedData.position} label="Position" optionData={positions} /> : 
                <SelectInput label="Position" optionData={positions} />}
                { type === "update" ? <Input type="update" inputType="text" identifier="add-new" labelText="Office Phone" defaultValue={selectedData.officePhone} /> :
                <Input inputType="text" identifier="add-new" labelText="Office Phone" placeholdertext={`Enter Office Phone Number`} />}
                {type === "update" && selectedData.dectPhone !== "" ? <Input type="update" inputType="text" defaultValue={selectedData.dectPhone} identifier="add-new" labelText="Dect Phone" /> : 
                <Input inputType="text" identifier="add-new" labelText="Dect Phone" placeholdertext={`Enter Dect Phone Number`} />}
                {type === "update" && selectedData.workMobile !== "" ? <Input type="update" inputType="text" defaultValue={selectedData.workMobile} identifier="add-new" labelText="Work Mobile" /> :
                <Input inputType="text" identifier="add-new" labelText="Work Mobile" placeholdertext={`Enter Work Mobile Number`} />}
                {type === "update" && selectedData.workMobile !== "" ? <Input type="update" inputType="text" defaultValue={selectedData.personalMobile} identifier="add-new" labelText="Personal Mobile" /> :                  
                <Input inputType="text" identifier="add-new" labelText="Personal Mobile" placeholdertext={`Enter Personal Mobile Number`} />}
                <Input inputType="file" identifier="new-image" labelText={type === "update" ? "Update Employee Image" : "New Employee Image"} />
            </div>  
            <div className="update-button add-new-staff-upload-button" onClick={() => uploadStaffFormData(formContainer)}>Upload New Data</div>
        </div>
    )
}
