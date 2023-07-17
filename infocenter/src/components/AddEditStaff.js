import { useRef } from "react"
import { Input } from "./Input"
import { SelectInput } from "./SelectInput"

const locations = ["John Hunter Hospital", "Royal Newcastle Centre", "Mechanical/Anaesthetics", "Green Team", "Tamworth Hospital", "New England", "Mater Hospital", "Manning Base Hospital"]
const positions = ["Director", "Deputy Director", "Biomedical Engineer", "Senior Technical Officer", "Technical Officer", "Service Co-ordinator"]

export function AddEditStaff({type, page, selectedData, queryClient, showMessage, closeDialog, closeAddModal}) {

    // Define add new form DOM element and formdata refs
    const formData = new FormData();
    const newData = useRef(formData);
    const formContainer = useRef(null);

    const placeholderValue = page === "staff" ? "Full Name" : "equipment model" 
    const nameInputLabel = page === "staff" ? "Full Name" : "Equipment Model/Name"

    async function uploadStaffFormData(formContainer) {
        const staffDataOptions = ["Full Name", "Staff ID", "Office Phone"];
        
        // Get all the input elements
        const textInputs = formContainer.current.querySelectorAll('.text-input');
        const selectInputs = formContainer.current.querySelectorAll('.select-input');
        const fileInput = formContainer.current.querySelectorAll('#new-employee-image');
                
        // Convert text value node lists to arrays and store 
        const textInputArray = Array.from(textInputs);
        const [name, id, officePhone, dectPhone, workMobile, personalMobile] = Array.from(textInputs);
        const [workshop, position] = Array.from(selectInputs);
        const textValueInputsArray = [name, id, workshop, position, officePhone, dectPhone, workMobile, personalMobile];
    
        // Validate the relevant new staff data inputs
        for (let [index, input] of textInputArray.entries()) {
            if (index <= 2 && input.value === "") {
                showMessage("error", `The input for the new employee ${staffDataOptions[index]} is empty. Please enter the necessary data and try again.`)
                return;
            }
        };
    
        // Filter the empty data inputs out of the data and save to the Form Data
        let staffId;
        const inputIdentifier = ["name", "id", "workshop", "position", "office-phone", "dect-phone", "work-mobile", "personal-mobile"]
        textValueInputsArray.forEach((input, index) => {
            if (input.value !== "") {
                newData.current.set(inputIdentifier[index], input.value);
            }
            if (index === 1) {
                // Store the staff ID for naming the uploaded image file.
                staffId = input.value;
            }
        });
        
        // Add the uploaded file and file extension if it has been selected 
        if (fileInput[0].value !== "") {
            const extension = fileInput[0].files[0].name.split('.').slice(-1)[0];
            newData.current.set('extension', extension);
            newData.current.set('employee-photo', fileInput[0].files[0], `${staffId}.${extension}`);
        }
    
        // Show the uploading spinner dialog while uploading.
        showMessage("uploading", `Uploading Employee Data`)
    
        // Post the data to the server  
        const res = await fetch(`http://localhost:5000/AddNewEntry/${page}`, {
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